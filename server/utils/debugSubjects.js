const mongoose = require('mongoose');
const Subject = require('../models/Subject');
const Branch = require('../models/Branch');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/startup_education';

const listSubjects = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to DB');

    const subjects = await Subject.find({}).populate('branch', 'name');
    console.log('--- ALL SUBJECTS ---');
    subjects.forEach(s => {
      console.log(`ID: ${s._id}`);
      console.log(`Name: "${s.name}"`);
      console.log(`Code: "${s.code}"`);
      console.log(`Branch: ${s.branch ? s.branch.name : 'NULL'} (${s.branch ? s.branch._id : 'NULL'})`);
      console.log(`Semester: ${s.semester}`);
      console.log('-------------------');
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listSubjects();
