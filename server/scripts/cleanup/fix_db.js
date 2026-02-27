const mongoose = require('mongoose');
const Internship = require('./models/Internship');
const dotenv = require('dotenv');

dotenv.config();

const fixData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/startup_education');
    console.log('Connected to DB');

    // Fix Internship: Add deadline if missing
    const result = await Internship.updateMany(
      { deadline: { $exists: false } },
      { $set: { deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } } // Set to 7 days from now
    );
    console.log(`Updated ${result.modifiedCount} internships.`);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixData();
