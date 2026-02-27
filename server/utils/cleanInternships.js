const mongoose = require('mongoose');
const Internship = require('../models/Internship');
require('dotenv').config();

async function cleanInternships() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    const allInternships = await Internship.find({});
    console.log(`Scanning ${allInternships.length} internships...`);

    const junkIds = [];
    const junkPatterns = [/n\s*kj/i, /jj\s*jl/i, /yjk/i, /test/i, /asdf/i, /qwer/i];

    for (const item of allInternships) {
      const role = item.role || '';
      const company = item.company || '';
      
      let isJunk = false;

      // Check patterns
      if (junkPatterns.some(p => p.test(role) || p.test(company))) {
        isJunk = true;
      }

      // Check length (very short)
      if (role.trim().length < 4 || company.trim().length < 4) {
        // Exclude some potentially valid short names if necessary, but for now assume < 4 is junk
        // Valid 3 letter companies exist (PwC, IBM), so let's be careful.
        // If it's 3 letters, maybe check if it's all uppercase?
        // Let's just stick to the user's specific junk for now + very short < 3
        if (role.trim().length < 3 || company.trim().length < 3) {
             isJunk = true;
        }
      }

      if (isJunk) {
        console.log(`Found Junk: Role="${role}", Company="${company}" (ID: ${item._id})`);
        junkIds.push(item._id);
      }
    }

    if (junkIds.length > 0) {
      const res = await Internship.deleteMany({ _id: { $in: junkIds } });
      console.log(`Deleted ${res.deletedCount} junk items.`);
    } else {
      console.log('No junk items found matching criteria.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cleanInternships();
