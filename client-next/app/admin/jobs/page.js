"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, Briefcase, Calendar, User, List, Phone, Mail, Globe, MapPin, X, Search, Loader2 } from 'lucide-react';
import { useLocationAutocomplete } from '@/hooks/useLocationAutocomplete';
import { useSkillsAutocomplete } from '@/hooks/useSkillsAutocomplete';
import CustomDatePicker from '@/components/CustomDatePicker';
import API_URL from '@/lib/api';

const AdminJobs = () => {
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    companyWebsite: '',
    logo: '',
    location: '',
    salary: '',
    experience: '',
    deadline: '',
    category: 'Engineering',
    tags: '',
    workType: 'Full Time',
    workingDays: '5 Days/Week',
    userType: 'Professional',
    responsibilities: '',
    skills: [], // Array of strings
    optionalSkills: [], // Array of strings
    perks: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: ''
  });

  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Hooks for Autocomplete
  const locationHook = useLocationAutocomplete();
  const skillsHook = useSkillsAutocomplete();
  const optionalSkillsHook = useSkillsAutocomplete(); // Separate instance for optional skills

  // Handle outside click to close dropdowns
  const locationRef = useRef(null);
  const skillsRef = useRef(null);
  const optionalSkillsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        locationHook.clearSuggestions();
      }
      if (skillsRef.current && !skillsRef.current.contains(event.target)) {
        skillsHook.clearSuggestions();
      }
      if (optionalSkillsRef.current && !optionalSkillsRef.current.contains(event.target)) {
        optionalSkillsHook.clearSuggestions();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [locationHook, skillsHook, optionalSkillsHook]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Location Selection
  const handleLocationSelect = (location) => {
    setFormData({ ...formData, location: location.displayName });
    locationHook.setQuery(location.displayName); // Update input to show selected
    locationHook.clearSuggestions();
  };

  // Handle Skill Addition
  const addSkill = (skillName, type = 'required') => {
    const targetArray = type === 'required' ? formData.skills : formData.optionalSkills;
    if (!targetArray.includes(skillName)) {
      setFormData({
        ...formData,
        [type === 'required' ? 'skills' : 'optionalSkills']: [...targetArray, skillName]
      });
    }
    if (type === 'required') {
      skillsHook.setQuery('');
      skillsHook.clearSuggestions();
    } else {
      optionalSkillsHook.setQuery('');
      optionalSkillsHook.clearSuggestions();
    }
  };

  // Handle Skill Removal
  const removeSkill = (skillName, type = 'required') => {
    const targetArray = type === 'required' ? formData.skills : formData.optionalSkills;
    setFormData({
      ...formData,
      [type === 'required' ? 'skills' : 'optionalSkills']: targetArray.filter(s => s !== skillName)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const toArray = (str) => str ? str.split(',').map(s => s.trim()).filter(s => s !== '') : [];

    const payload = {
      ...formData,
      tags: toArray(formData.tags),
      responsibilities: toArray(formData.responsibilities),
      perks: toArray(formData.perks),
      // Skills are already arrays
      organizer: {
        name: formData.organizerName,
        email: formData.organizerEmail,
        phone: formData.organizerPhone
      }
    };

    delete payload.organizerName;
    delete payload.organizerEmail;
    delete payload.organizerPhone;
    if (!payload.logo) delete payload.logo;

    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passkey': sessionStorage.getItem('adminPasskey')
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          role: '', company: '', companyWebsite: '', logo: '', location: '', salary: '', experience: '', deadline: '',
          category: 'Engineering', tags: '',
          workType: 'Full Time', workingDays: '5 Days/Week', userType: 'Professional',
          responsibilities: '', skills: [], optionalSkills: [], perks: '',
          organizerName: '', organizerEmail: '', organizerPhone: ''
        });
        locationHook.setQuery('');
        setTimeout(() => setStatus(null), 3000);
      } else {
        const errorData = await response.json();
        setStatus('error');
        setErrorMessage(errorData.message || 'Failed to save job');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Network error');
    }
  };

  // Styles
  const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--background)',
    color: 'var(--text-main)',
    fontSize: '0.9rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '500'
  };

  const sectionTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text-main)',
    marginBottom: '1rem',
    marginTop: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'var(--background)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  const suggestionItemStyle = {
    padding: '0.8rem',
    cursor: 'pointer',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin <span className="text-highlight">Panel</span></h1>
        <p className="page-subtitle">Add new comprehensive job listings.</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
        <motion.div 
          className="listing-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '2rem' }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Basic Info */}
            <div style={sectionTitleStyle}><Briefcase size={20} /> Basic Information</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={labelStyle}>Role Title</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} required placeholder="e.g. Senior Backend Engineer" style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Company Name</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} required placeholder="e.g. Microsoft" style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Company Website</label>
                <input type="text" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="https://microsoft.com" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              {/* Location with Autocomplete */}
              <div className="form-group" style={{ position: 'relative' }} ref={locationRef}>
                <label style={labelStyle}>Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    value={locationHook.query} 
                    onChange={(e) => {
                      locationHook.setQuery(e.target.value);
                      setFormData({ ...formData, location: e.target.value }); // Allow manual typing too
                    }}
                    placeholder="Search city..." 
                    style={{ ...inputStyle, paddingLeft: '2.5rem' }} 
                  />
                  {locationHook.loading && (
                    <Loader2 size={18} className="animate-spin" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  )}
                </div>
                {locationHook.suggestions.length > 0 && (
                  <div style={dropdownStyle}>
                    {locationHook.suggestions.map((loc, idx) => (
                      <div 
                        key={idx} 
                        style={suggestionItemStyle}
                        onClick={() => handleLocationSelect(loc)}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <MapPin size={14} />
                        <span>{loc.displayName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label style={labelStyle}>Salary</label>
                <input type="text" name="salary" value={formData.salary} onChange={handleChange} required placeholder="e.g. ₹15,00,000/year" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={labelStyle}>Experience</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} required placeholder="e.g. 2+ Years" style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Deadline</label>
                <CustomDatePicker 
                  value={formData.deadline} 
                  onChange={(date) => setFormData({ ...formData, deadline: date })} 
                  placeholder="Select Deadline"
                />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Content">Content</option>
                </select>
              </div>
            </div>

            {/* Work Details */}
            <div style={sectionTitleStyle}><Calendar size={20} /> Work Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={labelStyle}>Work Type</label>
                <select name="workType" value={formData.workType} onChange={handleChange} style={inputStyle}>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              <div className="form-group">
                <label style={labelStyle}>Working Days</label>
                <select name="workingDays" value={formData.workingDays} onChange={handleChange} style={inputStyle}>
                  <option value="5 Days/Week">5 Days/Week</option>
                  <option value="6 Days/Week">6 Days/Week</option>
                  <option value="4 Days/Week">4 Days/Week</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div className="form-group">
                <label style={labelStyle}>Target User</label>
                <select name="userType" value={formData.userType} onChange={handleChange} style={inputStyle}>
                  <option value="Professional">Professional</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>
            </div>

            {/* Detailed Info */}
            <div style={sectionTitleStyle}><List size={20} /> Detailed Information</div>
            <div className="form-group">
              <label style={labelStyle}>Responsibilities (comma separated)</label>
              <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} placeholder="Design architecture, Manage team, Code review..." style={{ ...inputStyle, minHeight: '80px' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              {/* Required Skills with Autocomplete */}
              <div className="form-group" style={{ position: 'relative' }} ref={skillsRef}>
                <label style={labelStyle}>Required Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {formData.skills.map((skill, idx) => (
                    <span key={idx} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {skill}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill, 'required')} />
                    </span>
                  ))}
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    value={skillsHook.query} 
                    onChange={(e) => skillsHook.setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(skillsHook.query, 'required');
                      }
                    }}
                    placeholder="Search skills (e.g. React)..." 
                    style={{ ...inputStyle, paddingLeft: '2.5rem' }} 
                  />
                </div>
                {skillsHook.suggestions.length > 0 && (
                  <div style={dropdownStyle}>
                    {skillsHook.suggestions.map((skill, idx) => (
                      <div 
                        key={idx} 
                        style={suggestionItemStyle}
                        onClick={() => addSkill(skill.name, 'required')}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span>{skill.name}</span>
                        {skill.source === 'github' && <span style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>Tech</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Skills with Autocomplete */}
              <div className="form-group" style={{ position: 'relative' }} ref={optionalSkillsRef}>
                <label style={labelStyle}>Optional Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {formData.optionalSkills.map((skill, idx) => (
                    <span key={idx} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {skill}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill, 'optional')} />
                    </span>
                  ))}
                </div>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    value={optionalSkillsHook.query} 
                    onChange={(e) => optionalSkillsHook.setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(optionalSkillsHook.query, 'optional');
                      }
                    }}
                    placeholder="Search optional skills..." 
                    style={{ ...inputStyle, paddingLeft: '2.5rem' }} 
                  />
                </div>
                {optionalSkillsHook.suggestions.length > 0 && (
                  <div style={dropdownStyle}>
                    {optionalSkillsHook.suggestions.map((skill, idx) => (
                      <div 
                        key={idx} 
                        style={suggestionItemStyle}
                        onClick={() => addSkill(skill.name, 'optional')}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <span>{skill.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label style={labelStyle}>Perks & Benefits (comma separated)</label>
              <textarea name="perks" value={formData.perks} onChange={handleChange} placeholder="Health Insurance, Remote Work, Stock Options..." style={{ ...inputStyle, minHeight: '80px' }} />
            </div>

            {/* Organizer Info */}
            <div style={sectionTitleStyle}><User size={20} /> Organizer / Contact</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={labelStyle}>Name</label>
                <input type="text" name="organizerName" value={formData.organizerName} onChange={handleChange} placeholder="HR Name" style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Email</label>
                <input type="email" name="organizerEmail" value={formData.organizerEmail} onChange={handleChange} placeholder="hr@company.com" style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Phone</label>
                <input type="text" name="organizerPhone" value={formData.organizerPhone} onChange={handleChange} placeholder="+91..." style={inputStyle} />
              </div>
            </div>

            {/* Extra */}
            <div style={sectionTitleStyle}><Globe size={20} /> Additional</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={labelStyle}>Logo URL</label>
                <input type="text" name="logo" value={formData.logo} onChange={handleChange} placeholder="https://..." style={inputStyle} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Tags (comma separated)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Remote, Urgent, High Paying" style={inputStyle} />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', padding: '1rem', fontSize: '1rem' }}
            >
              {status === 'loading' ? 'Saving...' : <><Save size={20} /> Save Job</>}
            </button>

            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#10b981', textAlign: 'center', marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}
              >
                Job added successfully!
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}
              >
                {errorMessage}
              </motion.div>
            )}

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminJobs;
