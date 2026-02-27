import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, BookOpen, User, Layers, Calendar, Tag, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

const UploadNote = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data States
  const [universities, setUniversities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Form States
  const [formData, setFormData] = useState({
    university: '',
    branch: '',
    semester: '',
    subject: '',
    title: '',
    description: '',
    category: 'Notes',
    tags: [],
    author: '' // Optional display name
  });

  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [status, setStatus] = useState(null); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isNewSubject, setIsNewSubject] = useState(false);
  const [isNewBranch, setIsNewBranch] = useState(false);
  const [smartSuggestion, setSmartSuggestion] = useState(null); // New

  // Fetch Universities on Mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(`${API_URL}/api/structure/universities`);
        const data = await res.json();
        setUniversities(data);
      } catch (err) {
        console.error('Failed to fetch universities', err);
      }
    };
    fetchUniversities();
  }, []);

  // Fetch Branches when University changes
  useEffect(() => {
    if (formData.university) {
      const fetchBranches = async () => {
        try {
          const res = await fetch(`${API_URL}/api/structure/branches/${formData.university}`);
          const data = await res.json();
          setBranches(data);
        } catch (err) {
          console.error('Failed to fetch branches', err);
        }
      };
      fetchBranches();
    } else {
      setBranches([]);
    }
  }, [formData.university]);

  // Fetch Subjects when Branch or Semester changes
  useEffect(() => {
    // If creating new branch, we can't fetch subjects yet, so just clear them or allow creating new subject
    if (isNewBranch) {
       setSubjects([]);
       return;
    }

    if (formData.branch && formData.semester) {
      const fetchSubjects = async () => {
        try {
          const res = await fetch(`${API_URL}/api/structure/subjects/${formData.branch}/${formData.semester}`);
          const data = await res.json();
          setSubjects(data);
        } catch (err) {
          console.error('Failed to fetch subjects', err);
        }
      };
      fetchSubjects();
    } else {
      setSubjects([]);
    }
  }, [formData.branch, formData.semester, isNewBranch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // SMART MATCHING HANDLER
  const handleSubjectBlur = async () => {
    if (!formData.subjectName || formData.subjectName.length < 3) return;
    
    try {
      const res = await fetch(`${API_URL}/api/smart/match/subject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: formData.subjectName,
          branchId: formData.branch !== 'new' ? formData.branch : null,
          semester: formData.semester
        })
      });
      const data = await res.json();
      
      if (data.action === 'link' || data.action === 'suggest') {
        setSmartSuggestion(data.suggestion);
      } else if (data.action === 'create' && data.normalizedInput !== formData.subjectName.toLowerCase()) {
        // Suggest the cleaned name
        setSmartSuggestion({ name: data.suggestion.name });
      }
    } catch (err) {
      console.error('Smart match failed', err);
    }
  };

  // Tag Handling
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  // File Handling
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (selectedFile) {
      // Validate File Type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        setErrorMessage('Invalid file type. Please upload PDF, DOCX, or JPG.');
        setStatus('error');
        return;
      }
      // Validate Size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrorMessage('File size too large. Max 10MB allowed.');
        setStatus('error');
        return;
      }

      setFile(selectedFile);
      setStatus('idle');
      setErrorMessage('');

      // Generate Preview (for images)
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage('You must be logged in to upload notes.');
      setStatus('error');
      return;
    }
    
    setStatus('loading');

    const data = new FormData();
    data.append('university', formData.university);
    data.append('branch', formData.branch);
    if (isNewBranch) {
      data.append('branchCode', formData.branchCode);
      data.append('branchName', formData.branchName);
    }
    data.append('semester', formData.semester);
    data.append('subject', formData.subject);
    if (isNewSubject) {
      data.append('subjectCode', formData.subjectCode);
      data.append('subjectName', formData.subjectName);
    }
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('tags', formData.tags.join(','));
    data.append('uploader', user.id); // Assuming user object has id
    if (formData.author) data.append('author', formData.author);
    if (file) data.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        body: data 
      });
      
      if (response.ok) {
        setStatus('success');
        // Reset Form
        setFormData({
          university: '', branch: '', semester: '', subject: '',
          title: '', description: '', category: 'Notes', tags: [], author: ''
        });
        setFile(null);
        setFilePreview(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to connect to server');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Upload <span className="text-highlight">Notes</span></h1>
        <p className="page-subtitle">Share your knowledge with the community.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div 
          className="listing-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '2.5rem' }}
        >
          {status === 'success' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '2rem' }}
            >
              <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle size={40} color="#10b981" />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Upload Successful!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your note is now live and ready to help others.</p>
              <button onClick={() => setStatus(null)} className="btn-primary">Upload Another</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Academic Details */}
              <div className="form-section">
                <h3 className="section-title">Academic Details</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="input-label">University</label>
                    <select 
                      name="university" 
                      value={formData.university} 
                      onChange={handleChange} 
                      required 
                      className="admin-input"
                    >
                      <option value="">Select University</option>
                      {universities.map(uni => (
                        <option key={uni._id} value={uni._id}>{uni.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="input-label">Branch</label>
                    <div className="branch-input-wrapper">
                      {!isNewBranch ? (
                        <>
                          <select 
                            name="branch" 
                            value={formData.branch} 
                            onChange={(e) => {
                              if (e.target.value === 'new') {
                                setIsNewBranch(true);
                                setFormData({ ...formData, branch: 'new', branchCode: '', branchName: '' });
                              } else {
                                setFormData({ ...formData, branch: e.target.value });
                              }
                            }} 
                            required 
                            className="admin-input"
                            disabled={!formData.university}
                          >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                              <option key={branch._id} value={branch._id}>{branch.name}</option>
                            ))}
                            <option value="new" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Add New Branch</option>
                          </select>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                            Can't find your branch? Select "+ Add New Branch"
                          </p>
                        </>
                      ) : (
                        <div className="new-branch-inputs" style={{ background: 'var(--surface-hover)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--primary)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)' }}>New Branch Details</span>
                            <button type="button" onClick={() => setIsNewBranch(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                          </div>
                          <div className="grid-2" style={{ gap: '1rem' }}>
                            <div>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Branch Code</label>
                              <input 
                                name="branchCode"
                                value={formData.branchCode || ''}
                                onChange={handleChange}
                                placeholder="e.g. CSE"
                                className="admin-input"
                                required
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Branch Name</label>
                              <input 
                                name="branchName"
                                value={formData.branchName || ''}
                                onChange={handleChange}
                                placeholder="e.g. Computer Science"
                                className="admin-input"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="input-label">Semester</label>
                    <select 
                      name="semester" 
                      value={formData.semester} 
                      onChange={handleChange} 
                      required 
                      className="admin-input"
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>{sem} Semester</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="input-label">Subject</label>
                    <div className="subject-input-wrapper">
                      {!isNewSubject ? (
                        <>
                          <select 
                            name="subject" 
                            value={formData.subject} 
                            onChange={(e) => {
                              if (e.target.value === 'new') {
                                setIsNewSubject(true);
                                setFormData({ ...formData, subject: 'new', subjectCode: '', subjectName: '' });
                              } else {
                                setFormData({ ...formData, subject: e.target.value });
                              }
                            }} 
                            required 
                            className="admin-input"
                            disabled={!formData.branch || !formData.semester}
                          >
                            <option value="">Select Subject</option>
                            {subjects.map(sub => (
                              <option key={sub._id} value={sub._id}>{sub.code} - {sub.name}</option>
                            ))}
                            <option value="new" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Add New Subject</option>
                          </select>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                            Can't find your subject? Select "+ Add New Subject"
                          </p>
                        </>
                      ) : (
                        <div className="new-subject-inputs" style={{ background: 'var(--surface-hover)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--primary)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)' }}>New Subject Details</span>
                            <button type="button" onClick={() => setIsNewSubject(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                          </div>
                          
                          {/* Smart Suggestion Box */}
                          {smartSuggestion && (
                            <div style={{ background: '#ecfdf5', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #10b981' }}>
                              <p style={{ fontSize: '0.9rem', color: '#047857', margin: 0 }}>
                                <strong>💡 Smart Match:</strong> We found a similar subject!
                              </p>
                              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600' }}>{smartSuggestion.name}</span>
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    if (smartSuggestion._id) {
                                      // Existing subject
                                      setIsNewSubject(false);
                                      setFormData({ ...formData, subject: smartSuggestion._id });
                                    } else {
                                      // Cleaned name suggestion
                                      setFormData({ ...formData, subjectName: smartSuggestion.name });
                                    }
                                    setSmartSuggestion(null);
                                  }}
                                  style={{ padding: '4px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                  Use This
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="grid-2" style={{ gap: '1rem' }}>
                            <div>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Course Code</label>
                              <input 
                                name="subjectCode"
                                value={formData.subjectCode || ''}
                                onChange={handleChange}
                                placeholder="e.g. CS101"
                                className="admin-input"
                                required
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subject Name</label>
                              <input 
                                name="subjectName"
                                value={formData.subjectName || ''}
                                onChange={handleChange}
                                onBlur={handleSubjectBlur} // Trigger Smart Match
                                placeholder="e.g. Data Structures"
                                className="admin-input"
                                required
                              />
                            </div>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            * Our AI will automatically correct common spellings and duplicates.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Note Details */}
              <div className="form-section">
                <h3 className="section-title">Note Information</h3>
                <div className="form-group">
                  <label className="input-label">Title</label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="e.g. Unit 1 - Introduction to Data Structures" 
                    required 
                    className="admin-input" 
                  />
                </div>
                
                <div className="grid-2">
                  <div className="form-group">
                    <label className="input-label">Category</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      className="admin-input"
                    >
                      {['Notes', 'PPT', 'PYQ', 'Lab Manual', 'Assignment', 'Syllabus', 'E-Book', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="input-label">Author (Optional)</label>
                    <input 
                      name="author" 
                      value={formData.author} 
                      onChange={handleChange} 
                      placeholder="Original author name" 
                      className="admin-input" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Briefly describe what this note contains..." 
                    className="admin-input" 
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Tags</label>
                  <div className="tags-input-container admin-input">
                    {formData.tags.map(tag => (
                      <span key={tag} className="tag-pill">
                        {tag} <X size={14} onClick={() => removeTag(tag)} style={{ cursor: 'pointer' }} />
                      </span>
                    ))}
                    <input 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder={formData.tags.length === 0 ? "Type tag and press Enter" : ""}
                      style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-main)', flex: 1, minWidth: '120px' }}
                    />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    Suggested: Important, Handwritten, Unit 1, Solved
                  </p>
                </div>
              </div>

              {/* File Upload */}
              <div className="form-section">
                <h3 className="section-title">Document</h3>
                <div 
                  className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: isDragging ? '2px dashed var(--primary)' : '2px dashed var(--border)',
                    background: isDragging ? 'rgba(var(--primary-rgb), 0.05)' : 'var(--surface)',
                    padding: '3rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    required={!file}
                    accept=".pdf,.docx,.jpg,.png"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                  />
                  
                  {file ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {filePreview ? (
                        <img src={filePreview} alt="Preview" style={{ height: '100px', borderRadius: '8px', marginBottom: '1rem' }} />
                      ) : (
                        <FileText size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                      )}
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{file.name}</h3>
                      <p style={{ color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }} style={{ marginTop: '1rem', color: '#ef4444', background: 'transparent' }}>Remove File</button>
                    </div>
                  ) : (
                    <>
                      <Upload size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        Click or Drag file to upload
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        PDF, DOCX, JPG (Max 10MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {status === 'error' && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={20} /> {errorMessage}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ height: '50px', fontSize: '1.1rem', marginTop: '1rem' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Uploading...' : 'Publish Note'}
              </button>

            </form>
          )}
        </motion.div>
      </div>

      <style>{`
        .section-title {
          font-size: 1.2rem;
          color: var(--text-main);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }
        .form-section {
          margin-bottom: 1rem;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr; }
        }
        .input-label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .tags-input-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }
        .tag-pill {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </div>
  );
};

export default UploadNote;
