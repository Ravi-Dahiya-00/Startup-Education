const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Job = require('../models/Job');
const Internship = require('../models/Internship');
const { fetchCompanyProfile, getClearbitLogo } = require('../utils/companyFetcher');

// Get company profile by domain
router.get('/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const { refresh = false } = req.query;
    
    // Clean domain
    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    // Check cache first
    let company = await Company.findOne({ domain: cleanDomain });
    
    // If cache exists and is fresh, return it
    if (company && !company.isCacheStale() && !refresh) {
      console.log(`Cache hit for ${cleanDomain}`);
      
      // Calculate open positions from our DB
      const [jobCount, internshipCount] = await Promise.all([
        Job.countDocuments({ 
          $or: [
            { company: { $regex: new RegExp(company.name, 'i') } },
            { website: { $regex: new RegExp(cleanDomain, 'i') } }
          ]
        }),
        Internship.countDocuments({ 
          $or: [
            { company: { $regex: new RegExp(company.name, 'i') } },
            { website: { $regex: new RegExp(cleanDomain, 'i') } }
          ]
        })
      ]);
      
      company.metrics.openPositions = jobCount + internshipCount;
      
      return res.json({
        success: true,
        cached: true,
        company
      });
    }
    
    console.log(`Fetching fresh data for ${cleanDomain}`);
    
    // Fetch from external APIs
    const profileData = await fetchCompanyProfile(cleanDomain, req.query.name);
    
    // Calculate open positions from our DB
    const [jobCount, internshipCount] = await Promise.all([
      Job.countDocuments({ 
        $or: [
          { company: { $regex: new RegExp(profileData.name, 'i') } },
          { website: { $regex: new RegExp(cleanDomain, 'i') } }
        ]
      }),
      Internship.countDocuments({ 
        $or: [
          { company: { $regex: new RegExp(profileData.name, 'i') } },
          { website: { $regex: new RegExp(cleanDomain, 'i') } }
        ]
      })
    ]);
    
    profileData.metrics = {
      openPositions: jobCount + internshipCount,
      totalJobsPosted: jobCount + internshipCount
    };
    
    // Save/update in database
    if (company) {
      // Update existing
      Object.assign(company, profileData);
      company.refreshCache();
      await company.save();
    } else {
      // Create new
      company = new Company(profileData);
      company.refreshCache();
      await company.save();
    }
    
    res.json({
      success: true,
      cached: false,
      company
    });
    
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company profile',
      error: error.message
    });
  }
});

// Get all jobs/internships from a company
router.get('/:domain/opportunities', async (req, res) => {
  try {
    const { domain } = req.params;
    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    // Get company name from cache
    const company = await Company.findOne({ domain: cleanDomain });
    const companyName = company?.name || cleanDomain.split('.')[0];
    
    // Fetch jobs and internships
    const [jobs, internships] = await Promise.all([
      Job.find({
        $or: [
          { company: { $regex: new RegExp(companyName, 'i') } },
          { website: { $regex: new RegExp(cleanDomain, 'i') } }
        ]
      }).sort({ postedAt: -1 }),
      Internship.find({
        $or: [
          { company: { $regex: new RegExp(companyName, 'i') } },
          { website: { $regex: new RegExp(cleanDomain, 'i') } }
        ]
      }).sort({ postedAt: -1 })
    ]);
    
    res.json({
      success: true,
      company: companyName,
      jobs,
      internships,
      total: jobs.length + internships.length
    });
    
  } catch (error) {
    console.error('Error fetching company opportunities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch opportunities',
      error: error.message
    });
  }
});

// Follow/unfollow a company
router.post('/:domain/follow', async (req, res) => {
  try {
    const { domain } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    let company = await Company.findOne({ domain: cleanDomain });
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found. Fetch profile first.'
      });
    }
    
    // Check if already following
    const isFollowing = company.followers.includes(userId);
    
    if (isFollowing) {
      // Unfollow
      company.followers = company.followers.filter(f => f.toString() !== userId);
      company.followersCount = Math.max(0, company.followersCount - 1);
    } else {
      // Follow
      company.followers.push(userId);
      company.followersCount += 1;
    }
    
    await company.save();
    
    res.json({
      success: true,
      isFollowing: !isFollowing,
      followersCount: company.followersCount
    });
    
  } catch (error) {
    console.error('Error toggling follow:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle follow',
      error: error.message
    });
  }
});

// Search companies
router.get('/search/query', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const companies = await Company.find({
      $text: { $search: q }
    })
    .select('domain name logo industry headquarters followersCount metrics')
    .limit(parseInt(limit))
    .sort({ followersCount: -1 });
    
    res.json({
      success: true,
      companies
    });
    
  } catch (error) {
    console.error('Error searching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search companies',
      error: error.message
    });
  }
});

// Get logo only (lightweight)
router.get('/:domain/logo', async (req, res) => {
  try {
    const { domain } = req.params;
    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    
    res.json({
      success: true,
      logo: getClearbitLogo(cleanDomain)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get logo'
    });
  }
});

module.exports = router;
