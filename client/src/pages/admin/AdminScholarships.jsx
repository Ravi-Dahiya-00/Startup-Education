import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import API_URL from '../../config/api';

const AdminScholarships = () => {
  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    amount: '',
    deadline: '',
    eligibility: '',
    category: 'Merit-based',
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
      const response = await fetch(`${API_URL}/api/scholarships`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passkey': sessionStorage.getItem('adminPasskey')
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ title: '', provider: '', amount: '', deadline: '', eligibility: '', category: 'Merit-based', tags: '' });
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
        <h1 className="page-title">Admin <span className="text-highlight">Scholarships</span></h1>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div className="listing-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Scholarship Title" required className="admin-input" />
              <input name="provider" value={formData.provider} onChange={handleChange} placeholder="Provider (e.g. Google)" required className="admin-input" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount (e.g. ₹50,000)" required className="admin-input" />
              <input name="deadline" value={formData.deadline} onChange={handleChange} placeholder="Deadline" required className="admin-input" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input name="eligibility" value={formData.eligibility} onChange={handleChange} placeholder="Eligibility (e.g. 1st Year)" required className="admin-input" />
              <select name="category" value={formData.category} onChange={handleChange} className="admin-input">
                <option>Merit-based</option>
                <option>Need-based</option>
                <option>Research</option>
                <option>International</option>
              </select>
            </div>
            <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="admin-input" />
            
            <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {status === 'loading' ? 'Saving...' : <><Save size={20} /> Save Scholarship</>}
            </button>
            {status === 'success' && <p style={{ color: '#10b981', textAlign: 'center' }}>Scholarship added!</p>}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminScholarships;
