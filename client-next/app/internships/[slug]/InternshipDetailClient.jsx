"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Calendar, Clock, DollarSign, Share2, Bookmark, 
  ChevronLeft, Building2, Globe, Mail, Phone, CheckCircle2,
  AlertCircle, Star, HelpCircle, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareModal from '@/components/ShareModal';

export default function InternshipDetailClient({ internship }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('details');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('internships-theme') || 'dark';
    }
    return 'dark';
  });

  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('internships-theme', newTheme);
  };

  const tabs = [
    { id: 'details', label: 'Job Details', icon: Building2 },
    { id: 'dates', label: 'Dates & Deadlines', icon: Calendar },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'faqs', label: 'FAQs & Discussions', icon: HelpCircle },
  ];

  const reviews = [
    { id: 1, user: 'Rahul K.', rating: 5, comment: 'Great learning experience! Mentors were very helpful.', date: '2 days ago', avatar: 'R' },
    { id: 2, user: 'Priya S.', rating: 4, comment: 'Good project exposure, but work hours were a bit long.', date: '1 week ago', avatar: 'P' },
    { id: 3, user: 'Amit M.', rating: 5, comment: 'Best internship for freshers. Learned a lot about React.', date: '2 weeks ago', avatar: 'A' }
  ];

  const faqs = [
    { q: 'Is this a paid internship?', a: internship.stipend && internship.stipend !== 'Unpaid' ? `Yes, the stipend is ${internship.stipend}.` : 'No, this is an unpaid learning opportunity.' },
    { q: 'Will I get a certificate?', a: 'Yes, you will receive a certificate of completion and a letter of recommendation based on performance.' },
    { q: 'What is the selection process?', a: 'The process involves a resume screening followed by a technical interview and a final HR round.' },
    { q: 'Can I work flexible hours?', a: 'Yes, we offer flexible working hours to accommodate your academic schedule.' }
  ];

  return (
    <div className={`internship-details-page ${theme}-theme`}>
      {/* Header Section */}
      <header className="details-header">
        <div className="container">
          <div className="header-top-row">
            <button className="back-btn" onClick={() => router.back()}>
              <ChevronLeft size={20} />
              Back to Internships
            </button>
            
            <button 
              className="theme-toggle-btn"
              onClick={handleThemeChange}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          <div className="header-content">
            <div className="header-main">
              <div className="company-logo-large">
                <img 
                  src={internship.logo || 'https://via.placeholder.com/50'} 
                  alt={internship.company} 
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(internship.company) + '&background=random';
                  }}
                />
              </div>
              <div className="header-info">
                <h1>{internship.role}</h1>
                <div className="company-meta">
                  <span className="company-name">
                    <Building2 size={16} />
                    {internship.company}
                  </span>
                  <span className="location-badge">
                    <MapPin size={16} />
                    {internship.location}
                  </span>
                  <span className="updated-badge">
                    <Clock size={14} />
                    Posted {new Date(internship.postedAt || internship.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="header-actions">
              {internship.companyWebsite && (
                <a 
                  href={internship.companyWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn website"
                  title="Visit Website"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                >
                  <Globe size={20} />
                </a>
              )}
              <button 
                className="action-btn share"
                onClick={() => setShareModalOpen(true)}
                title="Share"
              >
                <Share2 size={20} />
              </button>
              <button 
                className={`action-btn save ${isSaved ? 'active' : ''}`}
                onClick={() => setIsSaved(!isSaved)}
                title="Save"
              >
                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
              </button>
              <a 
                href={internship.applyLink || internship.companyWebsite || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="apply-btn-large"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="details-nav">
        <div className="container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  className="active-indicator"
                  layoutId="activeTab"
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="details-content">
        <div className="container grid-layout">
          {/* Left Column - Dynamic Content */}
          <div className="left-column">
            <div className="content-card">
              
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="section-header">
                      <h3>Job Details</h3>
                    </div>
                    
                    {internship.responsibilities && internship.responsibilities.length > 0 && (
                      <div className="info-section">
                        <h4>Responsibilities</h4>
                        <ul className="bullet-list">
                          {internship.responsibilities.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {internship.skills && internship.skills.length > 0 && (
                      <div className="info-section">
                        <h4>Required Skills</h4>
                        <div className="skills-cloud">
                          {internship.skills.map((skill, i) => (
                            <span key={i} className="skill-tag required">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {internship.optionalSkills && internship.optionalSkills.length > 0 && (
                      <div className="info-section">
                        <h4>Optional Skills</h4>
                        <div className="skills-cloud">
                          {internship.optionalSkills.map((skill, i) => (
                            <span key={i} className="skill-tag optional">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {internship.learning && internship.learning.length > 0 && (
                      <div className="info-section">
                        <h4>What You Will Learn</h4>
                        <ul className="check-list">
                          {internship.learning.map((item, i) => (
                            <li key={i}>
                              <CheckCircle2 size={18} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'dates' && (
                  <motion.div 
                    key="dates"
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="section-header">
                      <h3>Important Dates</h3>
                    </div>
                    <div className="timeline">
                      <div className="timeline-item">
                        <div className="timeline-icon"><Calendar size={18} /></div>
                        <div className="timeline-content">
                          <h5>Application Start</h5>
                          <p>{new Date(internship.postedAt || internship.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="timeline-item active">
                        <div className="timeline-icon"><Clock size={18} /></div>
                        <div className="timeline-content">
                          <h5>Application Deadline</h5>
                          <p>{new Date(internship.deadline || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="timeline-item">
                        <div className="timeline-icon"><CheckCircle2 size={18} /></div>
                        <div className="timeline-content">
                          <h5>Interview Start</h5>
                          <p>Rolling Basis</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div 
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="section-header">
                      <h3>Reviews ({reviews.length})</h3>
                    </div>
                    <div className="reviews-list">
                      {reviews.map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-avatar">{review.avatar}</div>
                          <div className="review-content">
                            <div className="review-top">
                              <h5>{review.user}</h5>
                              <span className="review-date">{review.date}</span>
                            </div>
                            <div className="review-rating">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "var(--warning)" : "none"} color={i < review.rating ? "var(--warning)" : "var(--page-border)"} />
                              ))}
                            </div>
                            <p>{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'faqs' && (
                  <motion.div 
                    key="faqs"
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="section-header">
                      <h3>Frequently Asked Questions</h3>
                    </div>
                    <div className="faqs-list">
                      {faqs.map((faq, i) => (
                        <div key={i} className="faq-item">
                          <div className="faq-question">
                            <HelpCircle size={18} />
                            <h5>{faq.q}</h5>
                          </div>
                          <p className="faq-answer">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            <div className="disclaimer-card">
              <AlertCircle size={20} />
              <p>
                If an employer asks you to pay any kind of fee, please notify us immediately. 
                StartupEducation does not charge any fee from the applicants and we do not allow other companies also to do so.
              </p>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="right-column">
            <div className="sidebar-card deadline-card">
              <div className="deadline-header">
                <Clock size={20} />
                <span>Application Deadline</span>
              </div>
              <div className="deadline-date">
                {new Date(internship.deadline || Date.now()).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: '2-digit'
                })}
              </div>
              <div className="days-left">
                <span className="number">
                  {Math.max(0, Math.ceil((new Date(internship.deadline || Date.now()) - new Date()) / (1000 * 60 * 60 * 24)))}
                </span>
                <span className="text">days left</span>
              </div>
            </div>

            {internship.organizer && internship.organizer.name && (
              <div className="sidebar-card contact-card">
                <h4>Contact the organisers</h4>
                <div className="organizer-profile">
                  <div className="avatar">
                    {internship.organizer.name.charAt(0)}
                  </div>
                  <div className="org-details">
                    <h5>{internship.organizer.name}</h5>
                    {internship.organizer.email && (
                      <a href={`mailto:${internship.organizer.email}`} className="contact-link">
                        <Mail size={14} /> {internship.organizer.email}
                      </a>
                    )}
                    {internship.organizer.phone && (
                      <a href={`tel:${internship.organizer.phone}`} className="contact-link">
                        <Phone size={14} /> {internship.organizer.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="sidebar-card info-grid-card">
              <h4>Additional Information</h4>
              
              <div className="info-grid-item">
                <div className="icon-box location">
                  <MapPin size={18} />
                </div>
                <div className="info-text">
                  <label>Location</label>
                  <p>{internship.location}</p>
                </div>
              </div>

              <div className="info-grid-item">
                <div className="icon-box duration">
                  <Clock size={18} />
                </div>
                <div className="info-text">
                  <label>Duration</label>
                  <p>{internship.duration}</p>
                </div>
              </div>

              <div className="info-grid-item">
                <div className="icon-box type">
                  <DollarSign size={18} />
                </div>
                <div className="info-text">
                  <label>Stipend</label>
                  <p>{internship.stipend || 'Unpaid'}</p>
                </div>
              </div>
            </div>

            <div className="sidebar-card work-detail-card">
              <h4>Work Detail</h4>
              <div className="detail-row">
                <span className="label">Working Days</span>
                <span className="value">{internship.workingDays || '5 Days/Week'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Schedule</span>
                <span className="value">Flexible Work Hours</span>
              </div>
              <div className="detail-row">
                <span className="label">Timing</span>
                <span className="value">{internship.workType || 'Full Time'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ShareModal
        item={internship}
        type="internship"
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <style>{`
        /* Theme Variables */
        .internship-details-page.dark-theme {
          --page-bg: #0f172a;
          --page-surface: #1e293b;
          --page-text-main: #f8fafc;
          --page-text-muted: #94a3b8;
          --page-border: #334155;
          --primary: #6366f1;
          --primary-glow: rgba(99, 102, 241, 0.15);
          --warning: #fbbf24;
          --danger: #ef4444;
          --success: #10b981;
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .internship-details-page.light-theme {
          --page-bg: #f8fafc;
          --page-surface: #ffffff;
          --page-text-main: #0f172a;
          --page-text-muted: #64748b;
          --page-border: #e2e8f0;
          --primary: #4f46e5;
          --primary-glow: rgba(79, 70, 229, 0.1);
          --warning: #f59e0b;
          --danger: #dc2626;
          --success: #059669;
          --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }

        .internship-details-page {
          min-height: 100vh;
          background: var(--page-bg);
          color: var(--page-text-main);
          padding-top: 70px;
          font-family: 'Inter', sans-serif;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Header */
        .details-header {
          background: var(--page-surface);
          border-bottom: 1px solid var(--page-border);
          padding: 2rem 0;
          position: relative;
          overflow: hidden;
        }

        .details-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), #8b5cf6);
        }

        .header-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--page-text-muted);
          cursor: pointer;
          font-weight: 500;
          padding: 0.5rem 0;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: var(--primary);
        }

        .theme-toggle-btn {
          background: var(--page-bg);
          border: 1px solid var(--page-border);
          color: var(--page-text-main);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-toggle-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .header-main {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .company-logo-large {
          width: 88px;
          height: 88px;
          background: white;
          border-radius: 20px;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--card-shadow);
          border: 1px solid var(--page-border);
        }

        .company-logo-large img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .header-info h1 {
          font-size: 2rem;
          font-weight: 800;
          margin: 0 0 0.75rem 0;
          color: var(--page-text-main);
          letter-spacing: -0.02em;
        }

        .company-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .company-name, .location-badge, .updated-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          color: var(--page-text-muted);
          font-weight: 500;
        }

        .location-badge {
          background: var(--primary-glow);
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 1px solid var(--page-border);
          background: var(--page-bg);
          color: var(--page-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-glow);
          transform: translateY(-2px);
        }

        .action-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .apply-btn-large {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0 2.5rem;
          height: 48px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .apply-btn-large:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
          box-shadow: 0 6px 16px var(--primary-glow);
        }

        /* Nav Tabs */
        .details-nav {
          background: var(--page-surface);
          border-bottom: 1px solid var(--page-border);
          position: sticky;
          top: 0px; /* modified since navbar is handled in app layout */
          z-index: 10;
          backdrop-filter: blur(10px);
          background: rgba(var(--page-surface), 0.95);
        }

        .details-nav .container {
          display: flex;
          gap: 2.5rem;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 1.25rem 0;
          background: none;
          border: none;
          color: var(--page-text-muted);
          font-weight: 500;
          cursor: pointer;
          position: relative;
          transition: color 0.2s ease;
          font-size: 0.9375rem;
        }

        .nav-tab:hover {
          color: var(--page-text-main);
        }

        .nav-tab.active {
          color: var(--primary);
          font-weight: 600;
        }

        .active-indicator {
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--primary);
          border-radius: 3px 3px 0 0;
        }

        /* Main Content Area */
        .details-content {
          padding: 3rem 0;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .content-card {
          background: var(--page-surface);
          border-radius: 20px;
          border: 1px solid var(--page-border);
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: var(--card-shadow);
        }

        .section-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--page-border);
        }

        .section-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--page-text-main);
        }

        /* Info Sections */
        .info-section {
          margin-bottom: 2.5rem;
        }

        .info-section h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--page-text-main);
        }

        .bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .bullet-list li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.6;
          color: var(--page-text-muted);
        }

        .bullet-list li::before {
          content: '•';
          color: var(--primary);
          position: absolute;
          left: 0;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .check-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .check-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1rem;
          line-height: 1.6;
          color: var(--page-text-muted);
        }

        .check-list li svg {
          color: var(--success);
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        /* Skills */
        .skills-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .skill-tag {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .skill-tag.required {
          background: var(--primary-glow);
          color: var(--primary);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .skill-tag.optional {
          background: var(--page-bg);
          color: var(--page-text-muted);
          border: 1px solid var(--page-border);
        }

        /* Sidebar */
        .sidebar-card {
          background: var(--page-surface);
          border-radius: 20px;
          border: 1px solid var(--page-border);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--card-shadow);
        }

        .sidebar-card h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: var(--page-text-main);
        }

        /* Deadline Card */
        .deadline-card {
          background: linear-gradient(135deg, var(--page-surface), rgba(99, 102, 241, 0.05));
          border: 1px solid var(--primary-glow);
        }

        .deadline-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--warning);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .deadline-date {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--page-text-main);
          margin-bottom: 0.5rem;
        }

        .days-left {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--page-bg);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--page-border);
        }

        .days-left .number {
          color: var(--danger);
          font-weight: 700;
          font-size: 1.125rem;
        }

        .days-left .text {
          color: var(--page-text-muted);
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Info Grid Card */
        .info-grid-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .info-grid-item:last-child {
          margin-bottom: 0;
        }

        .icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-box.location { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .icon-box.duration { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .icon-box.type { background: rgba(99, 102, 241, 0.1); color: #6366f1; }

        .info-text label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--page-text-muted);
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        .info-text p {
          color: var(--page-text-main);
          font-weight: 500;
          font-size: 0.9375rem;
        }

        /* Work Detail Card */
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px dashed var(--page-border);
        }

        .detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .detail-row .label {
          color: var(--page-text-muted);
        }

        .detail-row .value {
          color: var(--page-text-main);
          font-weight: 500;
        }

        /* Contact Card */
        .organizer-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar {
          width: 48px;
          height: 48px;
          background: var(--primary-glow);
          color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .org-details h5 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
          color: var(--page-text-main);
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--page-text-muted);
          font-size: 0.875rem;
          text-decoration: none;
          margin-top: 0.25rem;
          transition: color 0.2s;
        }

        .contact-link:hover {
          color: var(--primary);
        }

        /* Disclaimer */
        .disclaimer-card {
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          color: var(--danger);
        }

        .disclaimer-card p {
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .grid-layout {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .header-actions {
            width: 100%;
          }
          
          .apply-btn-large {
            flex: 1;
          }
        }

        @media (max-width: 640px) {
          .details-nav .container {
            overflow-x: auto;
            padding-bottom: 1px;
          }
          
          .nav-tab {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
}
