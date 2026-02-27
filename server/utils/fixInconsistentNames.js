const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/startup_education';

const fixInconsistentNames = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to DB');

    // 1. Group subjects by University and Code
    const subjects = await Subject.find({});
    const groups = {};

    subjects.forEach(sub => {
      const key = `${sub.university}-${sub.code.toUpperCase()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(sub);
    });

    let updatedCount = 0;

    for (const key in groups) {
      const group = groups[key];
      if (group.length > 1) {
        // Find the "best" name in this group
        // Criteria: Longest name, or Title Case
        const bestSubject = group.reduce((prev, current) => {
           // Prefer "Data Structures" over "data structures"
           if (current.name[0] === current.name[0].toUpperCase() && prev.name[0] !== prev.name[0].toUpperCase()) return current;
           // Prefer longer name (usually less abbreviated)
           if (current.name.length > prev.name.length) return current;
           return prev;
        });

        const bestName = bestSubject.name;
        console.log(`Checking group ${key}: Best Name = "${bestName}"`);

        for (const sub of group) {
          if (sub.name !== bestName) {
            console.log(`  Updating ${sub.name} -> ${bestName}`);
            sub.name = bestName;
            await sub.save();
            updatedCount++;
          }
        }
      }
    }

    console.log(`\n🎉 Fix Complete! Updated ${updatedCount} subjects to have consistent names.`);
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixInconsistentNames();
