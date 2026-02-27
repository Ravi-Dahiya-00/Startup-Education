const express = require("express");
const router = express.Router();
const { syncInternships } = require("../utils/internshipFetcher");

// GET /api/internships/sync
// Description: Manually triggers the internship fetching process
// Access: Public (typically should be protected, but open for this demo/MVP)
router.get("/sync", async (req, res) => {
  try {
    const stats = await syncInternships();
    res.json({
      message: "Internship synchronization completed",
      stats,
    });
  } catch (error) {
    console.error("Manual Internship Sync Failed:", error);
    res.status(500).json({
      message: "Internship synchronization failed",
      error: error.message,
    });
  }
});

module.exports = router;
