const express = require('express');
const router = express.Router();
const { syncJobs } = require('../utils/jobFetcher');

// GET /api/jobs/sync
// Manually triggers the job fetcher
router.get('/sync', async (req, res) => {
  try {
    const stats = await syncJobs();
    res.json({
      success: true,
      message: 'Job synchronization completed',
      stats
    });
  } catch (error) {
    console.error('Manual Sync Failed:', error);
    res.status(500).json({
      success: false,
      message: 'Job synchronization failed',
      error: error.message
    });
  }
});

module.exports = router;
