const stringSimilarity = require('string-similarity');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Common Abbreviations Map
const ABBREVIATIONS = {
  'cse': 'computer science and engineering',
  'ece': 'electronics and communication engineering',
  'eee': 'electrical and electronics engineering',
  'me': 'mechanical engineering',
  'ce': 'civil engineering',
  'it': 'information technology',
  'ds': 'data structures',
  'os': 'operating systems',
  'dbms': 'database management systems',
  'oops': 'object oriented programming',
  'dsa': 'data structures and algorithms',
  'ai': 'artificial intelligence',
  'ml': 'machine learning',
  'toc': 'theory of computation',
  'coa': 'computer organization and architecture'
};

// Stop words to remove for keyword extraction
const STOP_WORDS = ['and', 'of', 'the', 'in', 'for', 'with', 'a', 'an', 'to', 'introduction', 'basics', 'advanced'];

class SmartParser {
  
  /**
   * Normalize text: lowercase, remove punctuation, expand abbreviations
   */
  static normalize(text) {
    if (!text) return '';
    
    let normalized = text.toLowerCase().trim();
    
    // Remove special characters but keep spaces
    normalized = normalized.replace(/[^a-z0-9\s]/g, '');
    
    // Remove extra spaces
    normalized = normalized.replace(/\s+/g, ' ');

    // Check for direct abbreviation match
    if (ABBREVIATIONS[normalized]) {
      return ABBREVIATIONS[normalized];
    }

    // Expand abbreviations within text (e.g., "advanced os")
    const words = normalized.split(' ');
    const expandedWords = words.map(w => ABBREVIATIONS[w] || w);
    
    return expandedWords.join(' ');
  }

  /**
   * Calculate match score between input and existing item
   */
  static calculateScore(input, existing) {
    const normalizedInput = this.normalize(input);
    const normalizedExisting = this.normalize(existing);

    // 1. Dice Coefficient (String Similarity) - Weight: 60%
    const similarity = stringSimilarity.compareTwoStrings(normalizedInput, normalizedExisting);

    // 2. Keyword Matching - Weight: 40%
    const inputKeywords = this.extractKeywords(normalizedInput);
    const existingKeywords = this.extractKeywords(normalizedExisting);
    
    let keywordMatch = 0;
    if (inputKeywords.length > 0 && existingKeywords.length > 0) {
      const intersection = inputKeywords.filter(k => existingKeywords.includes(k));
      keywordMatch = intersection.length / Math.max(inputKeywords.length, existingKeywords.length);
    }

    // Weighted Score
    const finalScore = (similarity * 0.6) + (keywordMatch * 0.4);
    return finalScore;
  }

  static extractKeywords(text) {
    const tokens = tokenizer.tokenize(text);
    return tokens.filter(t => !STOP_WORDS.includes(t) && t.length > 2);
  }

  /**
   * Find the best match from a list of candidates
   */
  static findBestMatch(input, candidates) {
    if (!candidates || candidates.length === 0) return null;

    let bestMatch = null;
    let bestScore = 0;

    candidates.forEach(candidate => {
      const score = this.calculateScore(input, candidate.name);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = candidate;
      }
    });

    return {
      match: bestMatch,
      score: bestScore,
      normalizedInput: this.normalize(input)
    };
  }
}

module.exports = SmartParser;
