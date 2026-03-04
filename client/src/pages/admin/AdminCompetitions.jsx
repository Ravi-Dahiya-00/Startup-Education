import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import API_URL from '../../config/api';

const AdminCompetitions = () => {
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    mode: 'Online',
    prizes: '',
    deadline: '',
    category: 'Coding',
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
      const response = await fetch(`${API_URL}/api/competitions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passkey': sessionStorage.getItem('adminPasskey')
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ title: '', organizer: '', mode: 'Online', prizes: '', deadline: '', category: 'Coding', tags: '' });
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
        <h1 className="page-title">Admin <span className="text-highlight">Competitions</span></h1>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div className="listing-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Competition Title" required className="admin-input" />
              <input name="organizer" value={formData.organizer} onChange={handleChange} placeholder="Organizer" required className="admin-input" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <select name="mode" value={formData.mode} onChange={handleChange} className="admin-input">
                <option>Online</option>
                <option>Offline</option>
              </select>
              <input name="prizes" value={formData.prizes} onChange={handleChange} placeholder="Prizes (e.g. ₹50k)" required className="admin-input" />
            </div>
            <input name="deadline" value={formData.deadline} onChange={handleChange} placeholder="Deadline" required className="admin-input" />
            <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="admin-input" />
            
            <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {status === 'loading' ? 'Saving...' : <><Save size={20} /> Save Competition</>}
            </button>
            {status === 'success' && <p style={{ color: '#10b981', textAlign: 'center' }}>Competition added!</p>}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCompetitions;
