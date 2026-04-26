"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Calendar, Users, Building2, Globe, ExternalLink,
  Heart, Briefcase, Star, Code, BookOpen, ChevronRight, Loader2,
  Github, Linkedin, Twitter, Facebook, Instagram, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import './CompanyProfileModal.css';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

const CompanyProfileModal = ({ domain, companyName, isOpen, onClose }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [opportunities, setOpportunities] = useState({ jobs: [], internships: [] });
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    if (isOpen && domain) {
      fetchCompanyProfile();
    }
  }, [isOpen, domain]);

  const fetchCompanyProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      
      // Fetch company profile
      const profileRes = await fetch(`${API_BASE}/company/${cleanDomain}${companyName ? `?name=${encodeURIComponent(companyName)}` : ''}`);
      const profileData = await profileRes.json();
      
      if (profileData.success) {
        setCompany(profileData.company);
        
        // Fetch opportunities
        const oppsRes = await fetch(`${API_BASE}/company/${cleanDomain}/opportunities`);
        const oppsData = await oppsRes.json();
        
        if (oppsData.success) {
          setOpportunities({
            jobs: oppsData.jobs || [],
            internships: oppsData.internships || []
          });
        }
      } else {
        setError('Failed to fetch company information');
      }
    } catch (err) {
      console.error('Error fetching company:', err);
      setError('Unable to load company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    // For now, just toggle UI state
    // In production, call API with user ID
    setIsFollowing(!isFollowing);
  };

  const handleViewAllJobs = () => {
    onClose();
    router.push(`/jobs?company=${encodeURIComponent(company?.name || domain)}`);
  };

  const handleViewAllInternships = () => {
    onClose();
    router.push(`/internships?company=${encodeURIComponent(company?.name || domain)}`);
  };

  if (!isOpen) return null;

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'github': return Github;
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      default: return Globe;
    }
  };

  const formatCompanySize = (size) => {
    if (!size || size === 'Unknown') return null;
    return `${size} employees`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="company-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="company-modal"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button className="company-modal-close" onClick={onClose}>
            <X size={20} />
          </button>

          {loading ? (
            <div className="company-loading">
              <Loader2 size={40} className="spin" />
              <p>Fetching company information...</p>
            </div>
          ) : error ? (
            <div className="company-error">
              <AlertCircle size={40} />
              <p>{error}</p>
              <button onClick={fetchCompanyProfile}>Try Again</button>
            </div>
          ) : company ? (
            <>
              {/* Header */}
              <div className="company-header">
                <div className="company-logo-large">
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="logo-fallback-large">
                    <Building2 size={40} />
                  </div>
                </div>
                
                <div className="company-header-info">
                  <div className="company-name-row">
                    <h2>{company.name}</h2>
                    {company.isVerified && (
                      <span className="verified-badge" title="Verified Company">✓</span>
                    )}
                  </div>
                  
                  <div className="company-meta-row">
                    {company.industry?.length > 0 && (
                      <span className="meta-tag industry">{company.industry[0]}</span>
                    )}
                    {company.headquarters && (
                      <span className="meta-item-mini">
                        <MapPin size={14} />
                        {company.headquarters}
                      </span>
                    )}
                    {company.foundedYear && (
                      <span className="meta-item-mini">
                        <Calendar size={14} />
                        Founded {company.foundedYear}
                      </span>
                    )}
                  </div>
                  
                  <div className="company-actions">
                    <button 
                      className={`follow-btn ${isFollowing ? 'following' : ''}`}
                      onClick={handleFollow}
                    >
                      <Heart size={16} fill={isFollowing ? 'currentColor' : 'none'} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    
                    {company.website && (
                      <a 
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="website-btn"
                      >
                        <Globe size={16} />
                        Visit Website
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="company-tabs">
                <button 
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`tab ${activeTab === 'opportunities' ? 'active' : ''}`}
                  onClick={() => setActiveTab('opportunities')}
                >
                  Opportunities ({opportunities.jobs.length + opportunities.internships.length})
                </button>
                {company.githubData?.publicRepos > 0 && (
                  <button 
                    className={`tab ${activeTab === 'tech' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tech')}
                  >
                    Tech Stack
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="company-content">
                {activeTab === 'overview' && (
                  <div className="overview-tab">
                    {/* Description */}
                    {company.description && (
                      <div className="section">
                        <h3>About</h3>
                        <p className="description">{company.description}</p>
                      </div>
                    )}

                    {/* Key Stats */}
                    <div className="stats-grid">
                      <div className="stat-card">
                        <Briefcase size={24} className="stat-icon" />
                        <div className="stat-info">
                          <span className="stat-value">{company.metrics?.openPositions || 0}</span>
                          <span className="stat-label">Open Positions</span>
                        </div>
                      </div>
                      
                      {formatCompanySize(company.companySize) && (
                        <div className="stat-card">
                          <Users size={24} className="stat-icon" />
                          <div className="stat-info">
                            <span className="stat-value">{company.companySize}</span>
                            <span className="stat-label">Employees</span>
                          </div>
                        </div>
                      )}
                      
                      {company.githubData?.totalStars > 0 && (
                        <div className="stat-card">
                          <Star size={24} className="stat-icon" />
                          <div className="stat-info">
                            <span className="stat-value">{company.githubData.totalStars.toLocaleString()}</span>
                            <span className="stat-label">GitHub Stars</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="stat-card">
                        <Heart size={24} className="stat-icon" />
                        <div className="stat-info">
                          <span className="stat-value">{company.followersCount || 0}</span>
                          <span className="stat-label">Followers</span>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    {Object.entries(company.socials || {}).some(([_, v]) => v) && (
                      <div className="section">
                        <h3>Connect</h3>
                        <div className="social-links">
                          {Object.entries(company.socials).map(([platform, url]) => {
                            if (!url) return null;
                            const Icon = getSocialIcon(platform);
                            return (
                              <a 
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`social-link ${platform}`}
                              >
                                <Icon size={20} />
                                <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Data Sources */}
                    {company.dataSources?.length > 0 && (
                      <div className="data-sources">
                        Data from: {company.dataSources.map(s => s.source).join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'opportunities' && (
                  <div className="opportunities-tab">
                    {/* Jobs */}
                    {opportunities.jobs.length > 0 && (
                      <div className="section">
                        <div className="section-header">
                          <h3><Briefcase size={18} /> Jobs ({opportunities.jobs.length})</h3>
                          <button onClick={handleViewAllJobs} className="view-all-btn">
                            View All <ChevronRight size={16} />
                          </button>
                        </div>
                        <div className="mini-cards">
                          {opportunities.jobs.slice(0, 3).map(job => (
                            <div key={job._id} className="mini-card">
                              <h4>{job.role}</h4>
                              <div className="mini-meta">
                                <span>{job.location}</span>
                                <span>{job.workType}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Internships */}
                    {opportunities.internships.length > 0 && (
                      <div className="section">
                        <div className="section-header">
                          <h3><BookOpen size={18} /> Internships ({opportunities.internships.length})</h3>
                          <button onClick={handleViewAllInternships} className="view-all-btn">
                            View All <ChevronRight size={16} />
                          </button>
                        </div>
                        <div className="mini-cards">
                          {opportunities.internships.slice(0, 3).map(intern => (
                            <div key={intern._id} className="mini-card">
                              <h4>{intern.role}</h4>
                              <div className="mini-meta">
                                <span>{intern.location}</span>
                                <span>{intern.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {opportunities.jobs.length === 0 && opportunities.internships.length === 0 && (
                      <div className="empty-state">
                        <Briefcase size={40} />
                        <p>No open opportunities at the moment</p>
                        <button onClick={handleFollow} className="follow-btn-alt">
                          Follow for updates
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'tech' && (
                  <div className="tech-tab">
                    {/* Tech Stack */}
                    {company.techStack?.length > 0 && (
                      <div className="section">
                        <h3>Technologies Used</h3>
                        <div className="tech-tags">
                          {company.techStack.map(tech => (
                            <span key={tech} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* GitHub Stats */}
                    {company.githubData?.publicRepos > 0 && (
                      <div className="section">
                        <h3><Github size={18} /> GitHub Activity</h3>
                        <div className="github-stats">
                          <div className="github-stat">
                            <Code size={20} />
                            <span>{company.githubData.publicRepos}</span>
                            <small>Public Repos</small>
                          </div>
                          <div className="github-stat">
                            <Star size={20} />
                            <span>{company.githubData.totalStars?.toLocaleString()}</span>
                            <small>Total Stars</small>
                          </div>
                          <div className="github-stat">
                            <Users size={20} />
                            <span>{company.githubData.followers}</span>
                            <small>Followers</small>
                          </div>
                        </div>
                        
                        {company.githubData.topLanguages?.length > 0 && (
                          <div className="top-languages">
                            <h4>Top Languages</h4>
                            <div className="language-bars">
                              {company.githubData.topLanguages.slice(0, 5).map((lang, idx) => (
                                <div key={lang} className="language-bar" style={{ '--index': idx }}>
                                  <span className="lang-name">{lang}</span>
                                  <div className="bar-fill" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {company.socials?.github && (
                          <a 
                            href={company.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="github-link"
                          >
                            <Github size={16} />
                            View GitHub Organization
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompanyProfileModal;
