import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, Trophy, Clock, DollarSign, 
  Share2, Bookmark, ChevronLeft, Globe, Award, CheckCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareModal from '../../components/ShareModal';

const CompetitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [competition, setCompetition] = useState(location.state?.competition || null);
  const [loading, setLoading] = useState(!competition);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [theme] = useState(() => localStorage.getItem('competitions-theme') || 'dark');

  // Mock data fetch if not passed via state
  useEffect(() => {
    if (!competition) {
      // Simulate API call
      setTimeout(() => {
        setCompetition({
          _id: id,
          title: 'Global Innovation Hackathon 2025',
          organizer: 'Tech Giants Alliance',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png',
          description: `Join the world's most prestigious hackathon and solve real-world challenges. 
          
          This 48-hour event brings together the brightest minds in technology to innovate, collaborate, and build solutions that matter. Whether you're a coder, designer, or business strategist, there's a place for you here.`,
          rules: [
            'Teams must consist of 2-4 members.',
            'All code must be written during the event.',
            'Use of open-source libraries is allowed.',
            'Final submission must include a video demo.'
          ],
          prizes: [
            { rank: '1st Place', reward: '₹1,00,000 + Internship Opportunity' },
            { rank: '2nd Place', reward: '₹50,000 + Swag Kit' },
            { rank: '3rd Place', reward: '₹25,000 + Certificates' }
          ],
          deadline: new Date('2025-04-15').toISOString(),
          startDate: new Date('2025-04-20').toISOString(),
          mode: 'Online',
          category: 'Hackathon',
          entryFee: 'Free',
          teamSize: '2-4 Members',
          registeredCount: 1250,
          tags: ['Innovation', 'AI/ML', 'Web3', 'Sustainability']
        });
        setLoading(false);
      }, 1000);
    }
  }, [id, competition]);

  if (loading) {
    return (
      <div className={`details-loading ${theme}-theme`}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!competition) return null;

  return (
    <div className={`competition-details-page ${theme}-theme`}>
      <div className="details-container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/competitions')}>
          <ChevronLeft size={20} />
          Back to Competitions
        </button>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="organizer-badge">
              <img src={competition.logo} alt={competition.organizer} />
              <span>{competition.organizer}</span>
            </div>
            <h1 className="hero-title">{competition.title}</h1>
            
            <div className="hero-meta">
              <div className="meta-pill">
                <Globe size={16} />
                {competition.mode}
              </div>
              <div className="meta-pill">
                <Users size={16} />
                {competition.teamSize}
              </div>
              <div className="meta-pill">
                <DollarSign size={16} />
                {competition.entryFee}
              </div>
              <div className="meta-pill highlight">
                <Clock size={16} />
                Deadline: {new Date(competition.deadline).toLocaleDateString()}
              </div>
            </div>

            <div className="hero-actions">
              <button className="primary-btn" onClick={() => setRegisterModalOpen(true)}>
                Register Now
              </button>
              <button 
                className={`secondary-btn ${isSaved ? 'active' : ''}`}
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button className="secondary-btn" onClick={() => setShareModalOpen(true)}>
                <Share2 size={20} />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="content-grid">
          {/* Main Content */}
          <div className="main-column">
            <section className="content-section">
              <h2>About the Competition</h2>
              <p className="description-text">{competition.description}</p>
              
              <div className="tags-container">
                {competition.tags?.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </section>

            <section className="content-section">
              <h2><Trophy size={24} className="section-icon" /> Prizes & Rewards</h2>
              <div className="prizes-grid">
                {competition.prizes?.map((prize, index) => (
                  <div key={index} className={`prize-card rank-${index + 1}`}>
                    <div className="rank-badge">#{index + 1}</div>
                    <h3>{prize.rank}</h3>
                    <p>{prize.reward}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="content-section">
              <h2><CheckCircle size={24} className="section-icon" /> Rules & Guidelines</h2>
              <ul className="rules-list">
                {competition.rules?.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="sidebar-column">
            <div className="sidebar-card">
              <h3>Event Schedule</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Registration Deadline</h4>
                    <p>{new Date(competition.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot active"></div>
                  <div className="timeline-content">
                    <h4>Event Starts</h4>
                    <p>{new Date(competition.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-card stats">
              <div className="stat-row">
                <span className="label">Registered</span>
                <span className="value">{competition.registeredCount}+</span>
              </div>
              <div className="stat-row">
                <span className="label">Category</span>
                <span className="value">{competition.category}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {registerModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="modal-header">
                <h2>Register for {competition.title}</h2>
                <button className="close-btn" onClick={() => setRegisterModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <form className="register-form" onSubmit={(e) => {
                e.preventDefault();
                alert('Registration Successful!');
                setRegisterModalOpen(false);
              }}>
                <div className="form-group">
                  <label>Team Name</label>
                  <input type="text" placeholder="Enter your team name" required />
                </div>
                <div className="form-group">
                  <label>Team Leader Email</label>
                  <input type="email" placeholder="leader@example.com" required />
                </div>
                <div className="form-group">
                  <label>Number of Members</label>
                  <select>
                    <option>2 Members</option>
                    <option>3 Members</option>
                    <option>4 Members</option>
                  </select>
                </div>
                <button type="submit" className="submit-btn">Confirm Registration</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ShareModal
        item={competition}
        type="competition"
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <style>{`
        .competition-details-page {
          min-height: 100vh;
          padding-top: 80px;
          padding-bottom: 4rem;
          font-family: var(--font-main);
          transition: background-color 0.3s ease;
        }

        /* Theme Variables */
        .dark-theme {
          background: var(--page-bg);
          --page-bg: #0f172a;
          --page-surface: #1e293b;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --border: #334155;
          --primary: #ec4899;
          --primary-hover: #be185d;
        }

        .light-theme {
          background: #f8fafc;
          --page-bg: #f8fafc;
          --page-surface: #ffffff;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --primary: #ec4899;
          --primary-hover: #be185d;
        }

        .details-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--text-muted);
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 2rem;
          padding: 0;
          transition: color 0.2s;
        }

        .back-btn:hover {
          color: var(--primary);
        }

        /* Hero Section */
        .hero-section {
          background: var(--page-surface);
          border-radius: 24px;
          padding: 3rem;
          border: 1px solid var(--border);
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .organizer-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .organizer-badge img {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: white;
          padding: 4px;
        }

        .organizer-badge span {
          color: var(--text-muted);
          font-weight: 500;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 1.5rem 0;
          line-height: 1.2;
        }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .meta-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--page-bg);
          border: 1px solid var(--border);
          border-radius: 50px;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .meta-pill.highlight {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(236, 72, 153, 0.1);
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
        }

        .primary-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .primary-btn:hover {
          background: var(--primary-hover);
        }

        .secondary-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--page-bg);
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .secondary-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }

        .content-section {
          background: var(--page-surface);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--border);
          margin-bottom: 2rem;
        }

        .content-section h2 {
          font-size: 1.5rem;
          color: var(--text-main);
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-icon {
          color: var(--primary);
        }

        .description-text {
          color: var(--text-muted);
          line-height: 1.7;
          white-space: pre-line;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .tag {
          background: var(--page-bg);
          color: var(--primary);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Prizes Grid */
        .prizes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .prize-card {
          background: var(--page-bg);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          text-align: center;
          position: relative;
        }

        .rank-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .prize-card h3 {
          color: var(--text-main);
          margin: 1rem 0 0.5rem 0;
        }

        .prize-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin: 0;
        }

        .rules-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .rules-list li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .rules-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--primary);
          font-weight: bold;
        }

        /* Sidebar */
        .sidebar-card {
          background: var(--page-surface);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }

        .sidebar-card h3 {
          color: var(--text-main);
          margin: 0 0 1.5rem 0;
          font-size: 1.2rem;
        }

        .timeline-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--border);
          margin-top: 6px;
        }

        .timeline-dot.active {
          background: var(--primary);
          box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.2);
        }

        .timeline-content h4 {
          color: var(--text-main);
          margin: 0 0 0.25rem 0;
          font-size: 0.95rem;
        }

        .timeline-content p {
          color: var(--text-muted);
          margin: 0;
          font-size: 0.85rem;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }

        .stat-row:last-child {
          border-bottom: none;
        }

        .stat-row .label {
          color: var(--text-muted);
        }

        .stat-row .value {
          color: var(--text-main);
          font-weight: 600;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: var(--page-surface);
          width: 100%;
          max-width: 500px;
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid var(--border);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .modal-header h2 {
          color: var(--text-main);
          margin: 0;
          font-size: 1.5rem;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: var(--text-main);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          background: var(--page-bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-main);
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary);
        }

        .submit-btn {
          width: 100%;
          background: var(--primary);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background: var(--primary-hover);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 1.5rem;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .hero-actions {
            flex-direction: column;
          }

          .primary-btn, .secondary-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CompetitionDetails;
