const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const auth = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
// GET all scholarships
router.get('/', async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single scholarship by ID
router.get('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new scholarship
router.post('/', adminAuth, async (req, res) => {
  const scholarship = new Scholarship({
    title: req.body.title,
    provider: req.body.provider,
    providerLogo: req.body.providerLogo,
    amount: req.body.amount,
    deadline: req.body.deadline,
    eligibility: req.body.eligibility,
    category: req.body.category,
    description: req.body.description,
    benefits: req.body.benefits,
    requirements: req.body.requirements,
    howToApply: req.body.howToApply,
    applicationLink: req.body.applicationLink,
    tags: req.body.tags
  });

  try {
    const newScholarship = await scholarship.save();
    res.status(201).json(newScholarship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update scholarship
router.put('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.json(scholarship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE scholarship
router.delete('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.json({ message: 'Scholarship deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST apply to scholarship (increment applicants)
router.post('/:id/apply', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      { $inc: { applicants: 1 } },
      { new: true }
    );
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.json({ message: 'Application submitted', applicants: scholarship.applicants });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
