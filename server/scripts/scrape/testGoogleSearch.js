const puppeteer = require('puppeteer');
const fs = require('fs');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Extract course code pattern from text
function extractCourseCode(text) {
    // LPU course codes: CSE111, INT-306, CAP 378, ECE249, MEC302, etc.
    const matches = text.match(/\b([A-Z]{2,4}[-\s]?\d{2,4}[A-Z]?)\b/gi) || [];
    const codes = [...new Set(matches.map(m => m.toUpperCase().replace(/[-\s]/g, '')))];
    return codes.filter(c => c.length >= 5 && c.length <= 8);
}

async function testGoogleSearch() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: false, // Show browser for debugging
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // Test subjects
    const testSubjects = [
        "Advance Creo ModellingMEC",
        "Orientation to computing",
        "Data Structures",
        "Machine Learning"
    ];

    for (const subject of testSubjects) {
        const searchQuery = `${subject} lpu`;
        console.log(`\nSearching: "${searchQuery}"`);
        
        try {
            await page.goto(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });
            
            await delay(2000);
            
            // Take screenshot
            await page.screenshot({ 
                path: `search_${subject.replace(/\s+/g, '_').substring(0, 20)}.png`,
                fullPage: false
            });
            
            // Get page text
            const pageText = await page.evaluate(() => document.body.innerText);
            
            // Find course codes
            const codes = extractCourseCode(pageText);
            console.log(`Found codes: ${codes.length > 0 ? codes.slice(0, 5).join(', ') : 'None'}`);
            
            // Print first 500 chars of relevant text
            console.log('Sample text:', pageText.substring(0, 500).replace(/\n/g, ' '));
            
            await delay(3000);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    console.log('\nDone! Check screenshots for results.');
    await browser.close();
}

testGoogleSearch();
