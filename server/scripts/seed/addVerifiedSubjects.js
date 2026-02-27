const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const University = require('./models/University');
const Branch = require('./models/Branch');
const Subject = require('./models/Subject');

// Load verified subjects
const verifiedData = JSON.parse(fs.readFileSync('./verified_subjects_full.json', 'utf-8'));

// Valid LPU course code prefixes
const validPrefixes = [
    'CSE', 'INT', 'ECE', 'MEC', 'PHY', 'MTH', 'CHE', 'LAW', 'MGN', 'MKT', 
    'FIN', 'ACC', 'HMT', 'PEL', 'PEV', 'CAP', 'BTY', 'BIO', 'CIV', 'SOC',
    'PSY', 'ASE', 'CHEM', 'ECOM', 'ECO', 'FOT', 'CSI', 'CSR', 'CSF', 'CSG',
    'DCAP', 'DMGT', 'DENG', 'DHIS', 'IXD', 'PBA', 'MLT', 'HRM', 'MGNM', 
    'MKTM', 'CORE', 'GEN', 'YOGA'
];

// Filter out noise codes
const noisePrefixes = ['FIND', 'FOR', 'FEES', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'WITH', 'AND', 'THE', 
    'OF', 'IN', 'TO', 'DAY', 'TERM', 'OVER', 'TOP', 'SM', 'LEC', 'NONE',
    'SHOW', 'USED', 'ALL', 'NCAA', 'HAS', 'PART', 'CODE', 'AMNS', 'PYQS'];

function isValidCode(code) {
    if (!code) return false;
    const upperCode = code.toUpperCase();
    
    // Check if starts with noise prefix
    for (const noise of noisePrefixes) {
        if (upperCode.startsWith(noise)) return false;
    }
    
    // Check if starts with valid prefix
    for (const valid of validPrefixes) {
        if (upperCode.startsWith(valid) && /\d{2,4}$/.test(upperCode)) return true;
    }
    
    // LPU specific codes like LAW2091
    if (/^[A-Z]{2,4}\d{2,4}$/.test(upperCode)) {
        // Check for known good patterns
        if (upperCode.match(/^(CSE|INT|ECE|MEC|PHY|MTH|CHE|LAW|MGN|MKT|FIN|ACC|CAP|PEL|PEV|BIO|BTY|CIV|SOC|PSY|ASE|FOT|HMT|MLT|HRM|IXD|PBA|CSI|CSR|CSF|CSG)\d+$/)) {
            return true;
        }
    }
    
    return false;
}

// Clean subject name
function cleanName(originalName) {
    let name = originalName;
    
    // Remove merged codes at end
    name = name.replace(/([a-z])([A-Z]{2,4}\s*\d{2,4})$/g, '$1');
    name = name.replace(/([a-z])([A-Z]{2,4}-\d{2,4})$/g, '$1');
    
    // Remove document noise
    name = name.replace(/^(Unit-?\d+|UNIT-?\d+)[:\s-]+/i, '');
    name = name.replace(/(Study Guide|Lecture Notes|Sample Paper|SRS|MCQ|Overview).*$/i, '');
    name = name.replace(/\s*\([^\)]+\)\s*$/g, '');
    
    // Trim and capitalize
    name = name.trim();
    if (name.length > 0) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    
    return name;
}

async function updateDatabase() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find LPU and branch
    const lpu = await University.findOne({ name: /lovely professional/i });
    if (!lpu) {
        console.log('LPU not found!');
        return;
    }

    const branch = await Branch.findOne({ university: lpu._id, code: 'ALL' });
    if (!branch) {
        console.log('All Subjects branch not found!');
        return;
    }

    // Process verified subjects
    const validSubjects = [];
    const skippedSubjects = [];

    for (const sub of verifiedData.subjects) {
        // Find valid code from allCodesFound
        let validCode = null;
        
        for (const code of sub.allCodesFound || []) {
            if (isValidCode(code)) {
                validCode = code;
                break;
            }
        }

        if (validCode) {
            const cleanedName = cleanName(sub.originalName);
            if (cleanedName.length >= 3) {
                validSubjects.push({
                    originalName: sub.originalName,
                    name: cleanedName,
                    code: validCode.toUpperCase()
                });
            }
        } else {
            skippedSubjects.push(sub.originalName);
        }
    }

    console.log(`\nValid subjects to add: ${validSubjects.length}`);
    console.log(`Skipped (no valid code): ${skippedSubjects.length}`);

    // Show sample of valid subjects
    console.log('\n=== SAMPLE VALID SUBJECTS ===');
    validSubjects.slice(0, 20).forEach(s => {
        console.log(`${s.code}: ${s.name}`);
    });

    // Check for duplicates with existing data
    console.log('\n=== Checking for duplicates... ===');
    const existingSubjects = await Subject.find({ branch: branch._id });
    const existingCodes = new Set(existingSubjects.map(s => s.code.toUpperCase()));
    
    const newSubjects = validSubjects.filter(s => !existingCodes.has(s.code));
    console.log(`Already in DB: ${validSubjects.length - newSubjects.length}`);
    console.log(`New to add: ${newSubjects.length}`);

    if (newSubjects.length > 0) {
        console.log('\n=== Adding new subjects... ===');
        const toInsert = newSubjects.map(s => ({
            name: s.name,
            code: s.code,
            branch: branch._id,
            semester: 1
        }));

        await Subject.insertMany(toInsert);
        console.log(`✅ Added ${newSubjects.length} new subjects!`);
    }

    // Show total count
    const totalCount = await Subject.countDocuments({ branch: branch._id });
    console.log(`\nTotal subjects for LPU: ${totalCount}`);

    await mongoose.disconnect();
}

updateDatabase().catch(console.error);
