const mongoose = require('mongoose');
const Subject = require('../models/Subject');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.log(err));

async function fixTypos() {
  try {
    const typoSubject = await Subject.findOne({ name: 'Data Struc' });
    if (typoSubject) {
      console.log('Found typo subject:', typoSubject.name);
      typoSubject.name = 'Data Structures';
      await typoSubject.save();
      console.log('Fixed to:', typoSubject.name);
    } else {
      console.log('No "Data Struc" found.');
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixTypos();
