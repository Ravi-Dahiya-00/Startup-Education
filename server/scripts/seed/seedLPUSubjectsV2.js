const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const University = require('./models/University');
const Branch = require('./models/Branch');
const Subject = require('./models/Subject');

// Load the improved cleaned subjects data
const subjectsData = JSON.parse(fs.readFileSync('./lpu_subjects_v2.json', 'utf-8'));

async function seedLPUSubjects() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find LPU university
        let lpu = await University.findOne({ 
            $or: [
                { name: /lovely professional/i },
                { aliases: 'LPU' }
            ]
        });

        if (!lpu) {
            console.log('Creating LPU university...');
            lpu = await University.create({
                name: 'Lovely Professional University',
                aliases: ['LPU'],
                location: 'Phagwara, Punjab'
            });
        }
        console.log(`Found/Created LPU: ${lpu.name} (ID: ${lpu._id})`);

        // Find or create general branch
        let generalBranch = await Branch.findOne({ 
            university: lpu._id,
            code: 'ALL'
        });

        if (!generalBranch) {
            console.log('Creating General branch for LPU...');
            generalBranch = await Branch.create({
                name: 'All Subjects',
                code: 'ALL',
                university: lpu._id
            });
        }
        console.log(`General Branch: ${generalBranch.name} (ID: ${generalBranch._id})`);

        // Clear existing subjects for this branch
        const deleted = await Subject.deleteMany({ branch: generalBranch._id });
        console.log(`Cleared ${deleted.deletedCount} existing subjects`);

        // Prepare subjects array from the improved data
        const subjectsToInsert = [];
        
        // Add subjects WITH codes (using the best name)
        for (const subject of subjectsData.subjectsWithCode) {
            // Clean up the name - remove any document titles/noise
            let name = subject.name;
            
            // Remove common noise patterns like ": Final Exam Study Guide for..."
            name = name.replace(/^:?\s*(Final Exam|End Term|Mid Term|Unit-?\d+|Sample Paper).*?(?=for|of|in|-)?\s*/i, '');
            name = name.replace(/^:?\s*/, ''); // Remove leading colons
            
            // If name still contains noise, try to extract clean part
            if (name.includes('Study Guide') || name.includes('Exam')) {
                // Use alternate name if available and cleaner
                if (subject.alternateNames && subject.alternateNames.length > 0) {
                    // Find the cleanest alternate name
                    const cleanAlternate = subject.alternateNames.find(n => 
                        !n.includes('Study Guide') && 
                        !n.includes('Exam') && 
                        !n.includes('Sample Paper') &&
                        n.length < 50
                    );
                    if (cleanAlternate) name = cleanAlternate;
                }
            }
            
            // Final cleanup
            name = name.trim();
            
            if (name.length < 3) continue;
            
            subjectsToInsert.push({
                name: name,
                code: subject.code,
                branch: generalBranch._id,
                semester: 1 // Default semester
            });
        }
        
        // Add subjects WITHOUT codes
        for (const name of subjectsData.subjectsWithoutCode) {
            if (name.length < 3) continue;
            
            subjectsToInsert.push({
                name: name,
                code: 'N/A',
                branch: generalBranch._id,
                semester: 1
            });
        }

        console.log(`\nInserting ${subjectsToInsert.length} subjects...`);
        
        // Insert in batches
        const batchSize = 100;
        let inserted = 0;
        
        for (let i = 0; i < subjectsToInsert.length; i += batchSize) {
            const batch = subjectsToInsert.slice(i, i + batchSize);
            await Subject.insertMany(batch);
            inserted += batch.length;
            console.log(`Inserted ${inserted}/${subjectsToInsert.length} subjects`);
        }

        console.log('\n✅ Successfully seeded LPU subjects!');
        console.log(`Total subjects added: ${inserted}`);
        
        // Show some examples
        console.log('\n📚 Sample subjects:');
        const samples = await Subject.find({ branch: generalBranch._id }).limit(10);
        samples.forEach(s => console.log(`   ${s.code}: ${s.name}`));

    } catch (error) {
        console.error('Error seeding LPU subjects:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

seedLPUSubjects();
