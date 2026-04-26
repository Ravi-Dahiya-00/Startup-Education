const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const auth = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

// Helper to generate a unique slug
const generateSlug = async (role, company) => {
  const baseSlug = `${role}-${company}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  let exists = await Internship.exists({ slug });
  
  while (exists) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    exists = await Internship.exists({ slug });
  }
  
  return slug;
};

// GET all internships with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      workType, 
      workingDays, 
      userType, 
      domain, 
      location, 
      status,
      search 
    } = req.query;

    let query = {};

    if (workType) query.workType = { $in: workType.split(',') };
    if (workingDays) query.workingDays = { $in: workingDays.split(',') };
    if (userType) query.userType = { $in: userType.split(',') };
    if (domain) query.category = { $in: domain.split(',') };
    
    // Location filter (partial match)
    if (location) {
      const locations = location.split(',');
      query.$or = locations.map(loc => ({ location: { $regex: loc, $options: 'i' } }));
    }
    
    // Status filter
    if (status === 'Live') query.deadline = { $gte: new Date() };
    if (status === 'Expired') query.deadline = { $lt: new Date() };

    // Search
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$and = [
        {
          $or: [
            { role: searchRegex },
            { company: searchRegex },
            { skills: searchRegex },
            { tags: searchRegex }
          ]
        }
      ];
    }

    const internships = await Internship.find(query).sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single internship by SLUG
router.get('/slug/:slug', async (req, res) => {
  try {
    const internship = await Internship.findOne({ slug: req.params.slug });
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single internship by ID
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });
    res.json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new internship
router.post('/', adminAuth, async (req, res) => {
  try {
    const data = req.body;
    if (!data.slug && data.role && data.company) {
      data.slug = await generateSlug(data.role, data.company);
    }
    const internship = new Internship(data);
    const newInternship = await internship.save();
    res.status(201).json(newInternship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
