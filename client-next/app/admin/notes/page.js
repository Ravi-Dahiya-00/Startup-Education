"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import API_URL from '@/lib/api';

const AdminNotes = () => {
  const [formData, setFormData] = useState({
    title: '',
    university: '',
    branch: '',
    semester: '',
    subject: '',
    link: '',
    author: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passkey': sessionStorage.getItem('adminPasskey')
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ title: '', university: '', branch: '', semester: '', subject: '', link: '', author: '' });
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
        <h1 className="page-title">Admin <span className="text-highlight">Notes</span></h1>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div className="listing-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input name="university" value={formData.university} onChange={handleChange} placeholder="University Name (e.g. VTU)" required className="admin-input" />
              <input name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch (e.g. CSE)" required className="admin-input" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <input name="semester" value={formData.semester} onChange={handleChange} placeholder="Semester (e.g. 3rd Sem)" required className="admin-input" />
              <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject (e.g. Data Structures)" required className="admin-input" />
            </div>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Note Title (e.g. Unit 1 Notes)" required className="admin-input" />
            <input name="link" value={formData.link} onChange={handleChange} placeholder="Download Link (PDF/Drive)" required className="admin-input" />
            <input name="author" value={formData.author} onChange={handleChange} placeholder="Author (Optional)" className="admin-input" />
            
            <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {status === 'loading' ? 'Saving...' : <><Save size={20} /> Save Note</>}
            </button>
            {status === 'success' && <p style={{ color: '#10b981', textAlign: 'center' }}>Note added!</p>}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminNotes;
