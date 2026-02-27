const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Branch = require('../models/Branch');
const SmartParser = require('../utils/smartParser');

// --- SMART MATCHING ENDPOINTS ---

/**
 * POST /api/smart/match/subject
 * Body: { input: "os", branchId: "...", semester: "..." }
 */
router.post('/match/subject', async (req, res) => {
  try {
    const { input, branchId, semester } = req.body;
    
    if (!input) return res.status(400).json({ message: 'Input is required' });

    // 1. Fetch all subjects for this branch/semester to compare against
    // If branch/semester not provided, fetch all (less accurate but fallback)
    let query = {};
    if (branchId) query.branch = branchId;
    if (semester) query.semester = semester;
    
    const candidates = await Subject.find(query);

    // 2. Perform Smart Matching
    const result = SmartParser.findBestMatch(input, candidates);
    
    // 3. Determine Action based on Score
    let response = {
      originalInput: input,
      normalizedInput: result.normalizedInput,
      score: result.score,
      suggestion: null,
      action: 'create' // default
    };

    if (result.score >= 0.85) {
      // High Confidence -> Auto Link
      response.action = 'link';
      response.suggestion = result.match;
    } else if (result.score >= 0.5) {
      // Medium Confidence -> Suggest
      response.action = 'suggest';
      response.suggestion = result.match;
    } else {
      // Low Confidence -> Create New (Cleaned)
      response.action = 'create';
      // Capitalize normalized input for display
      const cleanedName = result.normalizedInput.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      response.suggestion = { name: cleanedName, code: '' }; // Placeholder
    }

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/smart/match/branch
 * Body: { input: "cse", universityId: "..." }
 */
router.post('/match/branch', async (req, res) => {
  try {
    const { input, universityId } = req.body;
    
    if (!input) return res.status(400).json({ message: 'Input is required' });

    let query = {};
    if (universityId) query.university = universityId;
    
    const candidates = await Branch.find(query);
    const result = SmartParser.findBestMatch(input, candidates);

    let response = {
      originalInput: input,
      normalizedInput: result.normalizedInput,
      score: result.score,
      suggestion: null,
      action: 'create'
    };

    if (result.score >= 0.85) {
      response.action = 'link';
      response.suggestion = result.match;
    } else if (result.score >= 0.5) {
      response.action = 'suggest';
      response.suggestion = result.match;
    } else {
      response.action = 'create';
      const cleanedName = result.normalizedInput.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      response.suggestion = { name: cleanedName, code: '' };
    }

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
