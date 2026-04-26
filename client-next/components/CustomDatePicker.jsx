"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomDatePicker = ({ value, onChange, placeholder = "Select Date" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('days'); // 'days', 'months', 'years'
  const [feedback, setFeedback] = useState(''); // Feedback message
  const containerRef = useRef(null);

  // Parse initial value or default to today
  useEffect(() => {
    if (value) {
      setCurrentDate(new Date(value));
    }
  }, [value]);

  // Reset view when opening
  useEffect(() => {
    if (isOpen) {
      setView('days');
      setFeedback('');
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Navigation Handlers
  const handlePrev = () => {
    if (view === 'days') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (view === 'months') {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    } else if (view === 'years') {
      setCurrentDate(new Date(currentDate.getFullYear() - 12, currentDate.getMonth(), 1));
    }
  };

  const handleNext = () => {
    if (view === 'days') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (view === 'months') {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    } else if (view === 'years') {
      setCurrentDate(new Date(currentDate.getFullYear() + 12, currentDate.getMonth(), 1));
    }
  };

  const handleHeaderClick = () => {
    if (view === 'days') setView('months');
    else if (view === 'months') setView('years');
  };

  // Selection Handlers
  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const offset = selectedDate.getTimezoneOffset();
    const localDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    const formatted = localDate.toISOString().split('T')[0];
    
    onChange(formatted);
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setView('days');
  };

  const handleYearSelect = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView('months');
  };

  // Render Helpers
  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysCount; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = dateObj.toLocaleDateString('en-CA');
      const isSelected = value === dateStr;
      const isToday = new Date().toLocaleDateString('en-CA') === dateStr;
      const isDisabled = dateObj < today;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isDisabled && handleDateClick(day)}
          onMouseEnter={() => isDisabled && setFeedback('Deadline cannot be in the past')}
          onMouseLeave={() => setFeedback('')}
          disabled={isDisabled}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isDisabled ? 'disabled' : ''}`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const renderMonths = () => {
    return months.map((month, index) => (
      <button
        key={month}
        type="button"
        onClick={() => handleMonthSelect(index)}
        className={`calendar-month ${currentDate.getMonth() === index ? 'current' : ''}`}
      >
        {month.substring(0, 3)}
      </button>
    ));
  };

  const renderYears = () => {
    const currentYear = currentDate.getFullYear();
    const startYear = currentYear - 6;
    const endYear = currentYear + 5;
    const years = [];

    for (let year = startYear; year <= endYear; year++) {
      years.push(
        <button
          key={year}
          type="button"
          onClick={() => handleYearSelect(year)}
          className={`calendar-year ${currentDate.getFullYear() === year ? 'current' : ''}`}
        >
          {year}
        </button>
      );
    }
    return years;
  };

  const getHeaderText = () => {
    if (view === 'days') return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    if (view === 'months') return `${currentDate.getFullYear()}`;
    if (view === 'years') {
      const start = currentDate.getFullYear() - 6;
      const end = currentDate.getFullYear() + 5;
      return `${start} - ${end}`;
    }
  };

  return (
    <div className="custom-datepicker" ref={containerRef}>
      <div 
        className={`datepicker-input ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={18} className="input-icon" />
        <span className={value ? 'value-text' : 'placeholder-text'}>
          {value ? new Date(value).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
          }) : placeholder}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="calendar-dropdown"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="calendar-header">
              <button type="button" onClick={handlePrev} className="nav-btn">
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={handleHeaderClick} className="month-year-btn">
                {getHeaderText()}
              </button>
              <button type="button" onClick={handleNext} className="nav-btn">
                <ChevronRight size={18} />
              </button>
            </div>

            {view === 'days' && (
              <>
                <div className="calendar-weekdays">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
                <div className="calendar-grid days-grid">
                  {renderDays()}
                </div>
              </>
            )}

            {view === 'months' && (
              <div className="calendar-grid months-grid">
                {renderMonths()}
              </div>
            )}

            {view === 'years' && (
              <div className="calendar-grid years-grid">
                {renderYears()}
              </div>
            )}

            {/* Feedback Footer */}
            <div className={`calendar-footer ${feedback ? 'error' : ''}`}>
              {feedback ? (
                <>
                  <AlertCircle size={14} />
                  <span>{feedback}</span>
                </>
              ) : (
                <span className="hint">Select a future date</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-datepicker {
          position: relative;
          width: 100%;
          font-family: 'Inter', sans-serif;
        }

        .datepicker-input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.5rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--text-main);
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }

        .datepicker-input:hover, .datepicker-input.active {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }

        .value-text {
          color: var(--text-main);
          font-weight: 500;
        }

        .placeholder-text {
          color: var(--text-muted);
        }

        .calendar-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 300px;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          z-index: 50;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .month-year-btn {
          font-weight: 600;
          color: var(--text-main);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background 0.2s;
          font-size: 1rem;
        }

        .month-year-btn:hover {
          background: var(--hover-bg, #f1f5f9);
          color: #6366f1;
        }

        .nav-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn:hover {
          background: var(--hover-bg, #f1f5f9);
          color: var(--text-main);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .calendar-weekdays span {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        /* GRIDS */
        .calendar-grid {
          display: grid;
          gap: 4px;
        }

        .days-grid {
          grid-template-columns: repeat(7, 1fr);
        }

        .months-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .years-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        /* CELLS */
        .calendar-day, .calendar-month, .calendar-year {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          border-radius: 8px;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.1s;
        }

        .calendar-day { aspect-ratio: 1; font-size: 0.9rem; }
        .calendar-month { padding: 12px; font-size: 0.9rem; }
        .calendar-year { padding: 12px; font-size: 0.9rem; }

        .calendar-day:hover:not(.empty):not(.disabled), 
        .calendar-month:hover, 
        .calendar-year:hover {
          background: var(--hover-bg, #f1f5f9);
          color: #6366f1;
        }

        .calendar-day.selected, 
        .calendar-month.selected, 
        .calendar-year.selected {
          background: #6366f1;
          color: white;
          font-weight: 600;
        }

        .calendar-day.today, 
        .calendar-month.current, 
        .calendar-year.current {
          border: 1px solid #6366f1;
          color: #6366f1;
        }
        
        .calendar-day.today.selected {
          color: white;
        }

        .calendar-day.empty {
          cursor: default;
        }

        .calendar-day.disabled {
          color: var(--text-muted);
          opacity: 0.3;
          cursor: not-allowed;
          text-decoration: line-through;
        }

        /* FOOTER */
        .calendar-footer {
          margin-top: 1rem;
          padding-top: 0.8rem;
          border-top: 1px solid var(--border);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
          min-height: 24px;
        }

        .calendar-footer.error {
          color: #ef4444;
          font-weight: 500;
        }

        .calendar-footer .hint {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default CustomDatePicker;
