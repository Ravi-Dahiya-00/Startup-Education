const puppeteer = require('puppeteer');
const fs = require('fs');

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeStudocuLPU() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('Navigating to Studocu LPU page...');
    await page.goto('https://www.studocu.com/in/institution/lovely-professional-university/4149', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Wait for the page to load
    await delay(3000);

    // Try to find and click "Show more" or "Load more" buttons if they exist
    let hasMore = true;
    let clickCount = 0;
    const maxClicks = 20; // Limit to prevent infinite loops

    while (hasMore && clickCount < maxClicks) {
      try {
        // Look for various "show more" button patterns
        const showMoreButton = await page.$('button:has-text("Show more"), button:has-text("Load more"), [data-testid="show-more"], .show-more-button');
        
        if (showMoreButton) {
          await showMoreButton.click();
          clickCount++;
          console.log(`Clicked "Show more" button (${clickCount} times)`);
          await delay(2000); // Wait for content to load
        } else {
          hasMore = false;
        }
      } catch (e) {
        hasMore = false;
      }
    }

    console.log('Extracting subjects...');

    // Extract all subject/course names from the page
    const subjects = await page.evaluate(() => {
      const subjectElements = [];
      
      // Try various selectors that might contain subject names
      const selectors = [
        'a[href*="/course/"]',
        '.course-name',
        '[data-testid="course-link"]',
        '.subject-link',
        'h3 a',
        'h4 a',
        '.course-item a',
        '[class*="course"] a',
        '[class*="subject"] a'
      ];

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          const text = el.textContent?.trim();
          if (text && text.length > 2 && text.length < 200) {
            subjectElements.push(text);
          }
        });
      });

      // Also try to get text from links that look like courses
      document.querySelectorAll('a').forEach(el => {
        const href = el.href || '';
        const text = el.textContent?.trim();
        if ((href.includes('/course/') || href.includes('/document/')) && text && text.length > 2) {
          subjectElements.push(text);
        }
      });

      // Remove duplicates and return
      return [...new Set(subjectElements)];
    });

    // Also get the raw page content for debugging
    const pageContent = await page.content();
    
    console.log(`Found ${subjects.length} subjects/courses`);

    // Create result object
    const result = {
      university: "Lovely Professional University",
      source: "Studocu",
      scrapedAt: new Date().toISOString(),
      subjectCount: subjects.length,
      subjects: subjects.sort()
    };

    // Save to JSON file
    fs.writeFileSync('studocu_lpu_subjects.json', JSON.stringify(result, null, 2));
    console.log('Saved to studocu_lpu_subjects.json');

    // Print first 20 subjects as preview
    console.log('\nFirst 20 subjects:');
    subjects.slice(0, 20).forEach((s, i) => console.log(`${i + 1}. ${s}`));

    // Save page HTML for debugging if needed
    fs.writeFileSync('studocu_debug.html', pageContent);
    console.log('Debug HTML saved to studocu_debug.html');

  } catch (error) {
    console.error('Error during scraping:', error.message);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

scrapeStudocuLPU();
