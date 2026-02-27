const puppeteer = require('puppeteer');
const fs = require('fs');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Extract course code pattern from text  
function extractCourseCode(text) {
    const matches = text.match(/\b([A-Z]{2,4}[-\s]?\d{2,4}[A-Z]?)\b/gi) || [];
    const codes = [...new Set(matches.map(m => m.toUpperCase().replace(/[-\s]/g, '')))];
    // Filter to likely valid course codes (3-4 letters + 2-4 digits)
    return codes.filter(c => c.length >= 5 && c.length <= 8 && /^[A-Z]{2,4}\d{2,4}$/.test(c));
}

// Clean subject name (remove merged codes)
function cleanSubjectName(name) {
    // Remove codes that are merged at the end: "Advance Creo ModellingMEC" -> "Advance Creo Modelling"
    return name.replace(/([a-z])([A-Z]{2,4}\d{0,4})$/g, '$1').trim();
}

async function verifyAllSubjects() {
    console.log('Loading subject data...');
    const subjectsData = JSON.parse(fs.readFileSync('./lpu_subjects_v2.json', 'utf-8'));
    
    // Get subjects without proper codes
    const subjectsToVerify = subjectsData.subjectsWithoutCode;
    console.log(`Found ${subjectsToVerify.length} subjects without codes to verify`);
    
    console.log('\nLaunching browser...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    const verifiedSubjects = [];
    let successCount = 0;

    for (let i = 0; i < subjectsToVerify.length; i++) {
        const rawName = subjectsToVerify[i];
        const cleanName = cleanSubjectName(rawName);
        
        console.log(`\n[${i + 1}/${subjectsToVerify.length}] "${cleanName}"`);
        
        try {
            const query = `${rawName} lpu`;
            await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });
            
            await delay(2000);
            
            const pageText = await page.evaluate(() => document.body.innerText);
            const codes = extractCourseCode(pageText);
            
            if (codes.length > 0) {
                console.log(`   ✓ Found: ${codes[0]}`);
                verifiedSubjects.push({
                    originalName: rawName,
                    cleanedName: cleanName,
                    code: codes[0],
                    allCodesFound: codes.slice(0, 3)
                });
                successCount++;
            } else {
                console.log(`   ✗ No code found`);
                verifiedSubjects.push({
                    originalName: rawName,
                    cleanedName: cleanName,
                    code: 'N/A',
                    allCodesFound: []
                });
            }
            
            // Rate limiting - wait between requests
            await delay(2500);
            
        } catch (error) {
            console.log(`   ! Error: ${error.message}`);
            verifiedSubjects.push({
                originalName: rawName,
                cleanedName: cleanName,
                code: 'ERROR',
                error: error.message
            });
        }
    }

    await browser.close();
    
    // Save results
    const result = {
        verifiedAt: new Date().toISOString(),
        totalSearched: subjectsToVerify.length,
        codesFound: successCount,
        notFound: subjectsToVerify.length - successCount,
        subjects: verifiedSubjects.filter(s => s.code !== 'N/A' && s.code !== 'ERROR')
    };
    
    fs.writeFileSync('./verified_subjects_full.json', JSON.stringify(result, null, 2));
    
    console.log('\n\n====== SUMMARY ======');
    console.log(`Total searched: ${subjectsToVerify.length}`);
    console.log(`Codes found: ${successCount}`);
    console.log(`Not found: ${subjectsToVerify.length - successCount}`);
    console.log('\nSaved to verified_subjects_full.json');
    
    // Also show what can be added to database
    console.log('\n=== SUBJECTS TO ADD ===');
    result.subjects.slice(0, 20).forEach(s => {
        console.log(`${s.code}: ${s.cleanedName}`);
    });
}

verifyAllSubjects();
