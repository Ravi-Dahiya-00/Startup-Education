import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const FeaturedOpportunities = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const opportunities = [
    {
      id: 1,
      title: 'Software Engineer Intern',
      company: 'Google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png',
      type: 'Internship',
      location: 'Bangalore (Hybrid)',
      stipend: '₹80,000/mo',
      deadline: '5 days left',
      tags: ['Engineering', 'CSE'],
      color: '#4285F4'
    },
    {
      id: 2,
      title: 'Product Design Challenge',
      company: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png',
      type: 'Competition',
      location: 'Online',
      stipend: 'Prizes worth ₹5 Lakhs',
      deadline: '12 days left',
      tags: ['Design', 'UI/UX'],
      color: '#F25022'
    },
    {
      id: 3,
      title: 'Data Science Associate',
      company: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
      type: 'Job',
      location: 'Hyderabad',
      stipend: '₹18 LPA',
      deadline: '2 days left',
      tags: ['Data Science', 'Analytics'],
      color: '#FF9900'
    },
    {
      id: 4,
      title: 'Marketing Trainee',
      company: 'Spotify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png',
      type: 'Internship',
      location: 'Mumbai',
      stipend: '₹45,000/mo',
      deadline: '1 week left',
      tags: ['Marketing', 'MBA'],
      color: '#1DB954'
    },
    {
      id: 5,
      title: 'Global Hackathon 2024',
      company: 'Intel',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Intel_logo.svg/1024px-Intel_logo.svg.png',
      type: 'Hackathon',
      location: 'Online',
      stipend: '$10,000 Prize Pool',
      deadline: '15 days left',
      tags: ['Coding', 'Innovation'],
      color: '#0071C5'
    }
  ];

  return (
    <section className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">Featured Opportunities</h2>
          <p className="section-subtitle">Curated top-tier internships, jobs, and challenges for you.</p>
        </div>
        <div className="carousel-actions">
          <button onClick={() => scroll('left')} className="nav-btn">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="nav-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="carousel-container" ref={scrollContainerRef}>
        {opportunities.map((opp) => (
          <motion.div 
            key={opp.id} 
            className="opportunity-card"
            whileHover={{ y: -5 }}
          >
            <div className="card-header">
              <div className="company-logo-wrapper">
                <img src={opp.logo} alt={opp.company} className="company-logo" />
              </div>
              <span className={`opp-type type-${opp.type.toLowerCase()}`}>{opp.type}</span>
            </div>
            
            <h3 className="opp-title">{opp.title}</h3>
            <p className="opp-company">{opp.company}</p>
            
            <div className="opp-details">
              <div className="detail-item">
                <MapPin size={14} />
                <span>{opp.location}</span>
              </div>
              <div className="detail-item">
                <DollarSign size={14} />
                <span>{opp.stipend}</span>
              </div>
              <div className="detail-item">
                <Clock size={14} />
                <span>{opp.deadline}</span>
              </div>
            </div>

            <div className="card-footer">
              <div className="tags">
                {opp.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <button className="btn-apply">Apply</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedOpportunities;
