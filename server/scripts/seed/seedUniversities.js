const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const University = require('./models/University');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/startup_education';

async function seedUniversities() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    let hipolabsData = [];
    try {
      console.log('🌍 Fetching universities from Hipolabs API...');
      const hipolabsResponse = await axios.get('http://universities.hipolabs.com/search?country=India', { timeout: 10000 });
      hipolabsData = hipolabsResponse.data;
      console.log(`📦 Fetched ${hipolabsData.length} universities from Hipolabs.`);
    } catch (err) {
      console.warn('⚠️ Failed to fetch from Hipolabs:', err.message);
    }

    let githubData = [];
    try {
      console.log('🌍 Fetching colleges from GitHub API...');
      const githubResponse = await axios.get('https://raw.githubusercontent.com/VarthanV/Indian-Colleges-List/master/colleges.json', { timeout: 10000 });
      githubData = githubResponse.data;
      console.log(`📦 Fetched ${githubData.length} colleges from GitHub.`);
    } catch (err) {
      console.warn('⚠️ Failed to fetch from GitHub:', err.message);
    }

    // Manual Data & Aliases Map
    const manualData = {
      'Chandigarh University': { aliases: ['CU'], location: 'Punjab' },
      'Lovely Professional University': { aliases: ['LPU'], location: 'Punjab' },
      'Indian Institute of Technology Delhi': { aliases: ['IITD', 'IIT Delhi'], location: 'Delhi' },
      'Indian Institute of Technology Bombay': { aliases: ['IITB', 'IIT Bombay'], location: 'Maharashtra' },
      'Indian Institute of Technology Madras': { aliases: ['IITM', 'IIT Madras'], location: 'Tamil Nadu' },
      'Indian Institute of Technology Kanpur': { aliases: ['IITK', 'IIT Kanpur'], location: 'Uttar Pradesh' },
      'Indian Institute of Technology Kharagpur': { aliases: ['IITKGP', 'IIT Kharagpur'], location: 'West Bengal' },
      'Birla Institute of Technology and Science': { aliases: ['BITS', 'BITS Pilani'], location: 'Rajasthan' },
      'Delhi University': { aliases: ['DU'], location: 'Delhi' },
      'Jawaharlal Nehru University': { aliases: ['JNU'], location: 'Delhi' },
      'Banaras Hindu University': { aliases: ['BHU'], location: 'Uttar Pradesh' },
      'Vellore Institute of Technology': { aliases: ['VIT'], location: 'Tamil Nadu' },
      'Manipal Academy of Higher Education': { aliases: ['Manipal', 'MAHE'], location: 'Karnataka' },
      'Thapar Institute of Engineering and Technology': { aliases: ['TIET', 'Thapar'], location: 'Punjab' },
      'Amity University': { aliases: ['Amity'], location: 'Noida' },
      'SRM Institute of Science and Technology': { aliases: ['SRM'], location: 'Tamil Nadu' }
    };

    // Deduplication Map: Normalized Name -> University Object
    const uniqueUniversities = new Map();

    // Helper to normalize name
    const normalize = (str) => str.toLowerCase().trim().replace(/\s+/g, ' ');
    
    // Helper to clean name (remove IDs like (Id: U-0003))
    const cleanName = (str) => str.replace(/\(Id:.*?\)/g, '').trim();

    // 1. Process Manual Data (Highest Priority)
    Object.keys(manualData).forEach(name => {
      uniqueUniversities.set(normalize(name), {
        name: name,
        location: manualData[name].location,
        aliases: manualData[name].aliases
      });
    });

    // 2. Process Hipolabs Data
    hipolabsData.forEach(uni => {
      const name = uni.name;
      const normalized = normalize(name);
      if (!uniqueUniversities.has(normalized)) {
        uniqueUniversities.set(normalized, {
          name: name,
          location: uni['state-province'] || 'India',
          aliases: []
        });
      }
    });

    // 3. Process GitHub Data
    githubData.forEach(item => {
      // Add College
      if (item.college) {
        const rawName = cleanName(item.college);
        const normalized = normalize(rawName);
        if (!uniqueUniversities.has(normalized)) {
          uniqueUniversities.set(normalized, {
            name: rawName,
            location: item.state || 'India',
            aliases: []
          });
        }
      }
      
      // Add University (Affiliating body)
      if (item.university) {
        const rawUniName = cleanName(item.university);
        const normalizedUni = normalize(rawUniName);
        if (!uniqueUniversities.has(normalizedUni)) {
          uniqueUniversities.set(normalizedUni, {
            name: rawUniName,
            location: item.state || 'India',
            aliases: []
          });
        }
      }
    });

    const finalList = Array.from(uniqueUniversities.values());
    console.log(`✨ Total unique institutes to process: ${finalList.length}`);

    let addedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    console.log('💾 Seeding database... (This may take a moment)');

    // Use bulkWrite for better performance with large datasets
    const bulkOps = finalList.map(uni => ({
      updateOne: {
        filter: { name: uni.name },
        update: { 
          $set: { 
            name: uni.name, 
            location: uni.location,
            aliases: uni.aliases || []
          } 
        },
        upsert: true
      }
    }));

    // Execute in chunks of 1000 to avoid memory issues or timeouts
    const CHUNK_SIZE = 1000;
    for (let i = 0; i < bulkOps.length; i += CHUNK_SIZE) {
      const chunk = bulkOps.slice(i, i + CHUNK_SIZE);
      try {
        const result = await University.bulkWrite(chunk);
        addedCount += result.upsertedCount;
        updatedCount += result.modifiedCount;
        if (i % 5000 === 0) console.log(`   Processed ${i} / ${bulkOps.length}...`);
      } catch (err) {
        console.error(`❌ Error processing chunk ${i}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n🎉 Seeding Complete!');
    console.log(`✅ Added: ${addedCount}`);
    console.log(`🔄 Updated: ${updatedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📚 Total Universities in DB: ${await University.countDocuments()}`);

    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);

  } catch (err) {
    console.error('❌ Fatal Error:', err);
    process.exit(1);
  }
}

seedUniversities();
