"use client";

import React, { useState } from 'react';
import { X, Copy, Check, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateShareURL,
  generateShareText,
  shareVia,
  generateQRCode,
  trackShare,
} from '@/utils/shareUtils';
import {
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaTelegram,
  FaEnvelope,
} from 'react-icons/fa';
import './ShareModal.css';

/**
 * Universal Share Modal Component
 * Works for internships, scholarships, jobs, courses, etc.
 * 
 * @param {object} item - The item to share (must have id, title, etc.)
 * @param {string} type - Type of content ('internship', 'scholarship', 'job', 'course')
 * @param {boolean} isOpen - Modal open state
 * @param {function} onClose - Close modal callback
 */
const ShareModal = ({ item, type = 'internship', isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  // Generate shareable URL
  const shareURL = generateShareURL(type, item._id || item.id, {
    utm_source: 'share',
    utm_medium: 'social',
  });

  // Generate share text
  const shareText = generateShareText(item, type);

  // Handle copy link
  const handleCopyLink = async () => {
    const result = await shareVia.copyLink(shareURL);
    if (result.success) {
      setCopied(true);
      trackShare(type, item._id || item.id, 'copy_link');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share handlers
  const handleShare = (platform) => {
    trackShare(type, item._id || item.id, platform);
    
    switch (platform) {
      case 'whatsapp':
        shareVia.whatsapp(shareText, shareURL);
        break;
      case 'twitter':
        shareVia.twitter(shareText, shareURL);
        break;
      case 'linkedin':
        shareVia.linkedin(shareURL);
        break;
      case 'facebook':
        shareVia.facebook(shareURL);
        break;
      case 'telegram':
        shareVia.telegram(shareText, shareURL);
        break;
      case 'email':
        shareVia.email(
          `Check out this ${type}!`,
          shareText,
          shareURL
        );
        break;
      default:
        break;
    }
  };

  const shareOptions = [
    { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', key: 'whatsapp' },
    { name: 'Twitter', icon: FaTwitter, color: '#1DA1F2', key: 'twitter' },
    { name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2', key: 'linkedin' },
    { name: 'Facebook', icon: FaFacebook, color: '#1877F2', key: 'facebook' },
    { name: 'Telegram', icon: FaTelegram, color: '#0088cc', key: 'telegram' },
    { name: 'Email', icon: FaEnvelope, color: '#EA4335', key: 'email' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="share-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="share-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="share-modal-header">
            <h3>Share {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="share-modal-content">
            {/* Copy Link Section */}
            <div className="copy-link-section">
              <input
                type="text"
                value={shareURL}
                readOnly
                className="share-url-input"
              />
              <button
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Share Options */}
            <div className="share-options">
              <p className="share-label">Share via:</p>
              <div className="share-buttons">
                {shareOptions.map((option) => (
                  <button
                    key={option.key}
                    className="share-platform-btn"
                    onClick={() => handleShare(option.key)}
                    style={{ '--platform-color': option.color }}
                  >
                    <option.icon size={24} />
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code Section */}
            <div className="qr-section">
              <button
                className="qr-toggle-btn"
                onClick={() => setShowQR(!showQR)}
              >
                <QrCode size={18} />
                <span>{showQR ? 'Hide' : 'Show'} QR Code</span>
              </button>
              
              {showQR && (
                <motion.div
                  className="qr-code-display"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <img
                    src={generateQRCode(shareURL)}
                    alt="QR Code"
                    className="qr-code-image"
                  />
                  <p className="qr-hint">Scan to open on mobile</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareModal;
