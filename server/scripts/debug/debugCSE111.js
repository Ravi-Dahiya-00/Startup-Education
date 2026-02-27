const mongoose = require('mongoose');
require('dotenv').config();
const Subject = require('./models/Subject');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Searching for CSE111 and related subjects...\n');
    
    // Find by code
    const byCode = await Subject.find({ code: 'CSE111' });
    console.log('By code CSE111:', byCode.length, 'results');
    byCode.forEach(s => console.log('  -', s.name));
    
    // Find by name containing "computer parts"
    const byComputerParts = await Subject.find({ name: /computer parts/i });
    console.log('\nBy name "computer parts":', byComputerParts.length, 'results');
    byComputerParts.forEach(s => console.log('  -', s.code, ':', s.name));
    
    // Find by name containing "orientation"
    const byOrientation = await Subject.find({ name: /orientation/i });
    console.log('\nBy name "orientation":', byOrientation.length, 'results');
    byOrientation.forEach(s => console.log('  -', s.code, ':', s.name));
    
    await mongoose.disconnect();
});
