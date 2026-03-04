const express = require("express");
const router = express.Router();
const { adminAuth, adminLockoutLimiter } = require("../middleware/adminAuth");

// POST /api/admin/verify
// Frontend uses this to test if a passkey is correct before letting them view the dashboard
router.post("/verify", adminLockoutLimiter, adminAuth, (req, res) => {
  // If the request passes the adminAuth middleware, the passkey is correct!
  res.status(200).json({ success: true, message: "Admin verification successful" });
});

module.exports = router;
