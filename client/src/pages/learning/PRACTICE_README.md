# Practice Page - Quiz System

A responsive practice quiz system with three tests: Python Basics, C Fundamentals, and DBMS Essentials.

## Features

- ✅ **3 Interactive Tests** - Python, C, and DBMS with 5 questions each
- ✅ **Instant Feedback** - Correct/incorrect highlighting with explanations
- ✅ **Timer Option** - Optional countdown timer per test
- ✅ **Results Dashboard** - Score, percentage, breakdown, and badges
- ✅ **Progress Tracking** - Visual progress bar during quiz
- ✅ **Share Results** - Copy score to clipboard or share
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Accessibility** - Keyboard navigation, ARIA labels
- ✅ **Analytics Hooks** - Event tracking for test flow

## Quick Start

```bash
# Navigate to client directory
cd client

# Install dependencies (if not already)
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/practice` to see the Practice page.

## File Structure

```
client/src/
├── data/
│   └── quizData.json          # Quiz questions JSON
├── pages/
│   ├── Practice.jsx           # Main component with all subcomponents
│   └── Practice.css           # Styles
└── __tests__/
    └── quizScoring.test.js    # Unit tests
```

## Components

| Component | Description |
|-----------|-------------|
| `Practice` | Main page container |
| `TestCard` | Card for each quiz with start button |
| `QuizRunner` | Quiz flow controller |
| `QuestionCard` | Single question display |
| `OptionButton` | Answer option button |
| `ResultsView` | Final results screen |
| `ScoreBadge` | Score display with tier badge |

## Quiz Data Format

```json
{
  "quizzes": [
    {
      "id": "python-basics",
      "title": "Python Basics",
      "description": "Test your knowledge...",
      "icon": "🐍",
      "color": "#3776ab",
      "questionCount": 5,
      "estimatedTime": 5,
      "difficulty": "Beginner",
      "questions": [
        {
          "id": 1,
          "question": "What is the correct way...",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 1,
          "explanation": "Explanation text here..."
        }
      ]
    }
  ]
}
```

## Analytics Events

The `useAnalytics` hook tracks these events:

```javascript
// Test started
track('test_started', { quizId, timerEnabled })

// Question answered
track('question_answered', { quizId, questionId, correct })

// Question skipped
track('question_skipped', { quizId, questionId })

// Test completed
track('test_completed', { quizId, score, autoSubmitted? })

// Test retry
track('test_retry', { quizId })
```

### Connecting to Analytics Service

Modify the `useAnalytics` hook in `Practice.jsx`:

```javascript
const useAnalytics = () => {
  const track = useCallback((event, data) => {
    // Google Analytics
    gtag('event', event, data);
    
    // Or custom API
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ event, data })
    });
  }, []);

  return { track };
};
```

## Running Tests

```bash
# Install vitest (if not installed)
npm install -D vitest

# Run tests
npx vitest run client/src/__tests__/quizScoring.test.js
```

## Score Tiers

| Percentage | Tier | Badge |
|------------|------|-------|
| 0-40% | Keep Practicing | 🏅 Award |
| 41-70% | Good | 🏅 Medal |
| 71-100% | Excellent | 🏆 Trophy |

## Keyboard Shortcuts

- `Tab` - Navigate between options
- `Enter/Space` - Select option
- `Tab` to Next/Skip button

## Adding New Quizzes

1. Add quiz object to `quizData.json`:
```json
{
  "id": "new-quiz",
  "title": "New Quiz Title",
  "description": "Description...",
  "icon": "📚",
  "color": "#hex-color",
  "questionCount": 5,
  "estimatedTime": 5,
  "difficulty": "Beginner",
  "questions": [...]
}
```

2. That's it! The new quiz will automatically appear.

## Customization

### Colors
Edit CSS variables in `Practice.css` or use the existing variables from `index.css`:
- `--primary` - Main accent color
- `--surface` - Card backgrounds
- `--text-main` - Primary text
- `--text-muted` - Secondary text

### Timer Duration
Modify `estimatedTime` in quiz data (in minutes).

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers

## License

Part of Startup Education platform.
