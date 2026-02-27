const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Note = require('../models/Note');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

async function findDuplicates() {
  try {
    const subjects = await Subject.find({});
    const map = {};

    subjects.forEach(sub => {
      const key = `${sub.code}-${sub.branch}`;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(sub);
    });

    for (const key in map) {
      if (map[key].length > 1) {
        console.log(`\nDuplicate found for Code: ${map[key][0].code} in Branch: ${map[key][0].branch}`);
        map[key].forEach(s => {
          console.log(` - ID: ${s._id}, Name: "${s.name}", Semester: ${s.semester}`);
        });
      }
    }

    console.log('\nDone checking.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

findDuplicates();
