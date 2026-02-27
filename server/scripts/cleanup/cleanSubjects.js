const fs = require('fs');

// Load the raw scraped data
const rawData = JSON.parse(fs.readFileSync('studocu_lpu_subjects.json', 'utf-8'));

// Clean and organize subjects
const cleanedSubjects = [];
const subjectCodeMap = {};

rawData.subjects.forEach(item => {
    // Skip items that are clearly not subject names (ratings, percentages at start)
    if (/^\d+%/.test(item) || item.length < 3) return;
    
    // Remove common noise patterns
    let cleaned = item
        .replace(/\d+%\(\d+\)$/, '')  // Remove rating like "100%(5)"
        .replace(/None$/, '')          // Remove "None" at end
        .replace(/^\d+/, '')           // Remove leading numbers
        .trim();
    
    // Try to extract course name and code
    // Pattern: "Subject NameCOURSE_CODE" or "Subject Name CODE"
    const codeMatch = cleaned.match(/^(.+?)([A-Z]{2,}[\s\-]?\d{2,}[A-Z]?)$/);
    
    if (codeMatch) {
        const subjectName = codeMatch[1].trim();
        const courseCode = codeMatch[2].trim();
        
        if (subjectName && subjectName.length > 2) {
            // Avoid duplicates
            const key = subjectName.toLowerCase();
            if (!subjectCodeMap[key]) {
                subjectCodeMap[key] = {
                    name: subjectName,
                    codes: [courseCode]
                };
            } else if (!subjectCodeMap[key].codes.includes(courseCode)) {
                subjectCodeMap[key].codes.push(courseCode);
            }
        }
    } else if (cleaned.length > 2) {
        // Subject without clear code pattern
        const key = cleaned.toLowerCase();
        if (!subjectCodeMap[key]) {
            subjectCodeMap[key] = {
                name: cleaned,
                codes: []
            };
        }
    }
});

// Convert to array and sort
const subjects = Object.values(subjectCodeMap)
    .map(s => ({
        name: s.name,
        codes: s.codes.length > 0 ? s.codes : undefined
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

const result = {
    university: "Lovely Professional University",
    source: "Studocu",
    cleanedAt: new Date().toISOString(),
    totalSubjects: subjects.length,
    subjects: subjects
};

// Save cleaned data
fs.writeFileSync('lpu_subjects_cleaned.json', JSON.stringify(result, null, 2));
console.log(`Cleaned ${subjects.length} unique subjects from ${rawData.subjects.length} raw entries`);
console.log('Saved to lpu_subjects_cleaned.json');

// Print sample
console.log('\nSample of cleaned subjects:');
subjects.slice(0, 30).forEach((s, i) => {
    const codes = s.codes ? ` [${s.codes.join(', ')}]` : '';
    console.log(`${i + 1}. ${s.name}${codes}`);
});
