const mongoose = require('mongoose');
require('dotenv').config();
const University = require('./models/University');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const count = await University.countDocuments();
    console.log('Total Universities:', count);

    const dups = await University.aggregate([
      { 
        $group: { 
          _id: { $toLower: "$name" }, 
          count: { $sum: 1 } 
        } 
      }, 
      { 
        $match: { 
          count: { $gt: 1 } 
        } 
      }
    ]);

    console.log('Duplicates found:', dups.length);
    if (dups.length > 0) {
      console.log('Sample duplicates:', dups.slice(0, 5));
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
});
