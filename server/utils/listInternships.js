const mongoose = require('mongoose');
const Internship = require('../models/Internship');
require('dotenv').config();

async function listInternships() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const all = await Internship.find({});
    console.log('--- All Internships ---');
    all.forEach(i => {
      console.log(`ID: ${i._id}, Role: "${i.role}", Company: "${i.company}"`);
    });
    console.log('-----------------------');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listInternships();
