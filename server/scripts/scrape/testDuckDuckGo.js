const puppeteer = require('puppeteer');
const fs = require('fs');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Extract course code pattern from text  
function extractCourseCode(text) {
    const matches = text.match(/\b([A-Z]{2,4}[-\s]?\d{2,4}[A-Z]?)\b/gi) || [];
    const codes = [...new Set(matches.map(m => m.toUpperCase().replace(/[-\s]/g, '')))];
    return codes.filter(c => c.length >= 5 && c.length <= 8);
}

async function testDuckDuckGo() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // Test with DuckDuckGo
    const testSubjects = [
        "Advance Creo Modelling MEC lpu",
        "Orientation to computing lpu CSE111",
        "Data Structures lpu course code"
    ];

    for (const query of testSubjects) {
        console.log(`\nSearching DuckDuckGo: "${query}"`);
        
        try {
            // DuckDuckGo search
            await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });
            
            await delay(3000);
            
            // Get page text
            const pageText = await page.evaluate(() => document.body.innerText);
            
            // Find course codes
            const codes = extractCourseCode(pageText);
            console.log(`Found codes: ${codes.length > 0 ? codes.slice(0, 10).join(', ') : 'None'}`);
            
            // Print relevant text
            const lines = pageText.split('\n').filter(l => l.includes('LPU') || l.match(/[A-Z]{2,4}\d{2,4}/));
            console.log('Relevant lines:');
            lines.slice(0, 5).forEach(l => console.log('  -', l.substring(0, 100)));
            
            await delay(2000);
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    await browser.close();
    console.log('\nDone!');
}

testDuckDuckGo();
