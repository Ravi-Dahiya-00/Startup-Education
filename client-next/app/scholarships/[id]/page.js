"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import API_URL from '@/lib/api';
import {
  ArrowLeft, Calendar, DollarSign, Users, Award, Clock,
  CheckCircle, ExternalLink, ChevronRight, Share2, Bookmark,
  GraduationCap, FileText, AlertCircle
} from 'lucide-react';
import './ScholarshipDetails.css';

const ScholarshipDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const response = await fetch(`${API_URL}/api/scholarships/${id}`);
        if (!response.ok) {
          throw new Error('Scholarship not found');
        }
        const data = await response.json();
        setScholarship(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [id]);

  const handleApply = async () => {
    if (scholarship.applicationLink) {
      window.open(scholarship.applicationLink, '_blank');
    }
    
    setApplying(true);
    try {
      await fetch(`${API_URL}/api/scholarships/${id}/apply`, { method: 'POST' });
      setScholarship(prev => ({ ...prev, applicants: (prev.applicants || 0) + 1 }));
    } catch (err) {
      console.error('Error:', err);
    }
    setApplying(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: scholarship.title,
        text: `Check out this scholarship: ${scholarship.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const isDeadlinePassed = () => {
    if (!scholarship.deadline) return false;
    const deadline = new Date(scholarship.deadline);
    return deadline < new Date();
  };

  const getDaysRemaining = () => {
    if (!scholarship.deadline) return null;
    const deadline = new Date(scholarship.deadline);
    const today = new Date();
    const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="scholarship-details-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading scholarship details...</p>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="scholarship-details-page">
        <div className="error-state">
          <h2>Scholarship not found</h2>
          <p>The scholarship you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => router.push('/scholarships')} className="btn-back-scholarships">
            <ArrowLeft size={18} />
            Back to Scholarships
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining();

  return (
    <div className="scholarship-details-page">
      {/* Header */}
      <header className="scholarship-header">
        <div className="header-container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={14} />
            <Link href="/scholarships">Scholarships</Link>
            <ChevronRight size={14} />
            <span>{scholarship.category}</span>
          </nav>

          <button onClick={() => router.push('/scholarships')} className="btn-back">
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="scholarship-hero">
        <div className="hero-container">
          <div className="hero-content">
            <motion.div 
              className="provider-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="provider-logo">
                {scholarship.providerLogo ? (
                  <img src={scholarship.providerLogo} alt={scholarship.provider} />
                ) : (
                  <GraduationCap size={32} />
                )}
              </div>
              <div>
                <span className="provider-name">{scholarship.provider}</span>
                <span className="category-badge">{scholarship.category}</span>
              </div>
            </motion.div>

            <motion.h1 
              className="scholarship-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {scholarship.title}
            </motion.h1>

            <motion.div 
              className="scholarship-meta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="meta-item highlight">
                <DollarSign size={20} />
                <div>
                  <span className="meta-label">Award Amount</span>
                  <span className="meta-value">{scholarship.amount}</span>
                </div>
              </div>
              <div className="meta-item">
                <Calendar size={20} />
                <div>
                  <span className="meta-label">Deadline</span>
                  <span className="meta-value">{scholarship.deadline}</span>
                </div>
              </div>
              <div className="meta-item">
                <Users size={20} />
                <div>
                  <span className="meta-label">Applicants</span>
                  <span className="meta-value">{scholarship.applicants || 0}+</span>
                </div>
              </div>
            </motion.div>

            {/* Deadline Alert */}
            {daysRemaining !== null && (
              <motion.div 
                className={`deadline-alert ${daysRemaining <= 7 ? 'urgent' : ''} ${isDeadlinePassed() ? 'expired' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AlertCircle size={18} />
                {isDeadlinePassed() ? (
                  <span>This scholarship deadline has passed</span>
                ) : daysRemaining <= 7 ? (
                  <span>Hurry! Only {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left to apply</span>
                ) : (
                  <span>{daysRemaining} days remaining to apply</span>
                )}
              </motion.div>
            )}
          </div>

          {/* Apply Card */}
          <motion.div 
            className="apply-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="amount-display">
              <span className="amount-label">Scholarship Amount</span>
              <span className="amount-value">{scholarship.amount}</span>
            </div>

            <div className="eligibility-preview">
              <Award size={18} />
              <span>{scholarship.eligibility}</span>
            </div>

            <button 
              className="btn-apply"
              onClick={handleApply}
              disabled={applying || isDeadlinePassed()}
            >
              {isDeadlinePassed() ? 'Deadline Passed' : applying ? 'Processing...' : 'Apply Now'}
              {!isDeadlinePassed() && <ExternalLink size={18} />}
            </button>

            <div className="action-buttons">
              <button 
                className={`btn-action ${saved ? 'active' : ''}`}
                onClick={() => setSaved(!saved)}
              >
                <Bookmark size={18} fill={saved ? 'var(--primary)' : 'none'} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <button className="btn-action" onClick={handleShare}>
                <Share2 size={18} />
                Share
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="scholarship-content">
        <div className="content-container">
          {/* Description */}
          {scholarship.description && (
            <motion.div 
              className="content-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2><FileText size={20} /> About This Scholarship</h2>
              <p>{scholarship.description}</p>
            </motion.div>
          )}

          {/* Benefits */}
          {scholarship.benefits && scholarship.benefits.length > 0 && (
            <motion.div 
              className="content-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2><Award size={20} /> Benefits</h2>
              <ul className="benefits-list">
                {scholarship.benefits.map((benefit, index) => (
                  <li key={index}>
                    <CheckCircle size={18} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Requirements */}
          {scholarship.requirements && scholarship.requirements.length > 0 && (
            <motion.div 
              className="content-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2><FileText size={20} /> Requirements</h2>
              <ul className="requirements-list">
                {scholarship.requirements.map((req, index) => (
                  <li key={index}>
                    <CheckCircle size={18} />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* How to Apply */}
          {scholarship.howToApply && (
            <motion.div 
              className="content-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2><GraduationCap size={20} /> How to Apply</h2>
              <p>{scholarship.howToApply}</p>
            </motion.div>
          )}

          {/* Tags */}
          {scholarship.tags && scholarship.tags.length > 0 && (
            <div className="tags-section">
              {scholarship.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mobile Apply Button */}
      <div className="mobile-apply">
        <div className="mobile-amount">{scholarship.amount}</div>
        <button 
          className="btn-apply-mobile"
          onClick={handleApply}
          disabled={applying || isDeadlinePassed()}
        >
          {isDeadlinePassed() ? 'Deadline Passed' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
};

export default ScholarshipDetails;
