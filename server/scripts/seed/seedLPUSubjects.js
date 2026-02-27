const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const University = require('./models/University');
const Branch = require('./models/Branch');
const Subject = require('./models/Subject');

// Load the cleaned subjects data
const subjectsData = JSON.parse(fs.readFileSync('../lpu_subjects_cleaned.json', 'utf-8'));

async function seedLPUSubjects() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find or create LPU university
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

        // Create a general branch for all subjects (since we don't have branch-specific data)
        // We'll create a "General/All Subjects" branch
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

        // Clear existing subjects for this branch (to avoid duplicates on re-run)
        const deleted = await Subject.deleteMany({ branch: generalBranch._id });
        console.log(`Cleared ${deleted.deletedCount} existing subjects`);

        // Prepare subjects array
        const subjectsToInsert = [];
        
        for (const subject of subjectsData.subjects) {
            // Clean up subject name
            let name = subject.name.trim();
            
            // Skip if name is too short or weird
            if (name.length < 3) continue;
            
            // Extract code if available
            let code = 'N/A';
            if (subject.codes && subject.codes.length > 0) {
                code = subject.codes[0]; // Use first code
            }

            // Since we don't have semester info, we'll default to semester 1
            // Users can filter by subject name instead
            subjectsToInsert.push({
                name: name,
                code: code,
                branch: generalBranch._id,
                semester: 1 // Default semester
            });
        }

        console.log(`Inserting ${subjectsToInsert.length} subjects...`);
        
        // Insert in batches to avoid memory issues
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
        
        // Verify
        const count = await Subject.countDocuments({ branch: generalBranch._id });
        console.log(`Verification: ${count} subjects in database for LPU`);

    } catch (error) {
        console.error('Error seeding LPU subjects:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedLPUSubjects();
