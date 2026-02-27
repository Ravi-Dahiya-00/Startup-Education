const express = require('express');
const router = express.Router();
const { parseJobWithAI } = require('../utils/aiHelper');

router.post('/parse-job', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const parsedData = await parseJobWithAI(text);
    
    res.json({
      success: true,
      data: parsedData,
      confidence: 90 
    });

  } catch (error) {
    console.error('AI Parse Error:', error);
    res.status(500).json({ error: 'Failed to process text', details: error.message });
  }
});

module.exports = router;
