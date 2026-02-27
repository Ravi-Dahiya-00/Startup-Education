const express = require('express');
const router = express.Router();
const CodingProblem = require('../models/CodingProblem');
const axios = require('axios');

// Piston API URL
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

// GET /api/coding-problems - List all problems
router.get('/', async (req, res) => {
  try {
    const problems = await CodingProblem.find({}, 'title difficulty tags order');
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/coding-problems/:id - Get problem details
router.get('/:id', async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    
    // Hide test cases that are hidden
    const problemObj = problem.toObject();
    problemObj.testCases = problemObj.testCases.map(tc => {
      if (tc.isHidden) {
        return { isHidden: true }; // Don't send input/output for hidden cases
      }
      return tc;
    });
    
    res.json(problemObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/coding-problems/execute - Run code against custom input
router.post('/execute', async (req, res) => {
  try {
    const { language, sourceCode, stdin } = req.body;
    
    // Map our language names to Piston's version if needed
    // Piston supports: python, javascript, java, c++, etc.
    // We assume the frontend sends the correct Piston language name
    
    const response = await axios.post(PISTON_API_URL, {
      language: language,
      version: '*',
      files: [
        {
          content: sourceCode
        }
      ],
      stdin: stdin || '',
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1
    });

    res.json(response.data);
  } catch (err) {
    console.error('Piston Execution Error:', err.message);
    res.status(500).json({ 
        message: 'Error executing code', 
        error: err.response?.data || err.message 
    });
  }
});

// POST /api/coding-problems/submit - Run code against ALL test cases
router.post('/submit', async (req, res) => {
  try {
    const { problemId, language, sourceCode } = req.body;
    
    const problem = await CodingProblem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    const results = [];
    let allPassed = true;

    // Run test cases sequentially to avoid rate limits if possible, 
    // but Piston handles concurrency reasonably well. 
    // For now, let's do it sequentially to be safe and simple.
    
    for (const testCase of problem.testCases) {
      try {
        const response = await axios.post(PISTON_API_URL, {
          language: language,
          version: '*',
          files: [{ content: sourceCode }],
          stdin: testCase.input,
          run_timeout: 3000
        });

        const runResult = response.data.run;
        
        // Check output
        // Trim whitespace for comparison
        const actualOutput = runResult.output ? runResult.output.trim() : '';
        const expectedOutput = testCase.output.trim();
        const passed = actualOutput === expectedOutput;

        if (!passed) allPassed = false;

        results.push({
          passed,
          input: testCase.isHidden ? 'Hidden' : testCase.input,
          expectedOutput: testCase.isHidden ? 'Hidden' : expectedOutput,
          actualOutput: testCase.isHidden ? 'Hidden' : actualOutput,
          error: runResult.stderr,
          isHidden: testCase.isHidden
        });

      } catch (err) {
        allPassed = false;
        results.push({
            passed: false,
            input: testCase.isHidden ? 'Hidden' : testCase.input,
            error: 'Execution Error: ' + err.message,
            isHidden: testCase.isHidden
        });
      }
    }

    res.json({
      allPassed,
      results
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/coding-problems/seed - Helper to add a sample problem (DEV only)
router.post('/seed', async (req, res) => {
    try {
        const existing = await CodingProblem.findOne({ title: 'Two Sum' });
        if (existing) return res.json({ message: 'Already seeded' });

        const problem = new CodingProblem({
            title: 'Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
            difficulty: 'Easy',
            constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
            examples: [
                { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
                { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' }
            ],
            testCases: [
                { input: '2\n2 7 11 15\n9', output: '0 1', isHidden: false }, // Custom input format: first line N, second line array, third line target
                { input: '3\n3 2 4\n6', output: '1 2', isHidden: false },
                { input: '2\n3 3\n6', output: '0 1', isHidden: true }
            ],
            starterCode: {
                python: 'def twoSum(nums, target):\n    # Write your code here\n    pass\n\n# Driver code to handle input/output (will be appended automatically or user writes it)\nimport sys\n\ndef solve():\n    n = int(sys.stdin.readline())\n    nums = list(map(int, sys.stdin.readline().split()))\n    target = int(sys.stdin.readline())\n    \n    result = twoSum(nums, target)\n    print(f"{result[0]} {result[1]}")\n\nif __name__ == "__main__":\n    solve()'
            }
        });
        await problem.save();
        res.json(problem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
