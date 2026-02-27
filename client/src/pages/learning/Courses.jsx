import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, BookOpen, Star, Clock, Filter, PlayCircle, 
  ChevronDown, X, Sparkles, TrendingUp, Users, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../../config/api';
import './Courses.css';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    level: [],
    price: []
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/courses`);
        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setFilters({ level: [], price: [] });
  };

  const activeFilterCount = filters.level.length + filters.price.length;

  // Stats data
  const stats = [
    { icon: BookOpen, value: '50+', label: 'Courses' },
    { icon: Users, value: '10K+', label: 'Students' },
    { icon: Award, value: '4.8', label: 'Avg Rating' },
  ];

  if (loading) {
    return (
      <div className="courses-page">
        <div className="courses-loading">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      {/* Hero Section */}
      <section className="courses-hero">
        <div className="hero-bg-pattern"></div>
        <div className="courses-hero-content">
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles size={14} />
            <span>Learn from the best</span>
          </motion.div>
          
          <motion.h1 
            className="courses-hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Master New <span className="gradient-text">Skills</span>
          </motion.h1>
          
          <motion.p 
            className="courses-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Top-rated courses to accelerate your career. Learn at your own pace with industry experts.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            className="courses-search-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="courses-search">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search courses (e.g. Python, Web Development, Design)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
              <button className="btn-search-courses">
                <Search size={18} />
                Search
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="courses-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <stat.icon size={20} className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="courses-content">
        <div className="courses-container">
          {/* Filters Bar */}
          <div className="courses-toolbar">
            <div className="toolbar-left">
              <button 
                className={`filter-toggle ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="filter-count">{activeFilterCount}</span>
                )}
                <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
              </button>
              
              {activeFilterCount > 0 && (
                <button className="btn-clear-filters" onClick={clearFilters}>
                  Clear all
                </button>
              )}
            </div>
            
            <div className="toolbar-right">
              <span className="results-count">
                {courses.length} courses available
              </span>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="filters-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="filters-grid">
                  <div className="filter-group">
                    <h4>Level</h4>
                    <div className="filter-options">
                      {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <label 
                          key={level}
                          className={`filter-chip ${filters.level.includes(level) ? 'active' : ''}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={filters.level.includes(level)}
                            onChange={() => toggleFilter('level', level)}
                          />
                          {level}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="filter-group">
                    <h4>Price</h4>
                    <div className="filter-options">
                      {['Free', 'Paid'].map(price => (
                        <label 
                          key={price}
                          className={`filter-chip ${filters.price.includes(price) ? 'active' : ''}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={filters.price.includes(price)}
                            onChange={() => toggleFilter('price', price)}
                          />
                          {price}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Courses Grid */}
          <div className="courses-grid">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <motion.div 
                  key={course._id} 
                  className="course-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="course-thumbnail">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="play-overlay">
                      <PlayCircle size={48} />
                    </div>
                    <span className="course-level">{course.level || 'Beginner'}</span>
                  </div>

                  <div className="course-body">
                    <div className="course-meta-row">
                      <span className="course-category">{course.category}</span>
                      <span className="course-rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        {course.rating || '4.5'}
                      </span>
                    </div>
                    
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-instructor">by {course.instructor}</p>
                    
                    <div className="course-footer">
                      <div className="course-duration">
                        <Clock size={14} />
                        {course.duration}
                      </div>
                      <div className="course-price">
                        {course.price === 'Free' || course.price === 0 ? (
                          <span className="price-free">Free</span>
                        ) : (
                          <span className="price-paid">₹{course.price}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn-enroll"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    Enroll Now
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="courses-empty">
                <BookOpen size={48} />
                <h3>No courses found</h3>
                <p>We're adding new courses regularly. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
