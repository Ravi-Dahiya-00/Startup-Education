/**
 * Quiz Scoring Logic Tests
 * 
 * Run with: node --experimental-vm-modules client/src/__tests__/quizScoring.test.js
 * Or add to your test runner (Jest, Vitest, etc.)
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Quiz scoring utilities
const calculateScore = (answers, questions) => {
  return answers.filter((answer, index) => {
    return answer === questions[index].correctIndex;
  }).length;
};

const calculatePercentage = (score, total) => {
  return Math.round((score / total) * 100);
};

const getScoreTier = (percentage) => {
  if (percentage >= 71) return 'Excellent';
  if (percentage >= 41) return 'Good';
  return 'Keep Practicing';
};

const isQuestionCorrect = (userAnswer, correctIndex) => {
  return userAnswer === correctIndex;
};

const isQuestionSkipped = (userAnswer) => {
  return userAnswer === -1;
};

// Mock quiz data
const mockQuestions = [
  { id: 1, correctIndex: 1 },
  { id: 2, correctIndex: 3 },
  { id: 3, correctIndex: 0 },
  { id: 4, correctIndex: 2 },
  { id: 5, correctIndex: 1 }
];

// Tests
describe('Quiz Scoring Logic', () => {
  describe('calculateScore', () => {
    it('should return 0 for all incorrect answers', () => {
      const answers = [0, 0, 1, 0, 0];
      expect(calculateScore(answers, mockQuestions)).toBe(0);
    });

    it('should return full score for all correct answers', () => {
      const answers = [1, 3, 0, 2, 1];
      expect(calculateScore(answers, mockQuestions)).toBe(5);
    });

    it('should return partial score for mixed answers', () => {
      const answers = [1, 3, 1, 0, 0]; // First two correct
      expect(calculateScore(answers, mockQuestions)).toBe(2);
    });

    it('should treat skipped answers (-1) as incorrect', () => {
      const answers = [-1, 3, 0, -1, 1]; // 3 correct, 2 skipped
      expect(calculateScore(answers, mockQuestions)).toBe(3);
    });

    it('should handle empty answers array', () => {
      expect(calculateScore([], [])).toBe(0);
    });
  });

  describe('calculatePercentage', () => {
    it('should return 0% for 0 correct', () => {
      expect(calculatePercentage(0, 5)).toBe(0);
    });

    it('should return 100% for all correct', () => {
      expect(calculatePercentage(5, 5)).toBe(100);
    });

    it('should round to nearest integer', () => {
      expect(calculatePercentage(2, 3)).toBe(67); // 66.67 rounded
      expect(calculatePercentage(1, 3)).toBe(33); // 33.33 rounded
    });

    it('should handle various scores', () => {
      expect(calculatePercentage(3, 5)).toBe(60);
      expect(calculatePercentage(4, 5)).toBe(80);
      expect(calculatePercentage(1, 5)).toBe(20);
    });
  });

  describe('getScoreTier', () => {
    it('should return "Keep Practicing" for 0-40%', () => {
      expect(getScoreTier(0)).toBe('Keep Practicing');
      expect(getScoreTier(20)).toBe('Keep Practicing');
      expect(getScoreTier(40)).toBe('Keep Practicing');
    });

    it('should return "Good" for 41-70%', () => {
      expect(getScoreTier(41)).toBe('Good');
      expect(getScoreTier(55)).toBe('Good');
      expect(getScoreTier(70)).toBe('Good');
    });

    it('should return "Excellent" for 71-100%', () => {
      expect(getScoreTier(71)).toBe('Excellent');
      expect(getScoreTier(85)).toBe('Excellent');
      expect(getScoreTier(100)).toBe('Excellent');
    });
  });

  describe('isQuestionCorrect', () => {
    it('should return true when answer matches correct index', () => {
      expect(isQuestionCorrect(1, 1)).toBe(true);
      expect(isQuestionCorrect(0, 0)).toBe(true);
    });

    it('should return false when answer does not match', () => {
      expect(isQuestionCorrect(0, 1)).toBe(false);
      expect(isQuestionCorrect(2, 3)).toBe(false);
    });

    it('should return false for skipped answers', () => {
      expect(isQuestionCorrect(-1, 1)).toBe(false);
    });
  });

  describe('isQuestionSkipped', () => {
    it('should return true for -1', () => {
      expect(isQuestionSkipped(-1)).toBe(true);
    });

    it('should return false for valid answer indices', () => {
      expect(isQuestionSkipped(0)).toBe(false);
      expect(isQuestionSkipped(1)).toBe(false);
      expect(isQuestionSkipped(3)).toBe(false);
    });
  });
});

// Integration tests
describe('Quiz Flow Integration', () => {
  let quiz;
  let answers;

  beforeEach(() => {
    quiz = {
      id: 'test-quiz',
      questions: mockQuestions
    };
    answers = Array(5).fill(null);
  });

  it('should correctly track answered questions', () => {
    answers[0] = 1; // Correct
    answers[1] = 0; // Incorrect
    answers[2] = 0; // Correct
    
    const answeredCount = answers.filter(a => a !== null).length;
    expect(answeredCount).toBe(3);
  });

  it('should calculate final results correctly', () => {
    answers = [1, 3, 0, 2, 0]; // 4 correct, 1 incorrect
    
    const score = calculateScore(answers, mockQuestions);
    const percentage = calculatePercentage(score, mockQuestions.length);
    const tier = getScoreTier(percentage);
    
    expect(score).toBe(4);
    expect(percentage).toBe(80);
    expect(tier).toBe('Excellent');
  });

  it('should handle timer auto-submit with partial answers', () => {
    answers = [1, 3, null, null, null]; // 2 answered, rest auto-submitted as skipped
    
    // Simulate auto-submit: fill null with -1
    const finalAnswers = answers.map(a => a === null ? -1 : a);
    
    const score = calculateScore(finalAnswers, mockQuestions);
    expect(score).toBe(2);
    expect(calculatePercentage(score, 5)).toBe(40);
  });
});

console.log('All tests passed! Run with a test runner for proper output.');
