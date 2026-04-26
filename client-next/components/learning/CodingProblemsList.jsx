"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, ChevronRight, Loader } from 'lucide-react';
import axios from 'axios';
import API_URL from '@/lib/api';
import './CodingProblemsList.css';

const CodingProblemsList = ({ onStart }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/coding-problems`);
        setProblems(res.data);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError('Failed to load problems. Please make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="coding-problems-list">
        <div className="problems-grid">
            {problems.map((problem, index) => (
                <motion.div
                    key={problem._id}
                    className="problem-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onStart(problem._id)}
                >
                    <div className="card-content">
                        <div className="card-header">
                            <div className={`icon-wrapper ${getDifficultyClass(problem.difficulty)}`}>
                                <Terminal size={20} className={getDifficultyClass(problem.difficulty, true)} />
                            </div>
                            <span className={`badge ${getDifficultyClass(problem.difficulty)}`}>
                                {problem.difficulty}
                            </span>
                        </div>

                        <h3>{problem.title}</h3>
                        
                        <div className="problem-meta">
                            <span className="meta-icon">
                                <Code size={14} />
                                Coding
                            </span>
                            <span className="meta-dot">•</span>
                            <span>{problem.tags && problem.tags.join(', ')}</span> 
                        </div>
                    </div>
                    
                    <div className="card-footer">
                        <span className="solve-text">Solve Challenge</span>
                        <ChevronRight size={16} className="arrow-icon" />
                    </div>
                </motion.div>
            ))}
        </div>
        
        {problems.length === 0 && (
             <div className="empty-state-list">
                <Code className="mx-auto text-gray-300 mb-3" size={48} />
                <h3 className="text-lg font-medium text-gray-600">No problems found</h3>
                <p className="text-gray-400 mt-1">Check back later for new coding challenges.</p>
             </div>
        )}
    </div>
  );
};

const getDifficultyClass = (difficulty, isText = false) => {
    const diff = difficulty?.toLowerCase();
    if (isText) {
        if (diff === 'easy') return 'text-easy';
        if (diff === 'medium') return 'text-medium';
        return 'text-hard';
    } else {
         if (diff === 'easy') return 'bg-easy';
        if (diff === 'medium') return 'bg-medium';
        return 'bg-hard';
    }
};

export default CodingProblemsList;
