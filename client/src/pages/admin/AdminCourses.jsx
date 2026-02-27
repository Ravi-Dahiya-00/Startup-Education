import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import API_URL from '../../config/api';

const AdminCourses = () => {
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    thumbnail: '',
    price: '',
    rating: '4.5',
    duration: '',
    category: 'Development',
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
      const response = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ title: '', instructor: '', thumbnail: '', price: '', rating: '4.5', duration: '', category: 'Development', tags: '' });
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
        <h1 className="page-title">Admin <span className="text-highlight">Courses</span></h1>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div className="listing-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" required className="admin-input" />
              <input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Instructor Name" required className="admin-input" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input name="price" value={formData.price} onChange={handleChange} placeholder="Price (e.g. Free or ₹499)" required className="admin-input" />
              <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (e.g. 10 Hours)" required className="admin-input" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <select name="category" value={formData.category} onChange={handleChange} className="admin-input">
                <option>Development</option>
                <option>Design</option>
                <option>Business</option>
                <option>Marketing</option>
              </select>
              <input name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating (e.g. 4.8)" className="admin-input" />
            </div>
            <input name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="Thumbnail URL" className="admin-input" />
            <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="admin-input" />
            
            <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {status === 'loading' ? 'Saving...' : <><Save size={20} /> Save Course</>}
            </button>
            {status === 'success' && <p style={{ color: '#10b981', textAlign: 'center' }}>Course added!</p>}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCourses;
