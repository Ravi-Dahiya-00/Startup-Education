import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Trophy, Calendar, Users, Filter, Award, 
  Share2, Bookmark, ChevronRight, MapPin, Globe, 
  Clock, DollarSign, TrendingUp, Building2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareModal from '../../components/ShareModal';
import API_URL from '../../config/api';

const MODES = ['Online', 'Offline', 'Hybrid'];
const CATEGORIES = ['Coding', 'Design', 'Business', 'Hackathon', 'Quiz', 'Innovation'];
const STATUSES = ['Live', 'Upcoming', 'Ended'];
const PRIZE_RANGES = ['< ₹10k', '₹10k - ₹50k', '₹50k - ₹1L', '> ₹1L'];

const Competitions = () => {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'Live',
    mode: [],
    category: [],
    prizeRange: []
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('competitions-theme') || 'dark';
  });
  const [savedCompetitions, setSavedCompetitions] = useState(new Set());
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [itemToShare, setItemToShare] = useState(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/competitions`);
        const data = await response.json();
        
        // Enrich data with mock fields if missing
        const enrichedData = data.map(item => ({
          ...item,
          mode: item.mode || MODES[Math.floor(Math.random() * MODES.length)],
          category: item.category || CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
          status: new Date(item.deadline) > new Date() ? 'Live' : 'Ended',
          entryFee: Math.random() > 0.7 ? '₹500' : 'Free',
          teamSize: Math.floor(Math.random() * 4) + 1,
          registeredCount: Math.floor(Math.random() * 500) + 50
        }));

        setCompetitions(enrichedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching competitions:', error);
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  useEffect(() => {
    localStorage.setItem('competitions-theme', theme);
  }, [theme]);

  const handleFilterChange = (category, value) => {
    if (category === 'status') {
      setFilters(prev => ({ ...prev, [category]: value === prev[category] ? '' : value }));
    } else {
      setFilters(prev => {
        const current = prev[category];
        if (current.includes(value)) {
          return { ...prev, [category]: current.filter(item => item !== value) };
        } else {
          return { ...prev, [category]: [...current, value] };
        }
      });
    }
  };

  const toggleSave = (id) => {
    setSavedCompetitions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredCompetitions = competitions.filter(comp => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      comp.title.toLowerCase().includes(searchLower) ||
      comp.organizer.toLowerCase().includes(searchLower) ||
      comp.tags.some(tag => tag.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    // Status Filter
    if (filters.status) {
      if (filters.status === 'Live' && comp.status !== 'Live') return false;
      if (filters.status === 'Ended' && comp.status !== 'Ended') return false;
    }

    // Mode Filter
    if (filters.mode.length > 0) {
      if (!filters.mode.includes(comp.mode)) return false;
    }

    // Category Filter
    if (filters.category.length > 0) {
      if (!filters.category.includes(comp.category)) return false;
    }

    return true;
  });

  const featuredOrganizers = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png', count: 3 },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Meta_Platforms_Inc._logo.svg/2048px-Meta_Platforms_Inc._logo.svg.png', count: 2 },
    { name: 'HackerRank', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png', count: 5 }
  ];

  if (loading) {
    return (
      <div className="competitions-loading">
        <div className="loading-spinner"></div>
        <p>Loading competitions...</p>
      </div>
    );
  }

  return (
    <div className={`competitions-page ${theme}-theme`}>
      {/* Premium Header */}
      <div className="competitions-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1>Competitions</h1>
            <span className="count-badge">{filteredCompetitions.length}</span>
          </div>
          <div className="header-search">
            <Search size={20} />
            <input 
              type="text"
              placeholder="Search hackathons, quizzes, and challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="theme-toggle-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="competitions-layout">
        {/* Filters Sidebar */}
        <aside className="filters-panel">
          <div className="filters-header">
            <div className="filters-title">
              <Filter size={18} />
              <span>Filters</span>
            </div>
            {(filters.mode.length > 0 || filters.category.length > 0 || filters.status !== 'Live') && (
              <button 
                className="clear-all-btn"
                onClick={() => setFilters({ status: 'Live', mode: [], category: [], prizeRange: [] })}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <div className="pill-group">
              {STATUSES.map(status => (
                <button
                  key={status}
                  className={`pill ${filters.status === status ? 'active' : ''}`}
                  onClick={() => handleFilterChange('status', status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Filter */}
          <div className="filter-group">
            <label className="filter-label">Mode</label>
            <div className="pill-group">
              {MODES.map(mode => (
                <button
                  key={mode}
                  className={`pill ${filters.mode.includes(mode) ? 'active' : ''}`}
                  onClick={() => handleFilterChange('mode', mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="pill-group">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  className={`pill ${filters.category.includes(category) ? 'active' : ''}`}
                  onClick={() => handleFilterChange('category', category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="competitions-grid">
            <AnimatePresence>
              {filteredCompetitions.map((comp, index) => (
                <motion.div
                  key={comp._id}
                  className="competition-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="card-header">
                    <div className="organizer-info">
                      <div className="organizer-logo">
                        <Trophy size={24} />
                      </div>
                      <div className="organizer-details">
                        <h3 
                          className="comp-title"
                          onClick={() => navigate(`/competitions/${comp._id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          {comp.title}
                        </h3>
                        <p className="organizer-name">By {comp.organizer}</p>
                      </div>
                    </div>
                    <button 
                      className={`save-btn ${savedCompetitions.has(comp._id) ? 'saved' : ''}`}
                      onClick={() => toggleSave(comp._id)}
                    >
                      <Bookmark size={20} />
                    </button>
                  </div>

                  <div className="card-meta">
                    <div className="meta-item">
                      <Globe size={16} />
                      <span>{comp.mode}</span>
                    </div>
                    <div className="meta-item">
                      <Award size={16} />
                      <span>{comp.prize}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{comp.teamSize} Members</span>
                    </div>
                    <div className="meta-item">
                      <DollarSign size={16} />
                      <span>{comp.entryFee}</span>
                    </div>
                  </div>

                  <div className="card-tags">
                    {comp.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>

                  <div className="card-footer">
                    <div className="footer-left">
                      <div className="badge-group">
                        <span className="badge">{comp.category}</span>
                      </div>
                      <div className="registered">
                        <Users size={14} />
                        <span>{comp.registeredCount} Registered</span>
                      </div>
                    </div>
                    <div className="footer-right">
                      <button 
                        className="share-btn"
                        onClick={() => {
                          setItemToShare(comp);
                          setShareModalOpen(true);
                        }}
                      >
                        <Share2 size={18} />
                      </button>
                      <button 
                        className="register-btn"
                        onClick={() => navigate(`/competitions/${comp._id}`)}
                      >
                        Register
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="card-bottom-meta">
                    <span className="deadline-label">Deadline:</span>
                    <span className="deadline-date">{new Date(comp.deadline).toLocaleDateString()}</span>
                    <span className="status-badge" style={{ 
                      color: comp.status === 'Live' ? '#10b981' : '#ef4444',
                      background: comp.status === 'Live' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {comp.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredCompetitions.length === 0 && (
              <div className="no-results">
                <Trophy size={48} />
                <h3>No competitions found</h3>
                <p>Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </main>

        {/* Featured Panel */}
        <aside className="featured-panel">
          <div className="featured-header">
            <TrendingUp size={18} />
            <h3>Top Organizers</h3>
          </div>
          
          <div className="featured-companies">
            {featuredOrganizers.map(org => (
              <div key={org.name} className="featured-company">
                <img src={org.logo} alt={org.name} onError={(e) => e.target.style.display = 'none'} />
                <div className="company-meta">
                  <h4>{org.name}</h4>
                  <p>{org.count} active events</p>
                </div>
              </div>
            ))}
          </div>

          <div className="stats-card">
            <div className="stat-item">
              <div className="stat-icon">
                <Trophy size={20} />
              </div>
              <div className="stat-info">
                <h4>₹50L+</h4>
                <p>Total Prizes</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Users size={20} />
              </div>
              <div className="stat-info">
                <h4>10k+</h4>
                <p>Participants</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <ShareModal
        item={itemToShare}
        type="competition"
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <style>{`
        /* ===== THEME SYSTEM ===== */
        .competitions-page {
          min-height: 100vh;
          font-family: var(--font-main);
          padding-top: 70px;
          transition: background-color 0.3s ease;
        }

        /* Dark Theme (Default) */
        .dark-theme {
          background: var(--page-bg);
          --page-bg: var(--page-bg);
          --page-surface: var(--page-surface);
          --page-surface-hover: var(--page-surface-hover);
          --page-text-main: var(--page-text-main);
          --page-text-muted: var(--page-text-muted);
          --page-border: var(--page-border);
        }

        /* Light Theme */
        .light-theme {
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
          --page-bg: #ffffff;
          --page-surface: #ffffff;
          --page-surface-hover: #f9fafb;
          --page-text-main: #111827;
          --page-text-muted: #6b7280;
          --page-border: #e5e7eb;
        }

        /* Theme Toggle Button */
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(236, 72, 153, 0.1);
          border: 1px solid rgba(236, 72, 153, 0.2);
          color: #ec4899;
          padding: 0.625rem 1.25rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-toggle-btn:hover {
          background: rgba(236, 72, 153, 0.15);
          border-color: #ec4899;
          transform: translateY(-1px);
        }

        /* Loading State */
        .competitions-loading {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(236, 72, 153, 0.1);
          border-top-color: #ec4899;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Premium Header */
        .competitions-header {
          background: var(--page-surface);
          padding: 2rem 3rem;
          border-bottom: 1px solid var(--page-border);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .header-title-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-title-section h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--page-text-main);
          margin: 0;
          letter-spacing: -0.5px;
        }

        .count-badge {
          background: rgba(236, 72, 153, 0.2);
          backdrop-filter: blur(10px);
          color: #ec4899;
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid rgba(236, 72, 153, 0.3);
        }

        .header-search {
          position: relative;
          max-width: 500px;
          flex: 1;
        }

        .header-search svg {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--page-text-muted);
          z-index: 1;
        }

        .header-search input {
          width: 100%;
          padding: 0.875rem 1.25rem 0.875rem 3.25rem;
          border: 1px solid var(--page-border);
          border-radius: 12px;
          font-size: 0.9375rem;
          background: var(--page-bg);
          color: var(--page-text-main);
          transition: all 0.2s ease;
        }

        .header-search input::placeholder {
          color: var(--page-text-muted);
        }

        .header-search input:focus {
          outline: none;
          border-color: #ec4899;
          box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
        }

        /* Main Layout */
        .competitions-layout {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 3rem;
          display: grid;
          grid-template-columns: 280px 1fr 320px;
          gap: 2rem;
          align-items: start;
        }

        /* Filters Panel */
        .filters-panel {
          background: var(--page-surface);
          border: 1px solid var(--page-border);
          border-radius: 16px;
          padding: 1.5rem;
          position: sticky;
          top: 90px;
          max-height: calc(100vh - 110px);
          overflow-y: auto;
        }

        .filters-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--page-border);
        }

        .filters-title {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--page-text-main);
        }

        .filters-title svg {
          color: #ec4899;
        }

        .clear-all-btn {
          background: none;
          border: none;
          color: #ec4899;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .clear-all-btn:hover {
          background: rgba(236, 72, 153, 0.1);
        }

        .filter-group {
          margin-bottom: 1.75rem;
        }

        .filter-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--page-text-muted);
          margin-bottom: 0.75rem;
        }

        .pill-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .pill {
          background: var(--page-bg);
          border: 1.5px solid var(--page-border);
          color: var(--page-text-muted);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill:hover {
          border-color: #ec4899;
          color: #ec4899;
          background: rgba(236, 72, 153, 0.05);
        }

        .pill.active {
          background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
          border-color: #ec4899;
          color: white;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
        }

        /* Main Content */
        .main-content {
          min-height: 600px;
        }

        .competitions-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .competition-card {
          background: var(--page-surface);
          border: 1px solid var(--page-border);
          border-radius: 16px;
          padding: 1.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .competition-card:hover {
          border-color: #ec4899;
          box-shadow: 0 8px 24px rgba(236, 72, 153, 0.15);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .organizer-info {
          display: flex;
          gap: 1rem;
          flex: 1;
        }

        .organizer-logo {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(236, 72, 153, 0.1);
          color: #ec4899;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(236, 72, 153, 0.2);
        }

        .organizer-details {
          flex: 1;
        }

        .comp-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--page-text-main);
          margin: 0 0 0.375rem 0;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }

        .organizer-name {
          font-size: 0.9375rem;
          color: var(--page-text-muted);
          margin: 0;
          font-weight: 500;
        }

        .save-btn {
          background: var(--page-bg);
          border: 1px solid var(--page-border);
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--page-text-muted);
          transition: all 0.2s ease;
        }

        .save-btn:hover {
          background: rgba(236, 72, 153, 0.1);
          border-color: #ec4899;
          color: #ec4899;
        }

        .save-btn.saved {
          background: #ec4899;
          border-color: #ec4899;
          color: white;
        }

        .card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-bottom: 1rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--page-border);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--page-text-muted);
        }

        .meta-item svg {
          color: var(--page-text-muted);
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-bottom: 1.25rem;
        }

        .tag {
          background: rgba(236, 72, 153, 0.1);
          color: #ec4899;
          padding: 0.375rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          border: 1px solid rgba(236, 72, 153, 0.2);
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--page-border);
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .badge-group {
          display: flex;
          gap: 0.5rem;
        }

        .badge {
          background: var(--page-bg);
          color: var(--page-text-muted);
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid var(--page-border);
        }

        .registered {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #10b981;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .footer-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .share-btn {
          background: var(--page-bg);
          border: 1px solid var(--page-border);
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--page-text-muted);
          transition: all 0.2s ease;
        }

        .share-btn:hover {
          background: rgba(236, 72, 153, 0.1);
          border-color: #ec4899;
          color: #ec4899;
        }

        .register-btn {
          background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.25);
        }

        .register-btn:hover {
          box-shadow: 0 4px 16px rgba(236, 72, 153, 0.35);
          transform: translateY(-1px);
        }

        .card-bottom-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: var(--page-text-muted);
        }

        .deadline-date {
          color: #f59e0b;
          font-weight: 600;
          margin-right: 1rem;
        }

        /* Featured Panel */
        .featured-panel {
          position: sticky;
          top: 90px;
        }

        .featured-header {
          background: var(--page-surface);
          border: 1px solid var(--page-border);
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .featured-header svg {
          color: #ec4899;
        }

        .featured-header h3 {
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--page-text-main);
          margin: 0;
        }

        .featured-companies {
          background: var(--page-surface);
          border: 1px solid var(--page-border);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.25rem;
        }

        .featured-company {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 0.75rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .featured-company:hover {
          background: var(--page-surface-hover);
        }

        .featured-company img {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          object-fit: contain;
          background: var(--page-bg);
          padding: 8px;
          border: 1px solid var(--page-border);
        }

        .company-meta h4 {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--page-text-main);
          margin: 0 0 0.25rem 0;
        }

        .company-meta p {
          font-size: 0.8125rem;
          color: var(--page-text-muted);
          margin: 0;
        }

        .stats-card {
          background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 24px rgba(236, 72, 153, 0.2);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .stat-item:last-child {
          margin-bottom: 0;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-info h4 {
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          margin: 0 0 0.25rem 0;
          letter-spacing: -0.5px;
        }

        .stat-info p {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-weight: 500;
        }

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          color: var(--page-text-muted);
          background: var(--page-surface);
          border-radius: 16px;
          border: 1px solid var(--page-border);
        }

        .no-results svg {
          margin-bottom: 1rem;
          color: var(--page-text-muted);
          opacity: 0.5;
        }

        /* Responsive Design */
        @media (max-width: 1280px) {
          .competitions-layout {
            grid-template-columns: 260px 1fr;
            padding: 1.5rem 2rem;
          }
          
          .featured-panel {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .competitions-header {
            padding: 1.5rem 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
          }

          .header-search {
            max-width: none;
          }

          .competitions-layout {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .filters-panel {
            position: relative;
            top: 0;
            max-height: none;
          }

          .competition-card {
            padding: 1.25rem;
          }

          .card-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .footer-right {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default Competitions;
