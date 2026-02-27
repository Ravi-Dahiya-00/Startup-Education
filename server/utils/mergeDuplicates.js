const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Note = require('../models/Note');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/startup_education';

const mergeDuplicates = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to DB');

    // 1. Find all subjects
    const subjects = await Subject.find({});
    console.log(`Scanning ${subjects.length} subjects...`);

    const processedIds = new Set();
    let mergedCount = 0;

    for (const subject of subjects) {
      if (processedIds.has(subject._id.toString())) continue;

      // Find duplicates (Same Code OR Very Similar Name)
      // We use a simple normalization here for the script
      const normalizedCode = subject.code.trim().toUpperCase();
      
      const duplicates = subjects.filter(s => 
        s._id.toString() !== subject._id.toString() &&
        !processedIds.has(s._id.toString()) &&
        s.branch.toString() === subject.branch.toString() &&
        (
          s.code.trim().toUpperCase() === normalizedCode || 
          s.name.toLowerCase().trim() === subject.name.toLowerCase().trim()
        )
      );

      if (duplicates.length > 0) {
        console.log(`Found duplicates for ${subject.name} (${subject.code}):`);
        
        // Pick the "best" subject to keep (e.g., proper casing, oldest, or just the first one)
        // Let's prefer the one with the "cleanest" name (e.g. Title Case)
        const allGroup = [subject, ...duplicates];
        
        // Simple heuristic: longest name usually has full words, or check for capitalization
        const bestSubject = allGroup.reduce((prev, current) => {
            // Prefer "Data Structures" over "data structures"
            if (current.name[0] === current.name[0].toUpperCase() && prev.name[0] !== prev.name[0].toUpperCase()) return current;
            return prev;
        });

        console.log(`  Keeping: ${bestSubject.name} (${bestSubject._id})`);
        
        for (const dup of allGroup) {
          if (dup._id.toString() === bestSubject._id.toString()) continue;
          
          console.log(`  Merging: ${dup.name} (${dup._id}) -> ${bestSubject.name}`);
          
          // Move Notes
          const updateResult = await Note.updateMany(
            { subject: dup._id },
            { subject: bestSubject._id }
          );
          console.log(`    Moved ${updateResult.modifiedCount} notes.`);

          // Delete Duplicate Subject
          await Subject.findByIdAndDelete(dup._id);
          processedIds.add(dup._id.toString());
          mergedCount++;
        }
        processedIds.add(bestSubject._id.toString());
      }
    }

    console.log(`\n🎉 Merge Complete! Merged ${mergedCount} duplicate subjects.`);
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

mergeDuplicates();
