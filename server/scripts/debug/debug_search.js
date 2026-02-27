const mongoose = require('mongoose');
const Internship = require('./models/Internship');
const Job = require('./models/Job');
const Course = require('./models/Course');
require('dotenv').config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Check Internships
    const internshipCount = await Internship.countDocuments();
    console.log(`\n📊 Internships found: ${internshipCount}`);
    if (internshipCount > 0) {
      const sample = await Internship.findOne();
      console.log('Sample Internship:', JSON.stringify(sample, null, 2));
      
      // Test Search
      const query = "fron";
      const regex = new RegExp(query, 'i');
      const matches = await Internship.find({
        $or: [
          { role: regex },
          { company: regex },
          { title: regex } // Checking if title exists instead
        ]
      });
      console.log(`\n🔍 Searching for "${query}" in Internships: Found ${matches.length} matches`);
    }

    // 2. Check Jobs
    const jobCount = await Job.countDocuments();
    console.log(`\n📊 Jobs found: ${jobCount}`);
    if (jobCount > 0) {
      const sample = await Job.findOne();
      console.log('Sample Job:', JSON.stringify(sample, null, 2));
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkData();
