"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import API_URL from '@/lib/api';
import {
  ArrowLeft, Clock, Calendar, User, Heart, Share2, Bookmark,
  Eye, Tag, ChevronRight
} from 'lucide-react';
import './BlogDetails.css';

const BlogDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs/${id}`);
        if (!response.ok) {
          throw new Error('Blog not found');
        }
        const data = await response.json();
        setBlog(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (liked) return;
    try {
      await fetch(`${API_URL}/api/blogs/${id}/like`, { method: 'POST' });
      setBlog(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      setLiked(true);
    } catch (err) {
      console.error('Error liking blog:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="blog-details-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-details-page">
        <div className="error-state">
          <h2>Article not found</h2>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => router.push('/blogs')} className="btn-back-blogs">
            <ArrowLeft size={18} />
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-details-page">
      {/* Header */}
      <header className="blog-header">
        <div className="header-container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={14} />
            <Link href="/blogs">Blogs</Link>
            <ChevronRight size={14} />
            <span>{blog.category}</span>
          </nav>

          <button onClick={() => router.push('/blogs')} className="btn-back">
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="blog-hero">
        <div className="hero-container">
          <motion.div 
            className="blog-meta-top"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="category-badge">{blog.category}</span>
            <span className="read-time">
              <Clock size={14} />
              {blog.readTime}
            </span>
          </motion.div>

          <motion.h1 
            className="blog-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {blog.title}
          </motion.h1>

          <motion.p 
            className="blog-excerpt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {blog.excerpt}
          </motion.p>

          <motion.div 
            className="author-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="author-avatar">
              {blog.authorAvatar ? (
                <img src={blog.authorAvatar} alt={blog.author} />
              ) : (
                <User size={24} />
              )}
            </div>
            <div className="author-details">
              <span className="author-name">{blog.author}</span>
              <span className="publish-date">
                <Calendar size={14} />
                {formatDate(blog.createdAt)}
              </span>
            </div>
          </motion.div>

          <motion.div 
            className="blog-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="stat">
              <Eye size={16} />
              {blog.views || 0} views
            </span>
            <span className="stat">
              <Heart size={16} />
              {blog.likes || 0} likes
            </span>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <motion.div 
        className="featured-image"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <img src={blog.image} alt={blog.title} />
      </motion.div>

      {/* Content */}
      <article className="blog-content">
        <div className="content-container">
          {/* Side Actions */}
          <aside className="side-actions">
            <button 
              className={`action-btn ${liked ? 'active' : ''}`}
              onClick={handleLike}
              title="Like"
            >
              <Heart size={20} fill={liked ? '#ef4444' : 'none'} />
              <span>{blog.likes || 0}</span>
            </button>
            <button 
              className={`action-btn ${saved ? 'active' : ''}`}
              onClick={() => setSaved(!saved)}
              title="Save"
            >
              <Bookmark size={20} fill={saved ? 'var(--primary)' : 'none'} />
            </button>
            <button className="action-btn" onClick={handleShare} title="Share">
              <Share2 size={20} />
            </button>
          </aside>

          {/* Main Content */}
          <div className="main-content">
            <div 
              className="article-body"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="tags-section">
                <Tag size={16} />
                <div className="tags-list">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            {blog.authorBio && (
              <div className="author-bio-section">
                <div className="author-avatar-large">
                  {blog.authorAvatar ? (
                    <img src={blog.authorAvatar} alt={blog.author} />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div className="author-bio-content">
                  <h3>Written by {blog.author}</h3>
                  <p>{blog.authorBio}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Bottom Actions (Mobile) */}
      <div className="mobile-actions">
        <button 
          className={`mobile-action-btn ${liked ? 'active' : ''}`}
          onClick={handleLike}
        >
          <Heart size={20} fill={liked ? '#ef4444' : 'none'} />
          <span>{blog.likes || 0}</span>
        </button>
        <button 
          className={`mobile-action-btn ${saved ? 'active' : ''}`}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark size={20} fill={saved ? 'var(--primary)' : 'none'} />
        </button>
        <button className="mobile-action-btn" onClick={handleShare}>
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default BlogDetails;
