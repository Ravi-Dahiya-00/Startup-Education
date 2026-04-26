"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Clock, CheckCircle, XCircle, ArrowRight, 
  RotateCcw, Home, Share2, Trophy, Medal, Award,
  Timer, X, ChevronRight, SkipForward, Copy, Check,
  Code, FileQuestion
} from 'lucide-react';
import quizData from '@/data/quizData.json';
import './Practice.css';
import CodingProblemsList from '@/components/learning/CodingProblemsList';
import CodingProblemRunner from '@/components/learning/CodingProblemRunner';

// Analytics hook - can be connected to actual analytics service
const useAnalytics = () => {
  const track = useCallback((event, data) => {
    console.log(`[Analytics] ${event}:`, data);
    // Connect to your analytics service here
    // e.g., gtag('event', event, data);
  }, []);

  return { track };
};

// ============ TEST CARD COMPONENT ============
const TestCard = ({ quiz, onStart, timerEnabled, onToggleTimer }) => {
  return (
    <motion.div 
      className="test-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, borderColor: 'var(--primary)' }}
      style={{ '--card-accent': quiz.color }}
    >
      <div className="test-card-header">
        <div className="test-icon" style={{ background: `${quiz.color}20` }}>
          <span>{quiz.icon}</span>
        </div>
        <div className="test-badges">
          <span className="badge-difficulty">{quiz.difficulty}</span>
        </div>
      </div>
      
      <h3 className="test-title">{quiz.title}</h3>
      <p className="test-description">{quiz.description}</p>
      
      <div className="test-meta">
        <div className="meta-item">
          <CheckCircle size={14} />
          <span>{quiz.questionCount} Questions</span>
        </div>
        <div className="meta-item">
          <Clock size={14} />
          <span>~{quiz.estimatedTime} min</span>
        </div>
      </div>

      <div className="test-footer">
        <label className="timer-toggle" aria-label="Enable timer">
          <input 
            type="checkbox" 
            checked={timerEnabled}
            onChange={() => onToggleTimer(quiz.id)}
          />
          <Timer size={14} />
          <span>Timer</span>
        </label>
        
        <button 
          className="btn-start"
          onClick={() => onStart(quiz)}
          aria-label={`Start ${quiz.title} test`}
        >
          <Play size={16} />
          Start Test
        </button>
      </div>
    </motion.div>
  );
};

// ============ OPTION BUTTON COMPONENT ============
const OptionButton = ({ 
  option, 
  index, 
  isSelected, 
  isCorrect, 
  showFeedback, 
  correctIndex,
  onSelect,
  disabled 
}) => {
  const letters = ['A', 'B', 'C', 'D'];
  const isThisCorrect = index === correctIndex;
  
  let className = 'option-btn';
  if (showFeedback) {
    if (isSelected && isCorrect) className += ' correct';
    else if (isSelected && !isCorrect) className += ' incorrect';
    else if (isThisCorrect) className += ' reveal-correct';
  } else if (isSelected) {
    className += ' selected';
  }

  return (
    <motion.button
      className={className}
      onClick={() => onSelect(index)}
      disabled={disabled || showFeedback}
      whileHover={!disabled && !showFeedback ? { scale: 1.01, y: -2 } : {}}
      whileTap={!disabled && !showFeedback ? { scale: 0.99 } : {}}
      role="radio"
      aria-checked={isSelected}
      aria-label={`Option ${letters[index]}: ${option}`}
    >
      <span className="option-letter">{letters[index]}</span>
      <span className="option-text">{option}</span>
      {showFeedback && isSelected && isCorrect && (
        <CheckCircle className="feedback-icon" size={20} />
      )}
      {showFeedback && isSelected && !isCorrect && (
        <XCircle className="feedback-icon" size={20} />
      )}
      {showFeedback && isThisCorrect && !isSelected && (
        <CheckCircle className="feedback-icon correct-reveal" size={20} />
      )}
    </motion.button>
  );
};

