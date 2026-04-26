"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowRight, Briefcase, Award, Code, BookOpen, 
  Users, TrendingUp, X, Sparkles, Building2, GraduationCap,
  Trophy, Newspaper, DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import API_URL from '@/lib/api';

const Hero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);

  const categories = [
    { id: 'internships', name: 'Internships', icon: Briefcase, color: 'from-blue-500 to-cyan-400', link: '/internships' },
    { id: 'jobs', name: 'Jobs', icon: Building2, color: 'from-violet-500 to-purple-400', link: '/jobs' },
    { id: 'competitions', name: 'Competitions', icon: Trophy, color: 'from-orange-500 to-amber-400', link: '/competitions' },
    { id: 'courses', name: 'Courses', icon: GraduationCap, color: 'from-emerald-500 to-green-400', link: '/courses' },
    { id: 'blogs', name: 'Blogs', icon: Newspaper, color: 'from-pink-500 to-rose-400', link: '/blogs' },
    { id: 'scholarships', name: 'Scholarships', icon: DollarSign, color: 'from-indigo-500 to-blue-400', link: '/scholarships' },
  ];

  const popularSearches = [
    'Frontend Developer',
    'Data Science Internship',
    'UI/UX Designer',
    'Machine Learning',
    'Full Stack Developer',
    'Marketing Intern',
  ];

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        console.log('Fetching suggestions for:', searchQuery);
        const response = await fetch(`${API_URL}/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Suggestions received:', data);
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        // Don't clear suggestions on error immediately to avoid flashing
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Load recent searches
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const performSearch = (query) => {
    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const newRecent = [query, ...recent.filter(q => q !== query)].slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));

    // Navigate to search page
    const params = new URLSearchParams({ q: query });
    if (selectedCategory) {
      params.append('type', selectedCategory);
    }
    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    performSearch(suggestion);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? '' : categoryId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="hero-section-search">
      <div className="hero-search-container">
        <motion.div 
          className="hero-search-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="hero-badge">
            <Sparkles size={16} />
            <span>Discover Your Next Opportunity</span>
          </motion.div>
          
          {/* Title */}
          <motion.h1 variants={itemVariants} className="hero-search-title">
            Search <span className="text-gradient">Opportunities</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p variants={itemVariants} className="hero-search-subtitle">
            Find internships, jobs, courses, competitions, and more from top companies
          </motion.p>
          
          {/* Main Search Bar */}
          <motion.div variants={itemVariants} className="hero-search-wrapper" ref={searchRef}>
            <form onSubmit={handleSearch} className="hero-search-bar">
              <Search className="hero-search-icon" size={24} />
              <input
                type="text"
                placeholder="Search for roles, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="hero-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hero-search-clear"
                >
                  <X size={20} />
                </button>
              )}
              <button type="submit" className="hero-search-btn">
                Search
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="hero-search-dropdown"
                >
                  {/* Popular Searches */}
                  {!searchQuery && popularSearches.length > 0 && (
                    <div className="search-dropdown-section">
                      <div className="dropdown-section-header">
                        <TrendingUp size={14} />
                        <span>Popular Searches</span>
                      </div>
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          className="dropdown-item"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          <Search size={14} />
                          <span>{search}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Recent Searches */}
                  {!searchQuery && recentSearches.length > 0 && (
                    <div className="search-dropdown-section">
                      <div className="dropdown-section-header">
                        <span>Recent Searches</span>
                      </div>
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          className="dropdown-item"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          <Search size={14} />
                          <span>{search}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Autocomplete Suggestions */}
                  {searchQuery && suggestions.length > 0 && (
                    <div className="search-dropdown-section">
                      <div className="dropdown-section-header">
                        <Search size={14} />
                        <span>Suggestions</span>
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="dropdown-item"
                          onClick={() => handleSuggestionClick(suggestion.title)}
                        >
                          <Search size={14} />
                          <div className="dropdown-item-content">
                            <span>{suggestion.title}</span>
                            <span className="suggestion-type-badge">{suggestion.type}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery && suggestions.length === 0 && (
                    <div className="dropdown-empty">
                      <p>No suggestions found</p>
                      <small>Press Enter to search</small>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Category Cards Grid (Restored) */}
          <motion.div variants={itemVariants} className="hero-categories-wrapper">
            <p className="categories-label">Or browse by category:</p>
            <div className="category-cards-grid">
              {categories.map((cat) => (
                <Link href={cat.link} key={cat.id} className="category-card-link">
                  <motion.div 
                    className={`category-box bg-gradient-to-br ${cat.color}`}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="category-box-icon">
                      <cat.icon size={24} color="white" />
                    </div>
                    <span className="category-box-name">{cat.name}</span>
                    <div className="category-box-arrow">
                      <ArrowRight size={16} />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="hero-search-stats">
            <div className="stat-item">
              <h3>10k+</h3>
              <p>Live Opportunities</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Top Companies</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>100k+</h3>
              <p>Happy Students</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Glow Effects */}
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
      </div>
    </section>
  );
};

export default Hero;
