"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-col">
          <Link href="/" className="footer-logo">
            Startup<span className="highlight">Ed</span>
          </Link>
          <p className="footer-desc">
            The ultimate platform for students to find internships, jobs, competitions, and mentorships. 
            Kickstart your career with us today.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
            <a href="#" className="social-icon"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3>Opportunities</h3>
          <ul className="footer-links">
            <li><Link href="/internships">Internships</Link></li>
            <li><Link href="/jobs">Jobs</Link></li>
            <li><Link href="/competitions">Competitions</Link></li>
            <li><Link href="/hackathons">Hackathons</Link></li>
            <li><Link href="/scholarships">Scholarships</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-col">
          <h3>Resources</h3>
          <ul className="footer-links">
            <li><Link href="/blogs">Blogs</Link></li>
            <li><Link href="/courses">Courses</Link></li>
            <li><Link href="/notes">University Notes</Link></li>
            <li><Link href="/practice">Coding Practice</Link></li>
            <li><Link href="/mentorships">Mentorships</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul className="contact-links">
            <li>
              <Mail size={16} />
              <span>support@startuped.com</span>
            </li>
            <li>
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>Bangalore, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Startup Education. All rights reserved.</p>
        <p className="made-with">
          Made with <Heart size={14} fill="var(--secondary)" color="var(--secondary)" /> for Students
        </p>
      </div>
    </footer>
  );
};

export default Footer;
