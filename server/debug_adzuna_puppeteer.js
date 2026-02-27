require('dotenv').config({ path: './server/.env' });
const axios = require('axios');
const puppeteer = require('puppeteer');

const resolveWithPuppeteer = async (url) => {
  console.log(`\n--- Puppeteer Resolving: ${url} ---`);
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  try {
    // Set a real user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Go to URL and wait for network idle to ensure redirects finish
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    const finalUrl = page.url();
    console.log(`Puppeteer Resolved to: ${finalUrl}`);
    
    await browser.close();
    return finalUrl;
  } catch (e) {
    console.error('Puppeteer Error:', e.message);
    await browser.close();
    return url;
  }
};

const run = async () => {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    console.error('Missing credentials');
    return;
  }

  try {
    console.log('Fetching 1 job from Adzuna...');
    const res = await axios.get(`https://api.adzuna.com/v1/api/jobs/in/search/1`, {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        what: 'software engineer',
        results_per_page: 1,
        'content-type': 'application/json'
      }
    });

    const job = res.data.results[0];
    if (job) {
      console.log(`Raw URL: ${job.redirect_url}`);
      await resolveWithPuppeteer(job.redirect_url);
    } else {
      console.log('No jobs found to test');
    }
  } catch (e) {
    console.error(e);
  }
};

run();
