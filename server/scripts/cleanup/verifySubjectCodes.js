const puppeteer = require('puppeteer');
const fs = require('fs');

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load subjects that need verification
const subjectsData = JSON.parse(fs.readFileSync('./lpu_subjects_v2.json', 'utf-8'));

// Extract course code pattern from text
function extractCourseCode(text) {
    // Common LPU course code patterns: CSE111, INT-306, CAP 378, ECE249, etc.
    const patterns = [
        /\b([A-Z]{2,4}[-\s]?\d{2,4}[A-Z]?)\b/g
    ];
    
    const codes = new Set();
    for (const pattern of patterns) {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(m => {
                // Normalize the code (remove spaces/hyphens for comparison)
                const normalized = m.replace(/[-\s]/g, '').toUpperCase();
                if (normalized.length >= 5 && normalized.length <= 8) {
                    codes.add(m.toUpperCase());
                }
            });
        }
    }
    return [...codes];
}

async function verifySubjectCodes() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // Get subjects without codes (N/A) or with potentially wrong codes
    const subjectsToVerify = subjectsData.subjectsWithoutCode.slice(0, 20); // Start with 20 for testing
    
    const verifiedSubjects = [];
    
    for (let i = 0; i < subjectsToVerify.length; i++) {
        const subjectName = subjectsToVerify[i];
        console.log(`\n[${i + 1}/${subjectsToVerify.length}] Searching: "${subjectName}"`);
        
        try {
            // Search Google for subject name + LPU
            const searchQuery = `${subjectName} LPU course code syllabus`;
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await delay(2000); // Wait for results
            
            // Extract text from search results
            const resultText = await page.evaluate(() => {
                // Get text from search result snippets
                const snippets = document.querySelectorAll('.VwiC3b, .IsZvec, .MUxGbd, h3');
                let text = '';
                snippets.forEach(el => text += ' ' + el.textContent);
                return text;
            });
            
            // Extract course codes from results
            const foundCodes = extractCourseCode(resultText);
            
            if (foundCodes.length > 0) {
                console.log(`   Found codes: ${foundCodes.join(', ')}`);
                verifiedSubjects.push({
                    name: subjectName,
                    codesFound: foundCodes,
                    primaryCode: foundCodes[0] // Use first found code as primary
                });
            } else {
                console.log(`   No code found`);
                verifiedSubjects.push({
                    name: subjectName,
                    codesFound: [],
                    primaryCode: null
                });
            }
            
            // Add delay between searches to avoid rate limiting
            await delay(3000);
            
        } catch (error) {
            console.log(`   Error: ${error.message}`);
            verifiedSubjects.push({
                name: subjectName,
                error: error.message
            });
        }
    }
    
    await browser.close();
    
    // Save results
    const result = {
        verifiedAt: new Date().toISOString(),
        totalSearched: subjectsToVerify.length,
        withCodes: verifiedSubjects.filter(s => s.primaryCode).length,
        withoutCodes: verifiedSubjects.filter(s => !s.primaryCode && !s.error).length,
        errors: verifiedSubjects.filter(s => s.error).length,
        subjects: verifiedSubjects
    };
    
    fs.writeFileSync('./verified_subjects.json', JSON.stringify(result, null, 2));
    console.log('\n\n=== SUMMARY ===');
    console.log(`Searched: ${result.totalSearched}`);
    console.log(`Found codes: ${result.withCodes}`);
    console.log(`No codes found: ${result.withoutCodes}`);
    console.log(`Errors: ${result.errors}`);
    console.log('\nSaved to verified_subjects.json');
}

verifySubjectCodes();
