const mongoose = require('mongoose');
const Internship = require('./models/Internship');
const dotenv = require('dotenv');

dotenv.config();

const fixDataById = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/startup_education');
    console.log('Connected to DB');

    const id = "692fd7bf0331b71f6043fc19"; // The ID from debug output
    const result = await Internship.findByIdAndUpdate(
      id,
      { deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 days from now
      { new: true }
    );
    console.log('Updated Internship:', result);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixDataById();
