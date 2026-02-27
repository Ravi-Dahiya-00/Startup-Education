const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');
const { parseJobWithAI } = require('./aiHelper');
const { normalizeJob } = require('./jobFetcher'); // Reuse normalization if possible or reimplement simple save

// Load env specific to where script is run
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/startup_education';

const searchQueries = [
  'hiring react developer intern india',
  'freshers javascript jobs remote',
  'startup marketing internship india',
  'entry level ui ux designer hiring',
  'looking for nodejs intern twitter'
];

async function autoCrawl() {
  console.log('🕷️ Spider Starting...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ Missing Gemini API Key');
    return;
  }

  await mongoose.connect(MONGO_URI);
  console.log('✅ DB Connected');

  const browser = await puppeteer.launch({
    headless: true, // Visible for debugging if false
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Pick a random query
    const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
    console.log(`🔎 Searching: "${query}"`);

    // Use DuckDuckGo with a more reliable selector strategy
    await page.goto(`https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' }); // Use HTML version for easier scraping
    
    // Extract Links from HTML version
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.result__a'));
      return anchors.map(a => a.href);
    });

    console.log(`Found ${links.length} raw links.`);

    for (const link of links) {
      console.log(`Checking link: ${link}`);
      
      if (!link || link.includes('duckduckgo') || link.includes('google') || link.includes('search')) {
        console.log('   Skipping: Internal/Search link');
        continue;
      }

      console.log(`🕸️ Visiting: ${link}`);
      try {
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 15000 });
        
        // Extract Reader Text (simplified)
        // Get generic body text
        const textContent = await page.evaluate(() => {
          // Heuristic: Get text from main tag, or body, limit length
          const main = document.querySelector('main') || document.body;
          if (!main) return '';
          return main.innerText.substring(0, 5000); // Limit to 5000 chars for AI
        });

        // Skip if too short
        if (textContent.length < 200) {
            console.log('   Skipping: Content too short.');
            continue;
        }

        console.log('   🧠 Processing with AI...');
        const jobData = await parseJobWithAI(textContent);

        // Validation - Does it look like a real job?
        if (jobData.title === "Job Title" || jobData.company === "Unknown Company" || !jobData.jobType) {
            console.log('   ⚠️ AI returned generic/empty data. Skipping.');
            continue;
        }

        // Save to DB
        // Check duplication by title + company
        const uniqueKey = `${jobData.title}-${jobData.company}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        const existing = await Job.findOne({ uniqueKey });
        if (existing) {
             console.log('   ♻️ Duplicate found. Skipping.');
             continue;
        }

        const newJob = new Job({
            role: jobData.title, // Map title to role
            company: jobData.company,
            location: jobData.location,
            type: jobData.jobType?.includes('Intern') ? 'Internship' : 'Full Time', 
            salary: jobData.salary || 'Not Disclosed',
            description: jobData.description,
            requirements: jobData.skills,
            skills: jobData.skills,
            category: jobData.category || 'Engineering', // Default if AI misses it
            applyUrl: jobData.applyUrl || link, 
            source: `Crawler (${jobData.detectedFrom || 'Web'})`,
            uniqueKey: uniqueKey,
            postedAt: new Date()
        });

        await newJob.save();
        console.log(`   ✅ SAVED: ${jobData.title} at ${jobData.company}`);

      } catch (err) {
        console.error(`   ❌ Failed to process ${link}:`, err.message);
      }
    }

  } catch (err) {
    console.error('Crawler Error:', err);
  } finally {
    await browser.close();
    await mongoose.disconnect();
    console.log('🕷️ Spider Finished.');
  }
}

// Run immediately if called directly
if (require.main === module) {
  autoCrawl();
}

module.exports = { autoCrawl };
