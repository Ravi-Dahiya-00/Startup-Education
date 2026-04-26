"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import API_URL from '@/lib/api';

const AdminBlogs = () => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    image: '',
    category: 'Career',
    readTime: '',
    tags: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const tagsArray = formData.tags.split(',').map(tag => tag.trim());
    const payload = { ...formData, tags: tagsArray };

    try {
      const response = await fetch(`${API_URL}/api/blogs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passkey': sessionStorage.getItem('adminPasskey')
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ title: '', excerpt: '', content: '', author: '', image: '', category: 'Career', readTime: '', tags: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin <span className="text-highlight">Blogs</span></h1>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div className="listing-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Blog Title" required className="admin-input" />
            <textarea 
              name="excerpt" 
              value={formData.excerpt} 
              onChange={handleChange} 
              placeholder="Short Excerpt (Summary)" 
              required 
              className="admin-input" 
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input name="author" value={formData.author} onChange={handleChange} placeholder="Author Name" required className="admin-input" />
              <input name="readTime" value={formData.readTime} onChange={handleChange} placeholder="Read Time (e.g. 5 min)" required className="admin-input" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <select name="category" value={formData.category} onChange={handleChange} className="admin-input">
                <option>Career</option>
                <option>Technology</option>
                <option>Student Life</option>
                <option>Interview Tips</option>
              </select>
              <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="admin-input" />
            </div>
            <textarea 
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              placeholder="Full Content (HTML or Text)" 
              required 
              className="admin-input" 
              style={{ minHeight: '200px', resize: 'vertical' }}
            />
            <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="admin-input" />
            
            <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {status === 'loading' ? 'Saving...' : <><Save size={20} /> Save Article</>}
            </button>
            {status === 'success' && <p style={{ color: '#10b981', textAlign: 'center' }}>Article published!</p>}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminBlogs;
