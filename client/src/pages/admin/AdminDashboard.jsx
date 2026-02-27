import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Trophy, BookOpen, FileText, GraduationCap, PenTool, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const adminModules = [
    {
      title: 'Internships',
      desc: 'Manage internship postings',
      icon: Briefcase,
      link: '/admin/internships',
      color: 'blue'
    },
    {
      title: 'Jobs',
      desc: 'Manage full-time job listings',
      icon: Briefcase,
      link: '/admin/jobs',
      color: 'violet'
    },
    {
      title: 'Competitions',
      desc: 'Manage hackathons & challenges',
      icon: Trophy,
      link: '/admin/competitions',
      color: 'pink'
    },
    {
      title: 'Courses',
      desc: 'Manage learning courses',
      icon: BookOpen,
      link: '/admin/courses', // To be built
      color: 'indigo'
    },
    {
      title: 'Blogs',
      desc: 'Manage blog posts',
      icon: PenTool,
      link: '/admin/blogs', // To be built
      color: 'orange'
    },
    {
      title: 'Scholarships',
      desc: 'Manage scholarship programs',
      icon: GraduationCap,
      link: '/admin/scholarships', // To be built
      color: 'green'
    },
    {
      title: 'University Notes',
      desc: 'Manage study materials',
      icon: FileText,
      link: '/admin/notes', // To be built
      color: 'cyan'
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin <span className="text-highlight">Dashboard</span></h1>
        <p className="page-subtitle">Central hub to manage all platform content.</p>
      </div>

      <div className="dashboard-grid">
        {adminModules.map((module, index) => (
          <Link to={module.link} key={index} style={{ textDecoration: 'none' }}>
            <motion.div 
              className="dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
            >
              <div className={`icon-wrapper bg-${module.color}`}>
                <module.icon size={24} color="white" />
              </div>
              <h3>{module.title}</h3>
              <p>{module.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
