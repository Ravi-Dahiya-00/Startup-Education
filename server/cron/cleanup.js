const cron = require('node-cron');
const Internship = require('../models/Internship');
const Job = require('../models/Job');

const startCleanupJob = () => {
  // Run every hour: '0 * * * *'
  // For testing, we can run every minute: '* * * * *'
  // Let's stick to every hour for production-like behavior
  cron.schedule('0 * * * *', async () => {
    console.log('Running cleanup job...');
    
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

    try {
      // Delete Internships older than 2 days past deadline
      const internshipResult = await Internship.deleteMany({
        deadline: { $lt: twoDaysAgo }
      });
      if (internshipResult.deletedCount > 0) {
        console.log(`Deleted ${internshipResult.deletedCount} expired internships.`);
      }

      // Delete Jobs older than 2 days past deadline
      const jobResult = await Job.deleteMany({
        deadline: { $lt: twoDaysAgo }
      });
      if (jobResult.deletedCount > 0) {
        console.log(`Deleted ${jobResult.deletedCount} expired jobs.`);
      }

    } catch (error) {
      console.error('Error in cleanup job:', error);
    }
  });
  
  console.log('🕒 Cleanup job scheduled (checks every hour).');
};

module.exports = startCleanupJob;
