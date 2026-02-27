import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, Calendar, Clock, DollarSign, Share2, Bookmark, 
  ChevronLeft, Building2, Globe, Mail, Phone, CheckCircle2,
  AlertCircle, Users, Star, MessageSquare, HelpCircle, ChevronDown, ChevronUp,
  Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareModal from '../../components/ShareModal';
import API_URL from '../../config/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('details');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('jobs-theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('jobs-theme', theme);
  }, [theme]);

  // Default Mock Data (Fallback)
  const mockJob = {
    _id: id,
    role: 'Software Engineer',
    company: 'TechCorp Solutions',
    location: 'Remote',
    workType: 'Full Time',
    experience: '2+ years',
    salary: '₹15,00,000/year',
    postedAt: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    logo: 'https://ui-avatars.com/api/?name=Tech+Corp&background=random',
    organizer: {
      name: 'HR Manager',
      email: 'careers@techcorp.com',
      phone: '+91 98765 43210'
    },
    responsibilities: [
      'Design and build advanced applications for the web platform',
      'Collaborate with cross-functional teams to define, design, and ship new features',
      'Unit-test code for robustness, including edge cases, usability, and general reliability',
      'Work on bug fixing and improving application performance'
    ],
    skills: [
      'JavaScript', 'React', 'Node.js', 'System Design', 'Database Management'
    ],
    optionalSkills: ['TypeScript', 'AWS', 'Docker', 'Kubernetes'],
    perks: [
      'Health Insurance',
      'Remote Work Options',
      'Professional Development Budget',
      'Team Retreats'
    ],
    workDetails: {
      days: '5 Days',
      schedule: 'Flexible Work Hours',
      timing: 'Full Time'
    }
  };

  // Initialize data from state or fallback
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (location.state?.job) {
        setJob({
          ...mockJob,
          ...location.state.job,
          responsibilities: location.state.job.responsibilities?.length > 0 ? location.state.job.responsibilities : mockJob.responsibilities,
          skills: location.state.job.skills?.length > 0 ? location.state.job.skills : (location.state.job.tags || mockJob.skills),
          perks: location.state.job.perks?.length > 0 ? location.state.job.perks : mockJob.perks,
          organizer: location.state.job.organizer || mockJob.organizer,
          workDetails: {
            days: location.state.job.workingDays || mockJob.workDetails.days,
            schedule: 'Flexible Work Hours',
            timing: location.state.job.workType || mockJob.workDetails.timing
          }
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/jobs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setJob({
            ...mockJob,
            ...data,
            responsibilities: data.responsibilities?.length > 0 ? data.responsibilities : mockJob.responsibilities,
            skills: data.skills?.length > 0 ? data.skills : (data.tags || mockJob.skills),
            perks: data.perks?.length > 0 ? data.perks : mockJob.perks,
            organizer: data.organizer || mockJob.organizer,
            workDetails: {
              days: data.workingDays || mockJob.workDetails.days,
              schedule: 'Flexible Work Hours',
              timing: data.workType || mockJob.workDetails.timing
            }
          });
        } else {
          console.error('Failed to fetch job');
          setJob(mockJob);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        setJob(mockJob);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, location.state]);

  if (loading) {
    return (
      <div className={`job-details-page ${theme}-theme`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid rgba(99, 102, 241, 0.1)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!job) return null;

  const tabs = [
    { id: 'details', label: 'Job Details', icon: Building2 },
    { id: 'dates', label: 'Dates & Deadlines', icon: Calendar },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'faqs', label: 'FAQs & Discussions', icon: HelpCircle },
  ];

  const reviews = [
    { id: 1, user: 'Rahul K.', rating: 5, comment: 'Great work culture! Mentors were very helpful.', date: '2 days ago', avatar: 'R' },
    { id: 2, user: 'Priya S.', rating: 4, comment: 'Good project exposure, but work hours were a bit long.', date: '1 week ago', avatar: 'P' },
    { id: 3, user: 'Amit M.', rating: 5, comment: 'Best place for growth. Learned a lot about scalable systems.', date: '2 weeks ago', avatar: 'A' }
  ];

  const faqs = [
    { q: 'Is this a remote role?', a: job.location.toLowerCase().includes('remote') ? 'Yes, this is a remote position.' : 'No, this is an on-site role.' },
    { q: 'What is the interview process?', a: 'The process involves a resume screening followed by a technical interview, system design round, and a final HR round.' },
    { q: 'Are there any benefits?', a: 'Yes, we offer health insurance, paid time off, and professional development opportunities.' },
    { q: 'Can I work flexible hours?', a: 'Yes, we offer flexible working hours to accommodate your schedule.' }
  ];

  return (
    <div className={`job-details-page ${theme}-theme`}>
      {/* Header Section */}
      <header className="details-header">
        <div className="container">
          <div className="header-top-row">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
              Back to Jobs
            </button>
            
            <button 
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          <div className="header-content">
            <div className="header-main">
              <div className="company-logo-large">
                <img 
                  src={job.logo || mockJob.logo} 
                  alt={job.company} 
                  onError={(e) => {
                    e.target.src = mockJob.logo;
                  }}
                />
              </div>
              <div className="header-info">
                <h1>{job.role}</h1>
                <div className="company-meta">
                  <span className="company-name">
                    <Building2 size={16} />
                    {job.company}
                  </span>
                  <span className="location-badge">
                    <MapPin size={16} />
                    {job.location}
                  </span>
                  <span className="updated-badge">
                    <Clock size={14} />
                    Posted {new Date(job.postedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="header-actions">
              {job.companyWebsite && (
                <a 
                  href={job.companyWebsite} 
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
                href={job.applyUrl || job.companyWebsite || '#'} 
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
                    
                    <div className="info-section">
                      <h4>About the Role</h4>
                      {job.description ? (
                         <div 
                           className="job-description-html"
                           dangerouslySetInnerHTML={{ __html: job.description }}
                           style={{ color: 'var(--page-text-muted)', lineHeight: '1.6', fontSize: '0.9375rem' }}
                         />
                      ) : (
                        <>
                          <h4>Responsibilities</h4>
                          <ul className="bullet-list">
                            {job.responsibilities.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    <div className="info-section">
                      <h4>Required Skills</h4>
                      <div className="skills-cloud">
                        {job.skills.map((skill, i) => (
                          <span key={i} className="skill-tag required">{skill}</span>
                        ))}
                      </div>
                    </div>

                    {job.optionalSkills && (
                      <div className="info-section">
                        <h4>Optional Skills</h4>
                        <div className="skills-cloud">
                          {job.optionalSkills.map((skill, i) => (
                            <span key={i} className="skill-tag optional">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="info-section">
                      <h4>Perks & Benefits</h4>
                      <ul className="check-list">
                        {(job.perks || mockJob.perks).map((item, i) => (
                          <li key={i}>
                            <CheckCircle2 size={18} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
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
                          <p>{new Date(job.postedAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="timeline-item active">
                        <div className="timeline-icon"><Clock size={18} /></div>
                        <div className="timeline-content">
                          <h5>Application Deadline</h5>
                          <p>{new Date(job.deadline || Date.now()).toLocaleDateString()}</p>
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
                StartupEd does not charge any fee from the applicants and we do not allow other companies also to do so.
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
                {new Date(job.deadline || Date.now()).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: '2-digit'
                })}
              </div>
              <div className="days-left">
                <span className="number">
                  {Math.max(0, Math.ceil((new Date(job.deadline || Date.now()) - new Date()) / (1000 * 60 * 60 * 24)))}
                </span>
                <span className="text">days left</span>
              </div>
            </div>

            {(!job.source || job.source === 'Platform') && (
              <div className="sidebar-card contact-card">
                <h4>Contact the organisers</h4>
                <div className="organizer-profile">
                  <div className="avatar">
                    {job.organizer.name.charAt(0)}
                  </div>
                  <div className="org-details">
                    <h5>{job.organizer.name}</h5>
                    <a href={`mailto:${job.organizer.email}`} className="contact-link">
                      <Mail size={14} /> {job.organizer.email}
                    </a>
                    {job.organizer.phone && (
                      <a href={`tel:${job.organizer.phone}`} className="contact-link">
                        <Phone size={14} /> {job.organizer.phone}
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
                  <p>{job.location}</p>
                </div>
              </div>

              <div className="info-grid-item">
                <div className="icon-box duration">
                  <Clock size={18} />
                </div>
                <div className="info-text">
                  <label>Experience</label>
                  <p>{job.experience}</p>
                </div>
              </div>

              <div className="info-grid-item">
                <div className="icon-box type">
                  <DollarSign size={18} />
                </div>
                <div className="info-text">
                  <label>Salary</label>
                  <p>{job.salary}</p>
                </div>
              </div>
            </div>

            <div className="sidebar-card work-detail-card">
              <h4>Work Detail</h4>
              <div className="detail-row">
                <span className="label">Working Days</span>
                <span className="value">{job.workDetails.days}</span>
              </div>
              <div className="detail-row">
                <span className="label">Schedule</span>
                <span className="value">{job.workDetails.schedule}</span>
              </div>
              <div className="detail-row">
                <span className="label">Timing</span>
                <span className="value">{job.workDetails.timing}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ShareModal
        item={job}
        type="job"
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <style>{`
        /* Theme Variables */
        .job-details-page.dark-theme {
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

        .job-details-page.light-theme {
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

        .job-details-page {
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
          top: 70px;
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
          height: 2px;
          background: var(--primary);
          border-radius: 2px 2px 0 0;
        }

        /* Main Content Grid */
        .grid-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2.5rem;
          padding-top: 2.5rem;
          padding-bottom: 4rem;
        }

        .content-card {
          background: var(--page-surface);
          border: 1px solid var(--page-border);
          border-radius: 20px;
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
          margin: 0;
          color: var(--page-text-main);
        }

        .info-section {
          margin-bottom: 2.5rem;
        }

        .info-section h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: var(--page-text-main);
        }

        .bullet-list {
          list-style-type: disc;
          padding-left: 1.5rem;
          color: var(--page-text-muted);
          line-height: 1.7;
          font-size: 1rem;
        }

        .bullet-list li {
          margin-bottom: 0.5rem;
        }

        .check-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .check-list li {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--page-text-muted);
          font-size: 1rem;
        }

        .check-list li svg {
          color: var(--success);
          flex-shrink: 0;
        }

        .skills-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .skill-tag {
          padding: 0.625rem 1.25rem;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .skill-tag.required {
          background: var(--primary-glow);
          color: var(--primary);
          border: 1px solid transparent;
        }
        
        .skill-tag.required:hover {
          border-color: var(--primary);
        }

        .skill-tag.optional {
          background: var(--page-bg);
          color: var(--page-text-muted);
          border: 1px solid var(--page-border);
        }

        .disclaimer-card {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          color: var(--warning);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        /* Sidebar */
        .sidebar-card {
          background: var(--page-surface);
          border: 1px solid var(--page-border);
          border-radius: 20px;
          padding: 1.75rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--card-shadow);
        }

        .deadline-card {
          text-align: center;
          border-top: 4px solid var(--danger);
        }

        .deadline-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: var(--danger);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .deadline-date {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--page-text-main);
        }

        .days-left {
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          display: inline-block;
          padding: 0.5rem 1.25rem;
          border-radius: 12px;
        }

        .days-left .number {
          font-weight: 800;
          font-size: 1.5rem;
          margin-right: 0.25rem;
        }

        .contact-card h4, .info-grid-card h4, .work-detail-card h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 1.25rem 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--page-border);
          color: var(--page-text-main);
        }

        .organizer-profile {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .avatar {
          width: 56px;
          height: 56px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .org-details h5 {
          margin: 0 0 0.25rem 0;
          font-size: 1.125rem;
          color: var(--page-text-main);
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--page-text-muted);
          text-decoration: none;
          font-size: 0.9375rem;
          margin-top: 0.375rem;
        }

        .contact-link:hover {
          color: var(--primary);
        }

        .info-grid-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-grid-item:last-child {
          margin-bottom: 0;
        }

        .icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .icon-box.location { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .icon-box.duration { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .icon-box.type { background: var(--primary-glow); color: var(--primary); }

        .info-text label {
          display: block;
          font-size: 0.8125rem;
          color: var(--page-text-muted);
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .info-text p {
          margin: 0;
          font-weight: 600;
          font-size: 1rem;
          color: var(--page-text-main);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px dashed var(--page-border);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row .label {
          color: var(--page-text-muted);
          font-size: 0.9375rem;
        }

        .detail-row .value {
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--page-text-main);
        }

        /* Timeline Styles */
        .timeline {
          padding-left: 0.5rem;
        }

        .timeline-item {
          display: flex;
          gap: 1.5rem;
          padding-bottom: 2.5rem;
          position: relative;
        }

        .timeline-item:last-child {
          padding-bottom: 0;
        }

        .timeline-item::before {
          content: '';
          position: absolute;
          left: 21px;
          top: 44px;
          bottom: 0;
          width: 2px;
          background: var(--page-border);
        }

        .timeline-item:last-child::before {
          display: none;
        }

        .timeline-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--page-surface);
          border: 2px solid var(--page-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--page-text-muted);
          z-index: 1;
        }

        .timeline-item.active .timeline-icon {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-glow);
        }

        .timeline-content h5 {
          margin: 0 0 0.25rem 0;
          font-size: 1.125rem;
          color: var(--page-text-main);
        }

        .timeline-content p {
          margin: 0;
          color: var(--page-text-muted);
          font-size: 1rem;
        }

        /* Reviews Styles */
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .review-item {
          display: flex;
          gap: 1.25rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--page-border);
        }

        .review-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .review-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), #8b5cf6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
          font-size: 1.125rem;
        }

        .review-content {
          flex: 1;
        }

        .review-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .review-top h5 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--page-text-main);
        }

        .review-date {
          font-size: 0.875rem;
          color: var(--page-text-muted);
        }

        .review-rating {
          display: flex;
          gap: 0.125rem;
          margin-bottom: 0.75rem;
        }

        .review-content p {
          margin: 0;
          font-size: 1rem;
          color: var(--page-text-muted);
          line-height: 1.6;
        }

        /* FAQ Styles */
        .faqs-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .faq-item {
          background: var(--page-bg);
          border: 1px solid var(--page-border);
          border-radius: 16px;
          padding: 1.5rem;
          transition: border-color 0.2s;
        }
        
        .faq-item:hover {
          border-color: var(--primary);
        }

        .faq-question {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          color: var(--page-text-main);
        }

        .faq-question h5 {
          margin: 0;
          font-size: 1.0625rem;
          font-weight: 600;
        }

        .faq-answer {
          margin: 0;
          padding-left: 2rem;
          color: var(--page-text-muted);
          font-size: 1rem;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .grid-layout {
            grid-template-columns: 1fr;
          }
          
          .right-column {
            order: -1;
          }
        }

        @media (max-width: 768px) {
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
          
          .details-nav .container {
            overflow-x: auto;
            padding-bottom: 0.5rem;
            gap: 1.5rem;
          }
          
          .nav-tab {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default JobDetails;
