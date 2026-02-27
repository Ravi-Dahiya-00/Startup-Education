import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, MessageSquare, User, Menu, X, ChevronDown, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API_URL from '../config/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const navLinks = [
    { name: 'Internships', path: '/internships' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Competitions', path: '/competitions' },
    { name: 'Courses', path: '/courses' },
    { name: 'Practice', path: '/practice' },
  ];

  const moreLinks = [
    { name: 'Blogs', path: '/blogs' },
    { name: 'Scholarships', path: '/scholarships' },
    { name: 'University Notes', path: '/notes' },
  ];

  // Popular searches
  const popularSearches = [
    'Frontend Developer',
    'Data Science',
    'Machine Learning',
    'UI/UX Design',
    'Full Stack',
  ];

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/search/suggestions`, {
          params: { q: searchQuery }
        });
        setSuggestions(response.data.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchFocused(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
    setSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          Startup<span className="highlight">Ed</span>
        </Link>

        {/* Desktop Search */}
        <div className="nav-search-wrapper" ref={searchRef}>
          <form onSubmit={handleSearch} className="nav-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search opportunities, courses, blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setSearchFocused(true);
                setShowSuggestions(true);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="search-clear"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Search Suggestions Dropdown */}
          <AnimatePresence>
            {searchFocused && showSuggestions && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="search-suggestions"
              >
                {searchQuery.trim().length < 2 && (
                  <div className="suggestions-section">
                    <div className="suggestions-header">
                      <TrendingUp size={14} />
                      <span>Popular Searches</span>
                    </div>
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(search)}
                      >
                        <Search size={14} />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery.trim().length >= 2 && suggestions.length > 0 && (
                  <div className="suggestions-section">
                    <div className="suggestions-header">
                      <Search size={14} />
                      <span>Suggestions</span>
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion.title)}
                      >
                        <Search size={14} />
                        <div className="suggestion-content">
                          <span>{suggestion.title}</span>
                          <span className="suggestion-type">{suggestion.type}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery.trim().length >= 2 && suggestions.length === 0 && (
                  <div className="suggestions-empty">
                    <p>No suggestions found</p>
                    <small>Press Enter to search</small>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="nav-item">
              {link.name}
            </Link>
          ))}
          
          <div 
            className="nav-item dropdown-container"
            onMouseEnter={() => setActiveDropdown('more')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="dropdown-trigger">
              More <ChevronDown size={14} />
            </span>
            
            <AnimatePresence>
              {activeDropdown === 'more' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="dropdown-menu"
                >
                  {moreLinks.map((link) => (
                    <Link key={link.name} to={link.path} className="dropdown-item">
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          <button className="icon-btn" title="Messages">
            <MessageSquare size={20} />
          </button>
          <button className="icon-btn" title="Notifications">
            <Bell size={20} />
          </button>
          
          {user ? (
            <div className="nav-item dropdown-container" 
                 onMouseEnter={() => setActiveDropdown('profile')}
                 onMouseLeave={() => setActiveDropdown(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', overflow: 'hidden' }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user.name}</span>
              </div>

              <AnimatePresence>
                {activeDropdown === 'profile' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="dropdown-menu"
                    style={{ right: 0, left: 'auto', minWidth: '150px' }}
                  >
                    <Link to="/profile" className="dropdown-item">My Profile</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                    )}
                    <button onClick={logout} className="dropdown-item" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Login</Link>
              <Link to="/signup" className="btn-outline" style={{ textDecoration: 'none' }}>Sign Up</Link>
            </>
          )}
          
          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mobile-nav"
          >
            <div className="mobile-search">
              <Search size={18} />
              <input type="text" placeholder="Search..." />
            </div>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="mobile-nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mobile-divider"></div>
            {moreLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="mobile-nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
