const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer for Avatar Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir =
      process.env.NODE_ENV === "production"
        ? "/tmp/uploads/avatars"
        : "uploads/avatars";
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (e) {
        console.error("Error creating avatar upload dir:", e);
      }
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
});

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PATCH /api/users/me
// @desc    Update user profile
// @access  Private
router.patch("/me", auth, async (req, res) => {
  const {
    name,
    username,
    bio,
    institution,
    branch,
    batch,
    semester,
    subjects,
    skills,
    phoneNumber,
    socialLinks,
    preferences,
  } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Username validation and change limit
    if (username && username !== user.username) {
      // Validate username format: 3-30 chars, alphanumeric + underscore only
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({
          message:
            "Username must be 3-30 characters and contain only letters, numbers, and underscores",
        });
      }

      // Check if username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Check username change limit
      if (user.usernameChangeCount >= 2) {
        return res.status(400).json({
          message: "You have reached the maximum limit of 2 username changes",
        });
      }

      // Increment username change count
      user.usernameChangeCount += 1;
    }

    // Update fields
    if (name) user.name = name;
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (institution) user.institution = institution;
    if (branch) user.branch = branch;
    if (batch) user.batch = batch;
    if (semester !== undefined) user.semester = semester;
    if (subjects) user.subjects = subjects;
    if (skills) user.skills = skills;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (socialLinks) user.socialLinks = socialLinks;
    if (preferences) user.preferences = preferences;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");
    return res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username already taken" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/users/me/avatar
// @desc    Upload profile picture
// @access  Private
router.post("/me/avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const avatarUrl = `http://localhost:5000/${req.file.path.replace(/\\/g, "/")}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
