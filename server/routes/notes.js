const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
// Ensure uploads directory exists
const uploadDir =
  process.env.NODE_ENV === "production"
    ? "/tmp/uploads"
    : path.join(__dirname, "../uploads");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (error) {
  console.warn("Warning: Could not create upload directory:", error.message);
}

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// GET all notes (with filtering)
router.get("/", async (req, res) => {
  try {
    const { university, branch, semester, subject, category, search, sort } =
      req.query;
    let query = {};

    // We need to filter based on ObjectIds if we are using the new schema
    // But the frontend might send strings (names) or IDs.
    // For now, let's assume the frontend sends IDs for Uni/Branch/Subject if selected from dropdowns.

    if (university) query.university = university;
    if (branch) query.branch = branch;
    if (semester) query.semester = semester;
    if (subject) query.subject = subject;
    if (category) query.category = category;

    // New Filters
    if (req.query.unit) query.unit = req.query.unit;
    if (req.query.difficulty) query.difficulty = req.query.difficulty;
    if (req.query.isVerified === "true") query.isVerified = true;
    if (req.query.fileType) query.fileType = req.query.fileType;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 }; // Default: Newest
    if (sort === "popular") sortOption = { popularityScore: -1 }; // Sort by calculated popularity
    if (sort === "likes") sortOption = { likes: -1 };
    if (sort === "downloads") sortOption = { downloads: -1 };

    const notes = await Note.find(query)
      .populate("university", "name")
      .populate("branch", "name")
      .populate("subject", "name code")
      .populate("uploader", "name")
      .sort(sortOption)
      .limit(parseInt(req.query.limit) || 0);

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ... (POST route remains same)

// Interaction: Download
router.post("/:id/download", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const identifier = req.body.userId || req.ip;

    // Check if already downloaded
    if (note.downloadedBy && note.downloadedBy.includes(identifier)) {
      return res.json({
        downloads: note.downloads,
        popularityScore: note.popularityScore,
      });
    }

    note.downloads += 1;
    note.downloadedBy.push(identifier);
    note.popularityScore = note.downloads + note.likes * 2; // Weighted score
    await note.save();
    res.json({
      downloads: note.downloads,
      popularityScore: note.popularityScore,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Interaction: Like
router.post("/:id/like", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const identifier = req.body.userId || req.ip;

    // Check if already liked
    if (note.likedBy && note.likedBy.includes(identifier)) {
      return res.json({
        likes: note.likes,
        popularityScore: note.popularityScore,
        message: "Already liked",
      });
    }

    note.likes += 1;
    note.likedBy.push(identifier);
    note.popularityScore = note.downloads + note.likes * 2; // Weighted score
    await note.save();
    res.json({ likes: note.likes, popularityScore: note.popularityScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
