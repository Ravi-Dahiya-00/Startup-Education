const mongoose = require('mongoose');
const Internship = require('./models/Internship');
const Note = require('./models/Note');
const dotenv = require('dotenv');

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/startup_education');
    console.log('Connected to DB');

    const internships = await Internship.find({});
    console.log('--- INTERNSHIPS ---');
    console.log(JSON.stringify(internships, null, 2));

    const notes = await Note.find({});
    console.log('--- NOTES ---');
    console.log(JSON.stringify(notes, null, 2));

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkData();
