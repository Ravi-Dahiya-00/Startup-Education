import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../../config/api';
import {
  Star, Clock, Users, Award, PlayCircle, ChevronDown, ChevronUp,
  Check, Globe, BarChart2, Lock, Unlock, BookOpen, FileText,
  ArrowLeft, Share2, Heart, ShoppingCart, Zap
} from 'lucide-react';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_URL}/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Course not found');
        }
        const data = await response.json();
        setCourse(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await fetch(`${API_URL}/api/courses/${id}/enroll`, {
        method: 'POST'
      });
      // Show success message or redirect
      alert('🎉 Successfully enrolled! Happy learning!');
    } catch (err) {
      alert('Failed to enroll. Please try again.');
    }
    setEnrolling(false);
  };

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? -1 : index);
  };

  if (loading) {
    return (
      <div className="course-details-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-details-page">
        <div className="error-state">
          <h2>Course not found</h2>
          <p>The course you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/courses')} className="btn-back-courses">
            <ArrowLeft size={18} />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const totalLessons = course.curriculum?.reduce((acc, section) => acc + section.lessons.length, 0) || 0;

  return (
    <div className="course-details-page">
      {/* Hero Section */}
      <section className="course-hero">
        <div className="hero-bg">
          <img src={course.thumbnail} alt="" />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <button onClick={() => navigate('/courses')} className="btn-back">
            <ArrowLeft size={18} />
            Back to Courses
          </button>

          <div className="hero-grid">
            <div className="hero-info">
              <span className="course-category-badge">{course.category}</span>
              
              <h1 className="course-main-title">{course.title}</h1>
              
              <p className="course-description">{course.description}</p>

              <div className="course-meta-info">
                <div className="meta-item">
                  <Star size={18} fill="#fbbf24" color="#fbbf24" />
                  <span className="rating-value">{course.rating}</span>
                  <span className="rating-count">({course.reviewCount?.toLocaleString()} reviews)</span>
                </div>
                <div className="meta-item">
                  <Users size={18} />
                  <span>{course.enrolledCount?.toLocaleString()} students</span>
                </div>
              </div>

              <div className="instructor-info">
                <img src={course.instructorAvatar} alt={course.instructor} className="instructor-avatar" />
                <div>
                  <span className="instructor-label">Created by</span>
                  <span className="instructor-name">{course.instructor}</span>
                </div>
              </div>

              <div className="course-badges">
                <div className="badge">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="badge">
                  <BarChart2 size={16} />
                  <span>{course.level}</span>
                </div>
                <div className="badge">
                  <Globe size={16} />
                  <span>{course.language}</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <motion.div 
              className="enrollment-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card-thumbnail">
                <img src={course.thumbnail} alt={course.title} />
                <div className="play-button">
                  <PlayCircle size={56} />
                </div>
                <span className="preview-text">Preview Course</span>
              </div>

              <div className="card-body">
                <div className="price-section">
                  {course.price === 'Free' ? (
                    <span className="price-free">Free</span>
                  ) : (
                    <>
                      <span className="price-current">{course.price}</span>
                      {course.originalPrice && (
                        <span className="price-original">{course.originalPrice}</span>
                      )}
                      {course.originalPrice && (
                        <span className="discount-badge">
                          {Math.round((1 - parseInt(course.price.replace(/\D/g, '')) / parseInt(course.originalPrice.replace(/\D/g, ''))) * 100)}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>

                <button 
                  className="btn-enroll-main"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <span className="loading-text">Enrolling...</span>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      {course.price === 'Free' ? 'Enroll for Free' : 'Enroll Now'}
                    </>
                  )}
                </button>

                <button 
                  className={`btn-wishlist ${wishlist ? 'active' : ''}`}
                  onClick={() => setWishlist(!wishlist)}
                >
                  <Heart size={18} fill={wishlist ? '#ef4444' : 'none'} />
                  {wishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
                </button>

                <div className="course-features">
                  <h4>This course includes:</h4>
                  <ul>
                    <li><Clock size={16} /> {course.duration} of content</li>
                    <li><BookOpen size={16} /> {totalLessons} lessons</li>
                    {course.features?.hasQuizzes && <li><FileText size={16} /> Quizzes & Assignments</li>}
                    {course.features?.hasCertificate && <li><Award size={16} /> Certificate of Completion</li>}
                    {course.features?.hasLifetimeAccess && <li><Zap size={16} /> Lifetime Access</li>}
                    <li><Globe size={16} /> Access on mobile & desktop</li>
                  </ul>
                </div>

                <button className="btn-share">
                  <Share2 size={16} />
                  Share Course
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="course-content-section">
        <div className="content-container">
          {/* What You'll Learn */}
          {course.learnings && course.learnings.length > 0 && (
            <motion.div 
              className="content-block learnings-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="block-title">What you'll learn</h2>
              <div className="learnings-grid">
                {course.learnings.map((item, index) => (
                  <div key={index} className="learning-item">
                    <Check size={20} className="check-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Course Curriculum */}
          {course.curriculum && course.curriculum.length > 0 && (
            <motion.div 
              className="content-block curriculum-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="curriculum-header">
                <h2 className="block-title">Course Curriculum</h2>
                <span className="curriculum-stats">
                  {course.curriculum.length} sections • {totalLessons} lessons • {course.duration}
                </span>
              </div>

              <div className="curriculum-sections">
                {course.curriculum.map((section, sIndex) => (
                  <div key={sIndex} className="curriculum-section">
                    <button 
                      className={`section-header ${activeSection === sIndex ? 'active' : ''}`}
                      onClick={() => toggleSection(sIndex)}
                    >
                      <div className="section-info">
                        {activeSection === sIndex ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        <span className="section-title">{section.sectionTitle}</span>
                      </div>
                      <span className="section-meta">{section.lessons.length} lessons</span>
                    </button>

                    <AnimatePresence>
                      {activeSection === sIndex && (
                        <motion.div 
                          className="section-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          {section.lessons.map((lesson, lIndex) => (
                            <div key={lIndex} className="lesson-item">
                              <div className="lesson-info">
                                {lesson.isPreview ? (
                                  <Unlock size={16} className="unlock-icon" />
                                ) : (
                                  <Lock size={16} className="lock-icon" />
                                )}
                                <PlayCircle size={16} />
                                <span className="lesson-title">{lesson.title}</span>
                              </div>
                              <div className="lesson-meta">
                                {lesson.isPreview && <span className="preview-badge">Preview</span>}
                                <span className="lesson-duration">{lesson.duration}</span>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <motion.div 
              className="content-block requirements-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="block-title">Requirements</h2>
              <ul className="requirements-list">
                {course.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Instructor */}
          <motion.div 
            className="content-block instructor-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="block-title">Instructor</h2>
            <div className="instructor-card">
              <img src={course.instructorAvatar} alt={course.instructor} className="instructor-big-avatar" />
              <div className="instructor-details">
                <h3>{course.instructor}</h3>
                <p className="instructor-bio">{course.instructorBio}</p>
                <div className="instructor-stats">
                  <div className="stat">
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <span>{course.rating} Instructor Rating</span>
                  </div>
                  <div className="stat">
                    <Users size={16} />
                    <span>{course.enrolledCount?.toLocaleString()} Students</span>
                  </div>
                  <div className="stat">
                    <BookOpen size={16} />
                    <span>{totalLessons} Lessons</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="mobile-cta">
        <div className="mobile-price">
          {course.price === 'Free' ? (
            <span className="price-free">Free</span>
          ) : (
            <span className="price-current">{course.price}</span>
          )}
        </div>
        <button className="btn-enroll-mobile" onClick={handleEnroll}>
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
