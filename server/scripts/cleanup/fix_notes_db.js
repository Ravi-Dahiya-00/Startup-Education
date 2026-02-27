const mongoose = require('mongoose');
const Note = require('./models/Note');
const dotenv = require('dotenv');

dotenv.config();

const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const fixNotes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/startup_education');
    console.log('Connected to DB');

    const notes = await Note.find({});
    let count = 0;

    for (const note of notes) {
      let updated = false;
      
      // Fix University (e.g., "lpu" -> "LPU" or "Lpu")
      // Let's just make it Uppercase for abbreviations like LPU, IIT, etc? 
      // Or Title Case? Let's do Title Case for now, but maybe special case LPU?
      // The user likely wants "LPU".
      
      let newUni = note.university;
      if (newUni.toLowerCase() === 'lpu') newUni = 'LPU';
      else if (newUni.toLowerCase() === 'iit') newUni = 'IIT';
      else newUni = toTitleCase(newUni);

      let newBranch = note.branch;
      if (newBranch.toLowerCase() === 'cse') newBranch = 'CSE';
      else if (newBranch.toLowerCase() === 'ece') newBranch = 'ECE';
      else newBranch = toTitleCase(newBranch);

      if (note.university !== newUni || note.branch !== newBranch) {
        note.university = newUni;
        note.branch = newBranch;
        await note.save();
        updated = true;
        count++;
      }
    }

    console.log(`Fixed ${count} notes.`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixNotes();
