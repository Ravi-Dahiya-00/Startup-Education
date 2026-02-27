const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set!");
  process.exit(1);
}

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Fix for Google Auth Cross-Origin-Opener-Policy
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// Routes
const internshipRoutes = require("./routes/internships");
const jobRoutes = require("./routes/jobs");
const competitionRoutes = require("./routes/competitions");
const courseRoutes = require("./routes/courses");
const blogRoutes = require("./routes/blogs");
const scholarshipRoutes = require("./routes/scholarships");
const noteRoutes = require("./routes/notes");
const authRoutes = require("./routes/auth");
const structureRoutes = require("./routes/structure");
const smartRoutes = require("./routes/smart"); // New
const searchRoutes = require("./routes/search"); // Global search
const companyRoutes = require("./routes/company"); // Company profiles
const jobsSyncRoutes = require("./routes/jobsSync");
const { syncJobs } = require("./utils/jobFetcher");
const cron = require("node-cron");

// Job Sync Scheduler (Every 12 hours)
// Job Sync Scheduler (Every 12 hours) - Only for local dev
if (process.env.NODE_ENV !== "production") {
  cron.schedule("0 */12 * * *", async () => {
    console.log("⏳ Running Scheduled Job Sync...");
    try {
      await syncJobs();
    } catch (err) {
      console.error("Scheduled Job Sync Failed:", err);
    }
  });
}

app.use("/api/internships", require("./routes/internshipsSync"));
app.use("/api/internships", internshipRoutes);
app.use("/api/jobs", jobsSyncRoutes); // Register before jobRoutes to handle /sync
app.use("/api/jobs", jobRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/structure", structureRoutes);
app.use("/api/smart", smartRoutes); // New
app.use("/api/search", searchRoutes); // Global search
app.use("/api/company", companyRoutes); // Company profiles
app.use("/api/ai", require("./routes/aiRoutes")); // AI Parser
app.use("/api/users", require("./routes/users"));
app.use("/api/coding-problems", require("./routes/codingRoutes")); // Coding Practice

// Basic Route
app.get("/", (req, res) => {
  res.send("Startup Education API is running");
});

// MongoDB Connection
// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/startup_education";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error(
      "   Please make sure MongoDB is running locally on port 27017",
    );
  });

const startCleanupJob = require("./cron/cleanup");

// Start Cron Job
// Start Cron Job
// startCleanupJob();

// Global 404 Handler - Prevents HTML fallback
app.use((req, res) => {
  res.status(404).json({ message: "API Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