// ============ QUESTION CARD COMPONENT ============
const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions,
  onAnswer,
  onSkip,
  onNext,
  userAnswer,
  showFeedback
}) => {
  const isCorrect = userAnswer === question.correctIndex;

  return (
    <motion.div 
      className="question-card"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      key={question.id}
    >
      <div className="question-header">
        <span className="question-number">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <h2 className="question-text">{question.question}</h2>

      <div className="options-container" role="radiogroup" aria-label="Answer options">
        {question.options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            index={index}
            isSelected={userAnswer === index}
            isCorrect={isCorrect}
            showFeedback={showFeedback}
            correctIndex={question.correctIndex}
            onSelect={onAnswer}
            disabled={showFeedback}
          />
        ))}
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div 
            className={`feedback-box ${isCorrect ? 'correct' : 'incorrect'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="feedback-header">
              {isCorrect ? (
                <>
                  <CheckCircle size={20} />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <XCircle size={20} />
                  <span>Incorrect</span>
                </>
              )}
            </div>
            <p className="feedback-explanation">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="question-actions">
        {!showFeedback ? (
          <button 
            className="btn-skip" 
            onClick={onSkip}
            aria-label="Skip this question"
          >
            <SkipForward size={16} />
            Skip
          </button>
        ) : (
          <button 
            className="btn-next" 
            onClick={onNext}
            aria-label="Go to next question"
          >
            Next
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ============ SCORE BADGE COMPONENT ============
const ScoreBadge = ({ score, total }) => {
  const percentage = Math.round((score / total) * 100);
  
  let tier, icon, color;
  if (percentage >= 71) {
    tier = 'Excellent';
    icon = <Trophy size={32} />;
    color = '#10b981';
  } else if (percentage >= 41) {
    tier = 'Good';
    icon = <Medal size={32} />;
    color = '#f59e0b';
  } else {
    tier = 'Keep Practicing';
    icon = <Award size={32} />;
    color = '#ef4444';
  }

  return (
    <motion.div 
      className="score-badge"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 0.2 }}
      style={{ '--badge-color': color }}
    >
      <div className="badge-icon" style={{ color }}>
        {icon}
      </div>
      <div className="badge-score">
        <span className="score-number">{score}/{total}</span>
        <span className="score-percentage">{percentage}%</span>
      </div>
      <span className="badge-tier" style={{ color }}>{tier}</span>
      
      <div className="score-progress">
        <motion.div 
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ background: color }}
        />
      </div>
    </motion.div>
  );
};

// ============ RESULTS VIEW COMPONENT ============
const ResultsView = ({ quiz, answers, onRetry, onBackToTests }) => {
  const [copied, setCopied] = useState(false);
  
  const score = answers.filter((a, i) => a === quiz.questions[i].correctIndex).length;
  const total = quiz.questions.length;
  const percentage = Math.round((score / total) * 100);

  const handleShare = async () => {
    const text = `I scored ${score}/${total} (${percentage}%) on ${quiz.title}! 🎉`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text, title: 'My Quiz Score' });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      className="results-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="results-header">
        <h2>Test Complete!</h2>
        <p>{quiz.title}</p>
      </div>

      <ScoreBadge score={score} total={total} />

      <div className="results-breakdown">
        <h3>Question Breakdown</h3>
        <div className="breakdown-list">
          {quiz.questions.map((q, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === q.correctIndex;
            const isSkipped = userAnswer === -1;

            return (
              <motion.div 
                key={index}
                className={`breakdown-item ${isCorrect ? 'correct' : 'incorrect'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="breakdown-header">
                  <span className="breakdown-number">Q{index + 1}</span>
                  {isCorrect ? (
                    <CheckCircle size={18} className="icon-correct" />
                  ) : (
                    <XCircle size={18} className="icon-incorrect" />
                  )}
                </div>
                <p className="breakdown-question">{q.question}</p>
                <div className="breakdown-answers">
                  <div className="answer-row">
                    <span className="label">Your answer:</span>
                    <span className={isCorrect ? 'correct' : 'incorrect'}>
                      {isSkipped ? 'Skipped' : q.options[userAnswer]}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="answer-row">
                      <span className="label">Correct:</span>
                      <span className="correct">{q.options[q.correctIndex]}</span>
                    </div>
                  )}
                </div>
                <p className="breakdown-explanation">{q.explanation}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="results-actions">
        <button className="btn-secondary" onClick={onBackToTests}>
          <Home size={18} />
          Back to Tests
        </button>
        <button className="btn-secondary" onClick={onRetry}>
          <RotateCcw size={18} />
          Retry Test
        </button>
        <button className="btn-primary-quiz" onClick={handleShare}>
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          {copied ? 'Copied!' : 'Share Score'}
        </button>
      </div>
    </motion.div>
  );
};

