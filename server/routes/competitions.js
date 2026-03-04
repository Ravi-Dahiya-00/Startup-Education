const express = require('express');
const router = express.Router();
const Competition = require('../models/Competition');
const auth = require('../middleware/auth');

// GET all competitions
router.get('/', async (req, res) => {
  try {
    const competitions = await Competition.find().sort({ createdAt: -1 });
    res.json(competitions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new competition
router.post('/', auth, async (req, res) => {
  const competition = new Competition({
    title: req.body.title,
    organizer: req.body.organizer,
    logo: req.body.logo,
    mode: req.body.mode,
    prizes: req.body.prizes,
    deadline: req.body.deadline,
    category: req.body.category,
    tags: req.body.tags
  });

  try {
    const newCompetition = await competition.save();
    res.status(201).json(newCompetition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
