const fs = require('fs');

// Load the raw scraped data
const rawData = JSON.parse(fs.readFileSync('../studocu_lpu_subjects.json', 'utf-8'));

// Course code patterns: CSE111, INT 312, CAP-653, etc.
const codePattern = /([A-Z]{2,}[\s\-]?\d{2,}[A-Z]?)/g;

// Group by course code
const codeMap = {};

rawData.subjects.forEach(item => {
    // Skip items that are clearly not subject names
    if (item.length < 5) return;
    
    // Find all course codes in the item
    const codes = item.match(codePattern);
    
    if (codes && codes.length > 0) {
        // Extract the subject name by removing the code, ratings, etc.
        let name = item
            .replace(/\d+%\(\d+\)$/, '')  // Remove rating like "100%(5)"
            .replace(/None$/, '')          // Remove "None" at end
            .replace(/^\d+/, '')           // Remove leading numbers
            .trim();
        
        // Remove the code from the name to get clean subject name
        codes.forEach(code => {
            name = name.replace(code, '').trim();
        });
        
        // Clean up any remaining artifacts
        name = name.replace(/\s+/g, ' ').trim();
        
        // Skip if name is too short after cleaning
        if (name.length < 3) return;
        
        // Use the first code as the primary key
        const primaryCode = codes[0].replace(/\s/g, ''); // Normalize code (remove spaces)
        
        if (!codeMap[primaryCode]) {
            codeMap[primaryCode] = {
                code: primaryCode,
                names: [],
                allCodes: new Set()
            };
        }
        
        // Add name if not already present
        if (!codeMap[primaryCode].names.includes(name)) {
            codeMap[primaryCode].names.push(name);
        }
        
        // Track all variant codes
        codes.forEach(c => codeMap[primaryCode].allCodes.add(c.replace(/\s/g, '')));
    }
});

// Convert to array and pick the best name for each code
const subjects = Object.values(codeMap).map(entry => {
    // Pick the longest name as it's likely the most descriptive
    const bestName = entry.names.reduce((a, b) => a.length > b.length ? a : b, entry.names[0]);
    
    return {
        code: entry.code,
        name: bestName,
        alternateNames: entry.names.length > 1 ? entry.names.filter(n => n !== bestName) : undefined,
        alternateCodes: entry.allCodes.size > 1 ? [...entry.allCodes].filter(c => c !== entry.code) : undefined
    };
}).sort((a, b) => a.code.localeCompare(b.code));

// Also capture subjects WITHOUT codes
const noCodeSubjects = [];
rawData.subjects.forEach(item => {
    const codes = item.match(codePattern);
    if (!codes) {
        let name = item
            .replace(/\d+%\(\d+\)$/, '')
            .replace(/None$/, '')
            .replace(/^\d+/, '')
            .trim();
        
        if (name.length > 3 && !noCodeSubjects.includes(name)) {
            noCodeSubjects.push(name);
        }
    }
});

const result = {
    university: "Lovely Professional University",
    source: "Studocu",
    cleanedAt: new Date().toISOString(),
    totalSubjectsWithCode: subjects.length,
    totalSubjectsWithoutCode: noCodeSubjects.length,
    subjectsWithCode: subjects,
    subjectsWithoutCode: noCodeSubjects.sort()
};

// Save cleaned data
fs.writeFileSync('lpu_subjects_v2.json', JSON.stringify(result, null, 2));

console.log(`\n📊 Cleaning Results:`);
console.log(`   Subjects with course codes: ${subjects.length}`);
console.log(`   Subjects without codes: ${noCodeSubjects.length}`);
console.log(`   Total unique subjects: ${subjects.length + noCodeSubjects.length}`);
console.log(`\nSaved to lpu_subjects_v2.json`);

// Show examples of subjects with multiple names
console.log('\n📚 Examples of subjects with multiple names (same code):');
subjects
    .filter(s => s.alternateNames && s.alternateNames.length > 0)
    .slice(0, 10)
    .forEach(s => {
        console.log(`   ${s.code}: "${s.name}"`);
        console.log(`      Also known as: ${s.alternateNames.map(n => `"${n}"`).join(', ')}`);
    });
