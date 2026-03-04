const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// GET all jobs with filtering
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
    
    // Location filter
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

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new job
router.post('/', auth, async (req, res) => {
  const job = new Job(req.body);

  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
