const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const Job = require('../models/Job');
const Course = require('../models/Course');
const Competition = require('../models/Competition');
const Blog = require('../models/Blog');
const Scholarship = require('../models/Scholarship');

// Global search endpoint - searches across all content types
router.get('/', async (req, res) => {
  try {
    const { q, type, limit = 10 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchQuery = q.trim();
    const resultsLimit = parseInt(limit) || 10;

    // Create regex for case-insensitive search
    const searchRegex = new RegExp(searchQuery, 'i');

    const results = {
      internships: [],
      jobs: [],
      courses: [],
      competitions: [],
      blogs: [],
      scholarships: [],
      totalResults: 0
    };

    // Search in all collections or specific type only
    if (!type || type === 'internships') {
      results.internships = await Internship.find({
        $or: [
          { role: searchRegex },
          { company: searchRegex },
          { category: searchRegex },
          { skills: searchRegex },
          { location: searchRegex },
          { tags: searchRegex }
        ]
      })
      .limit(resultsLimit)
      .select('role company location duration stipend deadline category createdAt')
      .sort({ createdAt: -1 });
    }

    if (!type || type === 'jobs') {
      results.jobs = await Job.find({
        $or: [
          { role: searchRegex },
          { company: searchRegex },
          { category: searchRegex },
          { skills: searchRegex },
          { location: searchRegex },
          { tags: searchRegex }
        ]
      })
      .limit(resultsLimit)
      .select('role company location salary experience deadline category createdAt')
      .sort({ createdAt: -1 });
    }

    if (!type || type === 'courses') {
      results.courses = await Course.find({
        $or: [
          { title: searchRegex },
          { instructor: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { level: searchRegex }
        ]
      })
      .limit(resultsLimit)
      .select('title instructor duration level rating thumbnail category')
      .sort({ createdAt: -1 });
    }

    if (!type || type === 'competitions') {
      results.competitions = await Competition.find({
        $or: [
          { title: searchRegex },
          { organizer: searchRegex },
          { description: searchRegex },
          { category: searchRegex }
        ]
      })
      .limit(resultsLimit)
      .select('title organizer deadline prizes category registrationLink')
      .sort({ deadline: 1 });
    }

    if (!type || type === 'blogs') {
      results.blogs = await Blog.find({
        $or: [
          { title: searchRegex },
          { author: searchRegex },
          { excerpt: searchRegex },
          { category: searchRegex },
          { tags: searchRegex }
        ]
      })
      .limit(resultsLimit)
      .select('title author category readTime publishedDate thumbnail excerpt')
      .sort({ publishedDate: -1 });
    }

    if (!type || type === 'scholarships') {
      results.scholarships = await Scholarship.find({
        $or: [
          { title: searchRegex },
          { provider: searchRegex },
          { description: searchRegex },
          { eligibility: searchRegex }
        ]
      })
      .limit(resultsLimit)
      .select('title provider amount deadline eligibility applicationLink')
      .sort({ deadline: 1 });
    }

    // Calculate total results
    results.totalResults = 
      results.internships.length +
      results.jobs.length +
      results.courses.length +
      results.competitions.length +
      results.blogs.length +
      results.scholarships.length;

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error performing search', error: error.message });
  }
});

// Quick search suggestions - returns limited results for autocomplete
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    const limit = 3;

    const suggestions = [];

    try {
      // Get suggestions from different sources with error handling for each
      const [internships, jobs, courses, blogs] = await Promise.allSettled([
        Internship.find({ 
          $or: [
            { role: searchRegex },
            { company: searchRegex },
            { category: searchRegex }
          ]
        }).limit(limit).select('role'),
        
        Job.find({ 
          $or: [
            { role: searchRegex },
            { company: searchRegex },
            { category: searchRegex }
          ]
        }).limit(limit).select('role'),
        
        Course.find({ 
          $or: [
            { title: searchRegex },
            { instructor: searchRegex },
            { category: searchRegex }
          ]
        }).limit(limit).select('title'),
        
        Blog.find({ 
          $or: [
            { title: searchRegex },
            { category: searchRegex },
            { tags: searchRegex }
          ]
        }).limit(limit).select('title')
      ]);

      // Format suggestions safely
      if (internships.status === 'fulfilled' && internships.value) {
        internships.value.forEach(item => {
          if (item.role) suggestions.push({ type: 'Internship', title: item.role });
        });
      }
      
      if (jobs.status === 'fulfilled' && jobs.value) {
        jobs.value.forEach(item => {
          if (item.role) suggestions.push({ type: 'Job', title: item.role });
        });
      }
      
      if (courses.status === 'fulfilled' && courses.value) {
        courses.value.forEach(item => {
          if (item.title) suggestions.push({ type: 'Course', title: item.title });
        });
      }
      
      if (blogs.status === 'fulfilled' && blogs.value) {
        blogs.value.forEach(item => {
          if (item.title) suggestions.push({ type: 'Blog', title: item.title });
        });
      }
    } catch (dbError) {
      console.error('Database query error:', dbError);
    }

    res.json({ suggestions: suggestions.slice(0, 8) });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ message: 'Error getting suggestions', error: error.message });
  }
});

module.exports = router;
