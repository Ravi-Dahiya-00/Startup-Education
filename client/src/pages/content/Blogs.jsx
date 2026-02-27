import React, { useState, useEffect } from 'react';
import { Search, Clock, User, ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import API_URL from '../../config/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs`);
        const data = await response.json();
        setBlogs(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Latest <span className="text-highlight">Insights</span></h1>
        <p className="page-subtitle">Career advice, tech trends, and student guides.</p>
        
        <div className="search-bar-large">
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Search articles..." />
          <button className="btn-search">Search</button>
        </div>
      </div>

      <div className="blogs-grid">
        {blogs.map((blog, index) => (
          <motion.div 
            key={blog._id} 
            className="blog-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.3)' }}
          >
            <div className="blog-image">
              <img src={blog.image} alt={blog.title} />
              <span className="blog-category">{blog.category}</span>
            </div>
            
            <div className="blog-content">
              <div className="blog-meta">
                <span className="meta-item"><User size={14} /> {blog.author}</span>
                <span className="meta-item"><Clock size={14} /> {blog.readTime}</span>
              </div>
              
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-excerpt">{blog.excerpt}</p>
              
              <div className="blog-footer">
                <button className="read-more">
                  Read Article <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {blogs.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No articles found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
