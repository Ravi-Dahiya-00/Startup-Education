"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Search, FileText, Download, Filter, ThumbsUp, User, BookOpen, Layers, School, Folder, ChevronRight, ArrowLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';
import API_URL from '@/lib/api';

const Notes = () => {
  const { universityId, subjectId } = useParams();
  const router = useRouter();

  // Determine View based on URL params
  const view = subjectId ? 'notes' : (universityId ? 'subjects' : 'universities');

  // Data State
  const [universities, setUniversities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [trendingNotes, setTrendingNotes] = useState([]); // New
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState('1'); // New state for input

  // Selected Data (for display names)
  const [currentUniversity, setCurrentUniversity] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState(''); // Global search for Universities
  const [subjectFilter, setSubjectFilter] = useState(''); // Search for Subjects
  const [subjectSort, setSubjectSort] = useState('popular');

  // Sidebar State
  const [showFilters, setShowFilters] = useState(false);
  const [filterUniversity, setFilterUniversity] = useState(universityId || '');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterSubject, setFilterSubject] = useState(subjectId || '');
  
  // Advanced Filters
  const [filterCategory, setFilterCategory] = useState('');
  const [filterFileType, setFilterFileType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  const [sidebarBranches, setSidebarBranches] = useState([]);
  const [sidebarSubjects, setSidebarSubjects] = useState([]);

  // --- Fetch Data ---

  // 0. Fetch Trending Notes (On Mount)
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notes?sort=popular&limit=5`);
        if (!res.ok) throw new Error('Failed to fetch trending notes');
        const data = await res.json();
        setTrendingNotes(data);
      } catch (err) { console.error(err); }
    };
    fetchTrending();
  }, []);

  // 1. Fetch Universities (Debounced Search & Pagination)
  const fetchUniversities = async (pageToFetch) => {
    setLoading(true);
    setError(null);
    try {
      const url = searchQuery 
        ? `${API_URL}/api/structure/universities?search=${encodeURIComponent(searchQuery)}&page=${pageToFetch}&limit=20`
        : `${API_URL}/api/structure/universities?page=${pageToFetch}&limit=20`;
        
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch universities');
      const data = await res.json();
      
      setUniversities(data.universities);
      setTotalPages(Math.ceil(data.total / 20));
      setPage(pageToFetch);
      setPageInput(pageToFetch.toString()); // Sync input with current page
      
    } catch (err) { 
      console.error(err);
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUniversities(1);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUniversities(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageInputSubmit = (e) => {
    if (e.key === 'Enter') {
      const newPage = parseInt(pageInput);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
        handlePageChange(newPage);
      } else {
        setPageInput(page.toString()); // Reset on invalid input
      }
    }
  };

  const handlePageInputBlur = () => {
     const newPage = parseInt(pageInput);
      if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
        handlePageChange(newPage);
      } else {
        setPageInput(page.toString()); // Reset on invalid input
      }
  };

  // 1.5 Fetch Current University (If ID exists)
  useEffect(() => {
    if (universityId) {
      const fetchCurrentUni = async () => {
        try {
          const res = await fetch(`${API_URL}/api/structure/universities/${universityId}`);
          if (res.ok) {
            const data = await res.json();
            setCurrentUniversity(data);
          }
        } catch (err) { console.error(err); }
      };
      fetchCurrentUni();
    } else {
      setCurrentUniversity(null);
    }
  }, [universityId]);

  // 2. Fetch Subjects (If University Selected)
  useEffect(() => {
    if (universityId) {
      const fetchSubjects = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`${API_URL}/api/structure/subjects/university/${universityId}`);
          if (!res.ok) throw new Error('Failed to fetch subjects');
          const data = await res.json();
          setSubjects(data);
        } catch (err) { 
          console.error(err);
          setError('Failed to load subjects. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchSubjects();
    }
  }, [universityId]);

  // 3. Fetch Notes (If Subject Selected OR Filters Applied)
  useEffect(() => {
    if (subjectId) {
      const fetchNotes = async () => {
        setLoading(true);
        setError(null);
        try {
          let url = `${API_URL}/api/notes?subject=${subjectId}`;
          if (filterCategory) url += `&category=${filterCategory}`;
          if (filterFileType) url += `&fileType=${filterFileType}`;
          if (filterDifficulty) url += `&difficulty=${filterDifficulty}`;
          
          const res = await fetch(url);
          if (!res.ok) throw new Error('Failed to fetch notes');
          const data = await res.json();
          setNotes(data);
        } catch (err) { 
          console.error(err);
          setError('Failed to load notes. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      fetchNotes();
    }
  }, [subjectId, filterCategory, filterFileType, filterDifficulty]);

  // Sync Current Subject from Subjects List
  useEffect(() => {
    if (subjectId && subjects.length > 0) {
      const sub = subjects.find(s => s._id === subjectId);
      setCurrentSubject(sub);
    }
  }, [subjectId, subjects]);

  // --- Sidebar Logic ---

  // Fetch Branches when Filter University changes
  useEffect(() => {
    if (filterUniversity) {
      const fetchBranches = async () => {
        try {
          const res = await fetch(`${API_URL}/api/structure/branches/${filterUniversity}`);
          const data = await res.json();
          setSidebarBranches(data);
        } catch (err) { console.error(err); }
      };
      fetchBranches();
    } else {
      setSidebarBranches([]);
    }
  }, [filterUniversity]);

  // Fetch Subjects when Filter Branch/Semester changes
  useEffect(() => {
    if (filterBranch && filterSemester) {
      const fetchSubjects = async () => {
        try {
          const res = await fetch(`${API_URL}/api/structure/subjects/${filterBranch}/${filterSemester}`);
          const data = await res.json();
          setSidebarSubjects(data);
        } catch (err) { console.error(err); }
      };
      fetchSubjects();
    } else {
      setSidebarSubjects([]);
    }
  }, [filterBranch, filterSemester]);

  // Handle Sidebar Navigation
  useEffect(() => {
    if (filterSubject) {
      router.push(`/notes/${filterUniversity}/${filterSubject}`);
    } else if (filterUniversity && filterUniversity !== universityId) {
       // Only navigate if strictly changing university via dropdown and NOT selecting a subject yet
       // But wait, if we just selected university in dropdown, we might want to go there?
       // Let's only do it if the user explicitly changes it.
       // Actually, simpler: The dropdowns drive navigation.
       router.push(`/notes/${filterUniversity}`);
    }
  }, [filterUniversity, filterSubject, router, universityId]);


  // --- Actions ---

  // Handle Like
  const handleLike = async (noteId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${API_URL}/api/notes/${noteId}/like`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?._id })
      });
      const data = await res.json();
      
      // Update local state
      setNotes(prev => prev.map(n => n._id === noteId ? { ...n, likes: data.likes } : n));
      setTrendingNotes(prev => prev.map(n => n._id === noteId ? { ...n, likes: data.likes } : n));
    } catch (err) {
      console.error('Failed to like note', err);
    }
  };

  // Handle Download
  const handleDownload = async (noteId, fileUrl) => {
    try {
      // 1. Increment Download Count
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${API_URL}/api/notes/${noteId}/download`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?._id })
      });
      const data = await res.json();
      
      // Update local state
      setNotes(prev => prev.map(n => n._id === noteId ? { ...n, downloads: data.downloads } : n));
      setTrendingNotes(prev => prev.map(n => n._id === noteId ? { ...n, downloads: data.downloads } : n));

      // 2. Open File
      window.open(fileUrl, '_blank');
    } catch (err) {
      console.error('Failed to download note', err);
      // Fallback if API fails
      window.open(fileUrl, '_blank');
    }
  };


  // --- Filter Logic ---

  // Filter Universities (Server-side handled now)
  const filteredUniversities = universities;

  // Filter Subjects (Folder View)
  // Filter Subjects (Folder View)
  let filteredSubjects = Array.isArray(subjects) ? subjects.filter(sub => {
    // 1. Search Filter
    const matchesSearch = sub.name.toLowerCase().includes(subjectFilter.toLowerCase()) ||
                          sub.code.toLowerCase().includes(subjectFilter.toLowerCase());
    
    // 2. Branch Filter
    // sub.branch can be an object (populated) or string (ID)
    const subBranchId = sub.branch?._id || sub.branch;
    const matchesBranch = !filterBranch || subBranchId === filterBranch;

    // 3. Semester Filter
    const matchesSemester = !filterSemester || sub.semester === parseInt(filterSemester);

    return matchesSearch && matchesBranch && matchesSemester;
  }) : [];

  // Deduplicate by Code for "All Branches" view to avoid clutter
  // Only if we are NOT filtering by a specific branch (where duplicates shouldn't exist ideally)
  // This prevents showing "CS301" twice if it exists in both CSE and ECE branches
  if (!filterBranch) {
    const uniqueCodes = new Set();
    filteredSubjects = filteredSubjects.filter(sub => {
      const code = sub.code.toUpperCase();
      if (uniqueCodes.has(code)) return false;
      uniqueCodes.add(code);
      return true;
    });
  }

  // Helper for Subject Colors
  const getSubjectColor = (name) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Error UI
  if (error) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h3 style={{ color: 'var(--text-muted)' }}>{error}</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
          We couldn't load the requested information. This might be due to a network issue or the server being down.
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.6rem 1.5rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb / Header */}
      <div className="page-header" style={{ textAlign: 'left', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link href="/notes" style={{ textDecoration: 'none', color: view === 'universities' ? 'var(--primary)' : 'inherit', display: 'flex', alignItems: 'center' }}>
            <School size={14} style={{ marginRight: '4px' }}/> Universities
          </Link>
          
          {universityId && (
            <>
              <ChevronRight size={14} />
              <Link href={`/notes/${universityId}`} style={{ textDecoration: 'none', color: view === 'subjects' ? 'var(--primary)' : 'inherit', display: 'flex', alignItems: 'center' }}>
                <Folder size={14} style={{ marginRight: '4px' }}/> {currentUniversity?.name || 'University'}
              </Link>
            </>
          )}
          {currentSubject && (
            <>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                <BookOpen size={14} style={{ marginRight: '4px' }}/> {currentSubject.name}
              </span>
            </>
          )}
        </div>

        <div className="header-actions">
          <div>
            <h1 className="page-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.5rem' }}>
              {view === 'universities' && 'Select University'}
              {view === 'subjects' && `Courses (${subjects.length})`}
              {view === 'notes' && currentSubject?.name}
            </h1>
            {view === 'notes' && <p className="page-subtitle" style={{ margin: 0 }}>{currentSubject?.code}</p>}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <button 
              className="btn-outline mobile-filter-btn" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} /> Filters
            </button>
            <Link href="/upload-note" className="btn-primary" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Upload Note
            </Link>
          </div>
        </div>
      </div>

      <div className="content-layout">
        
        {/* Filters Sidebar */}
        <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
          <div className="filter-header">
            <h3><Filter size={20} /> Filters</h3>
            <button onClick={() => { 
              setFilterUniversity(''); setFilterBranch(''); setFilterSemester(''); setFilterSubject(''); 
              setFilterCategory(''); setFilterFileType(''); setFilterDifficulty('');
              router.push('/notes'); 
            }} className="btn-clear">Clear All</button>
            <button className="close-sidebar-btn" onClick={() => setShowFilters(false)}><X size={20}/></button>
          </div>

          <div className="filter-content">
            
            {/* University & Branch (Keep as Selects for space efficiency but style them) */}
            <div className="filter-group">
              <label className="filter-label">University</label>
              <div className="custom-select-wrapper">
                <select 
                  value={filterUniversity} 
                  onChange={(e) => setFilterUniversity(e.target.value)} 
                  className="modern-select"
                >
                  <option value="">All Universities</option>
                  {universities.map(uni => (
                    <option key={uni._id} value={uni._id}>{uni.name}</option>
                  ))}
                </select>
                <ChevronRight size={16} className="select-arrow" />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Branch</label>
              <div className="custom-select-wrapper">
                <select 
                  value={filterBranch} 
                  onChange={(e) => setFilterBranch(e.target.value)} 
                  className="modern-select"
                  disabled={!filterUniversity}
                >
                  <option value="">All Branches</option>
                  {sidebarBranches.map(branch => (
                    <option key={branch._id} value={branch._id}>{branch.name}</option>
                  ))}
                </select>
                <ChevronRight size={16} className="select-arrow" />
              </div>
            </div>

            <div className="filter-divider"></div>

            {/* Semester - Number Grid */}
            <div className="filter-group">
              <label className="filter-label">Semester</label>
              <div className="semester-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <button
                    key={sem}
                    className={`sem-chip ${filterSemester == sem ? 'active' : ''}`}
                    onClick={() => setFilterSemester(filterSemester == sem ? '' : sem)}
                  >
                    {sem}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-divider"></div>
            
            {/* Document Type - Pills */}
            <div className="filter-group">
              <label className="filter-label">Document Type</label>
              <div className="pills-container">
                {['Notes', 'PPT', 'PYQ', 'Lab Manual', 'Assignment', 'Syllabus', 'E-Book'].map(cat => (
                  <button
                    key={cat}
                    className={`filter-pill ${filterCategory === cat ? 'active' : ''}`}
                    onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* File Format - Pills */}
            <div className="filter-group">
              <label className="filter-label">File Format</label>
              <div className="pills-container">
                {['pdf', 'docx', 'ppt', 'jpg'].map(fmt => (
                  <button
                    key={fmt}
                    className={`filter-pill ${filterFileType === fmt ? 'active' : ''}`}
                    onClick={() => setFilterFileType(filterFileType === fmt ? '' : fmt)}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-divider"></div>

            {/* Difficulty - Segmented Control */}
            <div className="filter-group">
              <label className="filter-label">Difficulty</label>
              <div className="segmented-control">
                {['Beginner', 'Intermediate', 'Advanced'].map(diff => (
                  <button
                    key={diff}
                    className={`segment-btn ${filterDifficulty === diff ? 'active' : ''}`}
                    onClick={() => setFilterDifficulty(filterDifficulty === diff ? '' : diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {showFilters && <div className="sidebar-overlay" onClick={() => setShowFilters(false)}></div>}

        {/* Main Content Area */}
        <main style={{ gridColumn: 'auto', width: '100%' }}>
          
          {/* VIEW 1: UNIVERSITIES */}
          {view === 'universities' && (
            <div>
              {/* Trending Section */}
              {trendingNotes.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#f59e0b' }}>🔥</span> Trending Notes
                  </h2>
                  <div className="trending-grid">
                    {trendingNotes.map(note => (
                      <motion.div 
                        key={note._id}
                        className="trending-card"
                        whileHover={{ y: -5 }}
                        onClick={() => router.push(`/notes/${note.university?._id}/${note.subject?._id}`)}
                      >
                        <div className="trending-icon">
                          <FileText size={24} color="var(--primary)" />
                        </div>
                        <div className="trending-info">
                          <h4>{note.title}</h4>
                          <p>{note.subject?.name}</p>
                          <div className="trending-stats">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDownload(note._id, note.fileUrl); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}
                            >
                              <Download size={12} /> {note.downloads}
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleLike(note._id); }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}
                            >
                              <ThumbsUp size={12} /> {note.likes}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search & Pagination Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                
                {/* Search Bar */}
                <div className="subject-search-container" style={{ flex: 1, minWidth: '300px', marginBottom: 0 }}>
                  <Search size={20} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search universities..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="subject-search-input"
                    style={{ padding: '0.8rem 1rem 0.8rem 2.8rem', fontSize: '1rem' }}
                  />
                </div>

                {/* Pagination Controls (Top) */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--card-bg)', padding: '0.3rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    <button 
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      style={{
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                        color: page === 1 ? 'var(--text-muted)' : 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.3rem'
                      }}
                      title="Previous Page"
                    >
                      <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                    
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Page 
                      <input 
                        type="text" 
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        onKeyDown={handlePageInputSubmit}
                        onBlur={handlePageInputBlur}
                        style={{
                          width: '40px',
                          textAlign: 'center',
                          padding: '0.2rem',
                          borderRadius: '0.3rem',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-main)',
                          fontSize: '0.9rem'
                        }}
                      />
                      of {totalPages}
                    </span>
                    
                    <button 
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      style={{
                        padding: '0.5rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: page === totalPages ? 'not-allowed' : 'pointer',
                        color: page === totalPages ? 'var(--text-muted)' : 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.3rem'
                      }}
                      title="Next Page"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="listings-grid">
                {loading ? <p>Loading universities...</p> : filteredUniversities.map(uni => (
                  <motion.div 
                    key={uni._id}
                    className="listing-card university-card"
                    whileHover={{ y: -5, borderColor: 'var(--primary)' }}
                    onClick={() => router.push(`/notes/${uni._id}`)}
                  >
                    <div className="uni-icon-box">
                      <School size={32} color="var(--primary)" />
                    </div>
                    <div className="uni-info">
                      <h3>{uni.name}</h3>
                      <p>{uni.location}</p>
                    </div>
                    <ChevronRight size={24} className="arrow-icon" />
                  </motion.div>
                ))}
              </div>

              

            </div>
          )}

          {/* VIEW 2: SUBJECTS (FOLDER VIEW) */}
          {view === 'subjects' && (
            <div className="subjects-layout">
              <div style={{ flex: 1 }}>
                <button onClick={() => router.push('/notes')} className="btn-outline" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: 'none', padding: 0, color: 'var(--text-muted)' }}>
                  <ArrowLeft size={16} /> Back to Universities
                </button>

                {/* Search Bar for Subjects */}
                <div className="subject-search-container">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search courses..." 
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="subject-search-input"
                  />
                </div>

                {/* Folders Grid */}
                <div className="folders-grid">
                  {loading ? <p>Loading courses...</p> : filteredSubjects.map(sub => {
                    const color = getSubjectColor(sub.name);
                    return (
                      <motion.div 
                        key={sub._id}
                        className="folder-card"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => router.push(`/notes/${universityId}/${sub._id}`)}
                        style={{ borderTop: `4px solid ${color}` }}
                      >
                        <div className="folder-icon-wrapper" style={{ background: `${color}15` }}>
                          <Folder size={28} fill={color} color={color} />
                        </div>
                        <div>
                          <h3 className="folder-title">{sub.name}</h3>
                          <p className="folder-code">{sub.code}</p>
                          <div className="folder-badges">
                            <span className="folder-badge" style={{ background: 'var(--surface-hover)' }}>Notes</span>
                            <span className="folder-badge" style={{ background: 'var(--surface-hover)' }}>PYQs</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: NOTES LIST */}
          {view === 'notes' && (
            <div>
              <button onClick={() => router.push(`/notes/${universityId}`)} className="btn-outline" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} /> Back to Courses
              </button>

              <div className="listings-grid">
                {loading ? <p>Loading notes...</p> : notes.length === 0 ? (
                  <div className="empty-state">
                    <FileText size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <p>No notes uploaded for this course yet.</p>
                    <Link href="/upload-note" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                      Be the first to upload
                    </Link>
                  </div>
                ) : notes.map(note => (
                  <motion.div 
                    key={note._id} 
                    className="listing-card note-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="listing-header">
                      <div className="listing-role-info">
                        <h3>{note.title}</h3>
                        <p className="company-name">{note.description}</p>
                      </div>
                      <div className={`file-type-badge ${note.fileType}`}>
                        {note.fileType?.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="listing-details">
                      <span className="detail-pill"><User size={14} /> {note.uploader?.name || 'Anon'}</span>
                      <button 
                        className="detail-pill btn-like" 
                        onClick={(e) => { e.stopPropagation(); handleLike(note._id); }}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ThumbsUp size={14} /> {note.likes}
                      </button>
                      <span className="detail-pill"><Download size={14} /> {note.downloads}</span>
                    </div>

                    <div className="listing-footer">
                      <div className="listing-tags">
                        {note.tags.map(tag => <span key={tag} className="listing-tag">#{tag}</span>)}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDownload(note._id, note.fileUrl); }}
                        className="btn-download"
                        style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Download size={16} /> Download
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        /* Responsive Header */
        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 1rem;
        }

        /* Sidebar & Overlay */
        .filters-sidebar {
          background: var(--surface);
          border-right: 1px solid var(--border);
          width: 280px;
          height: 100%;
          position: fixed;
          top: 70px; /* Below Navbar */
          left: 0;
          bottom: 0;
          z-index: 100;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          overflow-y: auto;
          padding: 1.5rem;
        }
        
        .filters-sidebar.show {
          transform: translateX(0);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 90;
          display: none;
        }

        .close-sidebar-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: none;
        }

        /* Desktop Sidebar */
        @media (min-width: 1024px) {
          .content-layout {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 2rem;
          }
          .filters-sidebar {
            position: sticky;
            top: 90px;
            height: fit-content;
            transform: none;
            border: 1px solid var(--border);
            border-radius: 16px;
            z-index: 1;
            width: auto;
          }
          .mobile-filter-btn {
            display: none !important;
          }
          .close-sidebar-btn {
            display: none;
          }
        }

        @media (max-width: 1023px) {
          .sidebar-overlay {
            display: block;
          }
          .close-sidebar-btn {
            display: block;
          }
        }

        /* University Card */
        .university-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
        }
        .uni-icon-box {
          width: 50px;
          height: 50px;
          background: var(--surface-hover);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .uni-info h3 {
          font-size: 1.1rem;
          margin-bottom: 0.2rem;
          color: var(--text-main);
        }
        .uni-info p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .arrow-icon {
          margin-left: auto;
          color: var(--text-muted);
        }

        /* Subject Search */
        .subject-search-container {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .subject-search-input {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 0.8rem 1rem 0.8rem 2.5rem;
          border-radius: 12px;
          color: var(--text-main);
          font-size: 1rem;
        }
        .subject-search-input:focus {
          outline: none;
          border-color: var(--primary);
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        /* Folders Grid */
        .folders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        .folder-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.2rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .folder-card:hover {
          background: var(--surface-hover);
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        .folder-icon-wrapper {
          background: rgba(34, 197, 94, 0.1);
          padding: 0.6rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .folder-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.3;
        }
        .folder-code {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Note Card */
        .note-card {
          padding: 1.5rem;
        }
        .listing-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1rem;
        }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
          background: var(--surface);
          border-radius: 16px;
          border: 1px solid var(--border);
        }
        /* Trending Section */
        .trending-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .trending-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .trending-card:hover {
          border-color: var(--primary);
          background: var(--surface-hover);
        }
        .trending-icon {
          width: 40px;
          height: 40px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .trending-info h4 {
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }
        .trending-info p {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }
        .trending-stats {
          display: flex;
          gap: 0.8rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .trending-stats span {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        /* Folder Badges */
        .folder-badges {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .folder-badge {
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-muted);
          border: 1px solid var(--border);
        }

        /* Filter Divider */
        .filter-divider {
          height: 1px;
          background: var(--border);
          margin: 1.5rem 0;
        }

        /* --- New Modern Filter Styles --- */
        .filter-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Custom Select */
        .custom-select-wrapper {
          position: relative;
        }
        .modern-select {
          width: 100%;
          padding: 0.8rem 1rem;
          background: var(--surface-hover);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-main);
          font-size: 0.95rem;
          appearance: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modern-select:hover {
          border-color: var(--primary);
        }
        .modern-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        .select-arrow {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          pointer-events: none;
          color: var(--text-muted);
        }

        /* Semester Grid */
        .semester-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }
        .sem-chip {
          background: var(--surface-hover);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.6rem 0;
          color: var(--text-main);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sem-chip:hover {
          background: var(--border);
        }
        .sem-chip.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        /* Pills Container */
        .pills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .filter-pill {
          background: var(--surface-hover);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-pill:hover {
          border-color: var(--text-muted);
          color: var(--text-main);
        }
        .filter-pill.active {
          background: rgba(99, 102, 241, 0.15);
          color: var(--primary);
          border-color: var(--primary);
          font-weight: 500;
        }

        /* Segmented Control */
        .segmented-control {
          display: flex;
          background: var(--surface-hover);
          padding: 4px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .segment-btn {
          flex: 1;
          background: transparent;
          border: none;
          padding: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .segment-btn.active {
          background: var(--surface);
          color: var(--text-main);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-weight: 500;
        }

      `}</style>
    </div>
  );
};

export default Notes;