// ============ QUIZ RUNNER COMPONENT ============
const QuizRunner = ({ quiz, timerEnabled, onComplete, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerEnabled ? quiz.estimatedTime * 60 : null);
  const [isComplete, setIsComplete] = useState(false);
  const { track } = useAnalytics();
  const timerRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (timerEnabled && timeLeft !== null && timeLeft > 0 && !isComplete) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [timerEnabled, isComplete]);

  const handleAutoSubmit = () => {
    // Fill remaining answers as skipped (-1)
    const finalAnswers = answers.map(a => a === null ? -1 : a);
    setAnswers(finalAnswers);
    setIsComplete(true);
    track('test_completed', { 
      quizId: quiz.id, 
      score: finalAnswers.filter((a, i) => a === quiz.questions[i].correctIndex).length,
      autoSubmitted: true
    });
  };

  const handleAnswer = (optionIndex) => {
    if (showFeedback) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
    setShowFeedback(true);
    
    track('question_answered', {
      quizId: quiz.id,
      questionId: currentQuestion + 1,
      correct: optionIndex === quiz.questions[currentQuestion].correctIndex
    });
  };

  const handleSkip = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = -1; // -1 indicates skipped
    setAnswers(newAnswers);
    setShowFeedback(true);
    
    track('question_skipped', {
      quizId: quiz.id,
      questionId: currentQuestion + 1
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
      clearInterval(timerRef.current);
      track('test_completed', { 
        quizId: quiz.id, 
        score: answers.filter((a, i) => a === quiz.questions[i].correctIndex).length 
      });
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers(Array(quiz.questions.length).fill(null));
    setShowFeedback(false);
    setTimeLeft(timerEnabled ? quiz.estimatedTime * 60 : null);
    setIsComplete(false);
    track('test_retry', { quizId: quiz.id });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + (showFeedback ? 1 : 0)) / quiz.questions.length) * 100;

  if (isComplete) {
    return (
      <ResultsView 
        quiz={quiz} 
        answers={answers}
        onRetry={handleRetry}
        onBackToTests={onExit}
      />
    );
  }

  return (
    <div className="quiz-runner">
      {/* Top Progress Bar */}
      <div className="quiz-progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
        <motion.div 
          className="progress-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Quiz Header */}
      <div className="quiz-header">
        <button className="btn-exit" onClick={onExit} aria-label="Exit quiz">
          <X size={20} />
        </button>
        <h2 className="quiz-title">{quiz.title}</h2>
        {timerEnabled && timeLeft !== null && (
          <div className={`timer ${timeLeft < 60 ? 'warning' : ''}`}>
            <Timer size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion}
          question={quiz.questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={quiz.questions.length}
          onAnswer={handleAnswer}
          onSkip={handleSkip}
          onNext={handleNext}
          userAnswer={answers[currentQuestion]}
          showFeedback={showFeedback}
        />
      </AnimatePresence>
    </div>
  );
};

// ============ MAIN PRACTICE COMPONENT ============


// ... (existing imports and sub-components)

// ============ MAIN PRACTICE COMPONENT ============
const Practice = () => {
  const [mode, setMode] = useState('quizzes'); // 'quizzes' or 'coding'
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeCodingProblemId, setActiveCodingProblemId] = useState(null);
  const [timerSettings, setTimerSettings] = useState({});
  const { track } = useAnalytics();

  const toggleTimer = (quizId) => {
    setTimerSettings(prev => ({
      ...prev,
      [quizId]: !prev[quizId]
    }));
  };

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    track('test_started', { quizId: quiz.id, timerEnabled: timerSettings[quiz.id] || false });
  };

  const handleExitQuiz = () => {
    setActiveQuiz(null);
  };

  const handleStartCoding = (problemId) => {
    setActiveCodingProblemId(problemId);
  };

  const handleExitCoding = () => {
    setActiveCodingProblemId(null);
  };

  return (
    <div className="practice-page">
      <div className="page-container">
        <AnimatePresence mode="wait">
          {/* Active Coding Problem Runner */}
          {activeCodingProblemId ? (
             <motion.div
              key="coding-runner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-white" // Full screen for coding
            >
              <CodingProblemRunner 
                problemId={activeCodingProblemId} 
                onExit={handleExitCoding} 
              />
            </motion.div>
          ) : !activeQuiz ? (
            <motion.div
              key="test-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Page Header */}
              <div className="practice-header">
                <h1>Practice Arena</h1>
                <p>Master your skills with interactive quizzes and coding challenges.</p>
              </div>

              {/* Mode Toggles */}
              <div className="mode-toggle-container">
                <div className="mode-toggle-group">
                  <button 
                    onClick={() => setMode('quizzes')}
                    className={`mode-toggle-btn ${mode === 'quizzes' ? 'active' : ''}`}
                  >
                    <FileQuestion size={18} />
                    Quizzes
                  </button>
                  <button 
                    onClick={() => setMode('coding')}
                    className={`mode-toggle-btn ${mode === 'coding' ? 'active' : ''}`}
                  >
                    <Code size={18} />
                    Coding Problems
                  </button>
                </div>
              </div>

              {/* Content Grid */}
              {mode === 'quizzes' ? (
                <div className="tests-grid">
                  {quizData.quizzes.map((quiz) => (
                    <TestCard
                      key={quiz.id}
                      quiz={quiz}
                      onStart={handleStartQuiz}
                      timerEnabled={timerSettings[quiz.id] || false}
                      onToggleTimer={toggleTimer}
                    />
                  ))}
                </div>
              ) : (
                <CodingProblemsList onStart={handleStartCoding} />
              )}

            </motion.div>
          ) : (
            <motion.div
              key="quiz-runner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QuizRunner
                quiz={activeQuiz}
                timerEnabled={timerSettings[activeQuiz.id] || false}
                onComplete={() => {}}
                onExit={handleExitQuiz}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Practice;
