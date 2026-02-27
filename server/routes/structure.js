const express = require("express");
const router = express.Router();
const University = require("../models/University");
const Branch = require("../models/Branch");
const Subject = require("../models/Subject");

// Get all universities
// Get all universities (with search & limit)
router.get("/universities", async (req, res) => {
  try {
    const { search, limit = 20, page = 1 } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [
          { name: searchRegex },
          { aliases: searchRegex },
          { location: searchRegex },
        ],
      };
    }

    const total = await University.countDocuments(query);
    const universities = await University.find(query)
      .sort({ name: 1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({ universities, total });
  } catch (err) {
    console.error("Error in GET /universities:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get single university by ID
router.get("/universities/:id", async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university)
      return res.status(404).json({ message: "University not found" });
    res.json(university);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get branches for a university
router.get("/branches/:universityId", async (req, res) => {
  try {
    const branches = await Branch.find({
      university: req.params.universityId,
    }).sort({ name: 1 });
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all subjects for a university (for Folder View)
router.get("/subjects/university/:universityId", async (req, res) => {
  try {
    // 1. Get all branches for this university
    const branches = await Branch.find({ university: req.params.universityId });
    const branchIds = branches.map((b) => b._id);

    // 2. Get all subjects belonging to these branches
    const subjects = await Subject.find({ branch: { $in: branchIds } })
      .populate("branch", "name code")
      .sort({ name: 1 });

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get subjects for a branch and semester
router.get("/subjects/:branchId/:semester", async (req, res) => {
  try {
    const subjects = await Subject.find({
      branch: req.params.branchId,
      semester: req.params.semester,
    }).sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed Data (Temporary helper route to populate DB)
router.get("/seed", async (req, res) => {
  try {
    // Check if data exists
    const uniCount = await University.countDocuments();
    if (uniCount > 0) return res.json({ message: "Data already seeded" });

    // Create Universities
    const lpu = await University.create({
      name: "Lovely Professional University (LPU)",
      location: "Punjab",
    });
    const iitd = await University.create({
      name: "IIT Delhi",
      location: "Delhi",
    });
    const vtu = await University.create({
      name: "Visvesvaraya Technological University (VTU)",
      location: "Karnataka",
    });

    // Create Branches for LPU
    const lpuCse = await Branch.create({
      name: "Computer Science & Engg",
      code: "CSE",
      university: lpu._id,
    });
    const lpuEce = await Branch.create({
      name: "Electronics & Comm",
      code: "ECE",
      university: lpu._id,
    });

    // Create Subjects for LPU CSE Sem 3
    await Subject.create([
      {
        name: "Data Structures",
        code: "CS301",
        branch: lpuCse._id,
        semester: 3,
      },
      {
        name: "Digital Electronics",
        code: "CS302",
        branch: lpuCse._id,
        semester: 3,
      },
      {
        name: "Object Oriented Programming",
        code: "CS303",
        branch: lpuCse._id,
        semester: 3,
      },
    ]);

    // Create Subjects for LPU CSE Sem 4
    await Subject.create([
      {
        name: "Operating Systems",
        code: "CS401",
        branch: lpuCse._id,
        semester: 4,
      },
      {
        name: "Database Management",
        code: "CS402",
        branch: lpuCse._id,
        semester: 4,
      },
    ]);

    res.json({ message: "Database seeded successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
