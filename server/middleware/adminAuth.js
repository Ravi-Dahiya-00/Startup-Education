const rateLimit = require("express-rate-limit");

// IP blocking: 5 failed attempts = blocked for 30 minutes
const adminLockoutLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, 
  max: 5, 
  message: { message: "Too many failed admin attempts from this IP. You have been blocked for 30 minutes for security purposes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const adminAuth = (req, res, next) => {
  const passkey = req.header("x-admin-passkey");

  if (!passkey) {
    return res.status(401).json({ message: "Admin passkey required" });
  }

  // Ensure ADMIN_PASSKEY is actually set in the environment
  const expectedKey = process.env.ADMIN_PASSKEY;
  if (!expectedKey) {
    console.error("FATAL: ADMIN_PASSKEY environment variable is not set on the server.");
    return res.status(500).json({ message: "Server misconfiguration. Admin access temporarily disabled." });
  }

  if (passkey !== expectedKey) {
    return res.status(401).json({ message: "Invalid Admin Passkey" });
  }

  // Passkey matches exactly
  next();
};

module.exports = {
  adminAuth,
  adminLockoutLimiter
};
