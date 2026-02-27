import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Calendar, DollarSign, Filter, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import API_URL from '../../config/api';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/scholarships`);
      if (!response.ok) {
        throw new Error('Failed to fetch scholarships');
      }
      const data = await response.json();
      setScholarships(data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setError('Failed to load scholarships. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>Loading scholarships...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh', gap: '1rem' }}>
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h3 style={{ color: 'var(--text-muted)' }}>{error}</h3>
        <button 
          onClick={fetchScholarships}
          style={{
            padding: '0.5rem 1.5rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Find <span className="text-highlight">Scholarships</span></h1>
        <p className="page-subtitle">Financial aid and grants for your education.</p>
        
        <div className="search-bar-large">
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Search scholarships..." />
          <button className="btn-search">Search</button>
        </div>
      </div>

      <div className="content-layout">
        <aside className="filters-sidebar">
          <div className="filter-header">
            <h3><Filter size={18} /> Filters</h3>
            <button className="btn-clear">Clear all</button>
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            <label className="checkbox-label"><input type="checkbox" /> Merit-based</label>
            <label className="checkbox-label"><input type="checkbox" /> Need-based</label>
            <label className="checkbox-label"><input type="checkbox" /> Research</label>
          </div>

          <div className="filter-group">
            <h4>Amount</h4>
            <label className="checkbox-label"><input type="checkbox" /> &lt; ₹50k</label>
            <label className="checkbox-label"><input type="checkbox" /> ₹50k - ₹1L</label>
            <label className="checkbox-label"><input type="checkbox" /> &gt; ₹1L</label>
          </div>
        </aside>

        <main className="listings-container">
          <div className="listings-grid">
            {scholarships.map((scholarship) => (
              <motion.div 
                key={scholarship._id} 
                className="listing-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
              >
                <div className="listing-header">
                  <div className="listing-role-info">
                    <h3>{scholarship.title}</h3>
                    <p className="company-name">By {scholarship.provider}</p>
                  </div>
                  <div className="company-logo-small" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <GraduationCap size={20} />
                  </div>
                </div>

                <div className="listing-details">
                  <div className="detail-pill">
                    <DollarSign size={14} /> {scholarship.amount}
                  </div>
                  <div className="detail-pill">
                    <CheckCircle size={14} /> {scholarship.eligibility}
                  </div>
                </div>

                <div className="listing-tags">
                  {scholarship.tags.map((tag, index) => (
                    <span key={index} className="listing-tag">{tag}</span>
                  ))}
                </div>

                <div className="listing-footer">
                  <span className="deadline-text">Deadline: {scholarship.deadline}</span>
                  <button className="btn-view-details">Apply Now</button>
                </div>
              </motion.div>
            ))}

            {scholarships.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No scholarships found. Check back later!
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Scholarships;
