import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Briefcase, Code, Trophy, BookOpen, FileText, Award, Clock, MapPin, Building2, Calendar, User, ArrowRight, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API_URL from '../../config/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || '';

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(typeParam);
  const [searchQuery, setSearchQuery] = useState(query);

  const categories = [
    { id: '', label: 'All Results', icon: Search },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'jobs', label: 'Jobs', icon: Building2 },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'competitions', label: 'Competitions', icon: Trophy },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'scholarships', label: 'Scholarships', icon: Award },
  ];

  useEffect(() => {
    if (query) {
      performSearch(query, selectedType);
    }
  }, [query, selectedType]);

  const performSearch = async (searchQuery, type) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/search`, {
        params: { q: searchQuery, type: type || undefined }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}${selectedType ? `&type=${selectedType}` : ''}`;
    }
  };

  const renderInternshipCard = (item) => (
    <Link to={`/internships/${item._id}`} className="search-result-card" key={item._id}>
      <div className="result-icon-wrapper" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
        <Briefcase size={20} />
      </div>
      <div className="result-content">
        <div className="result-header">
          <h3 className="result-title">{item.role}</h3>
          <span className="result-type">Internship</span>
        </div>
        <p className="result-company">
          <Building2 size={14} />
          {item.company}
        </p>
        <div className="result-meta">
          <span><MapPin size={14} /> {item.location}</span>
          <span><Clock size={14} /> {item.duration}</span>
          {item.stipend && <span className="text-green">₹{item.stipend}/month</span>}
        </div>
      </div>
      <ArrowRight className="result-arrow" size={20} />
    </Link>
  );

  const renderJobCard = (item) => (
    <Link to={`/jobs/${item._id}`} className="search-result-card" key={item._id}>
      <div className="result-icon-wrapper" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
        <Building2 size={20} />
      </div>
      <div className="result-content">
        <div className="result-header">
          <h3 className="result-title">{item.role}</h3>
          <span className="result-type">Job</span>
        </div>
        <p className="result-company">
          <Building2 size={14} />
          {item.company}
        </p>
        <div className="result-meta">
          <span><MapPin size={14} /> {item.location}</span>
          {item.experience && <span>Exp: {item.experience}</span>}
          {item.salary && <span className="text-green">₹{item.salary}</span>}
        </div>
      </div>
      <ArrowRight className="result-arrow" size={20} />
    </Link>
  );

  const renderCourseCard = (item) => (
    <Link to={`/courses`} className="search-result-card" key={item._id}>
      <div className="result-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f97316, #fbbf24)' }}>
        <BookOpen size={20} />
      </div>
      <div className="result-content">
        <div className="result-header">
          <h3 className="result-title">{item.title}</h3>
          <span className="result-type">Course</span>
        </div>
        <p className="result-company">
          <User size={14} />
          {item.instructor}
        </p>
        <div className="result-meta">
          <span><Clock size={14} /> {item.duration}</span>
          <span>Level: {item.level}</span>
          {item.rating && <span className="text-green">⭐ {item.rating}</span>}
        </div>
      </div>
      <ArrowRight className="result-arrow" size={20} />
    </Link>
  );

  const renderCompetitionCard = (item) => (
    <Link to={`/competitions`} className="search-result-card" key={item._id}>
      <div className="result-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
        <Trophy size={20} />
      </div>
      <div className="result-content">
        <div className="result-header">
          <h3 className="result-title">{item.title}</h3>
          <span className="result-type">Competition</span>
        </div>
        <p className="result-company">
          <Building2 size={14} />
          {item.organizer}
        </p>
        <div className="result-meta">
          <span><Calendar size={14} /> Deadline: {new Date(item.deadline).toLocaleDateString()}</span>
          {item.prizes && <span className="text-green">Prize: {item.prizes}</span>}
        </div>
      </div>
      <ArrowRight className="result-arrow" size={20} />
    </Link>
  );

  const renderBlogCard = (item) => (
    <Link to={`/blogs`} className="search-result-card" key={item._id}>
      <div className="result-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
        <FileText size={20} />
      </div>
      <div className="result-content">
        <div className="result-header">
          <h3 className="result-title">{item.title}</h3>
          <span className="result-type">Blog</span>
        </div>
        <p className="result-excerpt">{item.excerpt}</p>
        <div className="result-meta">
          <span><User size={14} /> {item.author}</span>
          <span><Clock size={14} /> {item.readTime}</span>
          <span>{item.category}</span>
        </div>
      </div>
      <ArrowRight className="result-arrow" size={20} />
    </Link>
  );

  const renderScholarshipCard = (item) => (
    <Link to={`/scholarships`} className="search-result-card" key={item._id}>
      <div className="result-icon-wrapper" style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}>
        <Award size={20} />
      </div>
      <div className="result-content">
        <div className="result-header">
          <h3 className="result-title">{item.title}</h3>
          <span className="result-type">Scholarship</span>
        </div>
        <p className="result-company">
          <Building2 size={14} />
          {item.provider}
        </p>
        <div className="result-meta">
          <span><Calendar size={14} /> Deadline: {new Date(item.deadline).toLocaleDateString()}</span>
          {item.amount && <span className="text-green">₹{item.amount}</span>}
        </div>
      </div>
      <ArrowRight className="result-arrow" size={20} />
    </Link>
  );

  const renderResults = () => {
    if (!results) return null;

    const allResults = [];

    if (!selectedType || selectedType === 'internships') {
      results.internships?.forEach(item => allResults.push({ ...item, renderFn: renderInternshipCard }));
    }
    if (!selectedType || selectedType === 'jobs') {
      results.jobs?.forEach(item => allResults.push({ ...item, renderFn: renderJobCard }));
    }
    if (!selectedType || selectedType === 'courses') {
      results.courses?.forEach(item => allResults.push({ ...item, renderFn: renderCourseCard }));
    }
    if (!selectedType || selectedType === 'competitions') {
      results.competitions?.forEach(item => allResults.push({ ...item, renderFn: renderCompetitionCard }));
    }
    if (!selectedType || selectedType === 'blogs') {
      results.blogs?.forEach(item => allResults.push({ ...item, renderFn: renderBlogCard }));
    }
    if (!selectedType || selectedType === 'scholarships') {
      results.scholarships?.forEach(item => allResults.push({ ...item, renderFn: renderScholarshipCard }));
    }

    if (allResults.length === 0) {
      return (
        <motion.div 
          className="no-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Search size={64} className="no-results-icon" />
          <h2>No results found</h2>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
        </motion.div>
      );
    }

    return (
      <div className="search-results-list">
        {allResults.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {item.renderFn(item)}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-page-container">
        {/* Search Header */}
        <div className="search-header">
          <h1 className="search-page-title">
            Search Results
            {query && <span className="text-gradient" style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}> for "{query}"</span>}
          </h1>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="search-bar-enhanced">
            <Search size={20} className="search-bar-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all opportunities..."
              className="search-bar-input"
              maxLength={100}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
              >
                <X size={18} />
              </button>
            )}
            <button type="submit" className="search-submit-btn">
              Search
            </button>
          </form>

          {/* Filter Tabs */}
          <div className="search-filters">
            {categories.map((category) => {
              const Icon = category.icon;
              const count = results?.[category.id] 
                ? results[category.id].length 
                : category.id === '' 
                  ? results?.totalResults 
                  : 0;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedType(category.id)}
                  className={`filter-tab ${selectedType === category.id ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  {category.label}
                  {results && <span className="filter-count">{count || 0}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        {results && !loading && (
          <div className="results-summary">
            <p>
              Found <strong>{results.totalResults}</strong> result{results.totalResults !== 1 ? 's' : ''}
              {selectedType && ` in ${categories.find(c => c.id === selectedType)?.label}`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Searching...</p>
          </div>
        )}

        {/* Results */}
        {!loading && renderResults()}
      </div>
    </div>
  );
};

export default SearchResults;
