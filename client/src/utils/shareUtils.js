/**
 * Universal Share Utility
 * Generate shareable URLs for any opportunity (internships, scholarships, jobs, etc.)
 */

/**
 * Generate unique shareable URL
 * @param {string} type - Type of content (internship, scholarship, job, course, etc.)
 * @param {string} id - Unique ID of the item
 * @param {object} metadata - Optional metadata for the URL
 * @returns {string} - Full shareable URL
 */
export const generateShareURL = (type, id, metadata = {}) => {
  const baseURL = window.location.origin;
  const path = `/${type}/${id}`;
  
  // Add optional query parameters
  const params = new URLSearchParams();
  if (metadata.ref) params.append('ref', metadata.ref); // Referral tracking
  if (metadata.utm_source) params.append('utm_source', metadata.utm_source);
  if (metadata.utm_medium) params.append('utm_medium', metadata.utm_medium);
  
  const queryString = params.toString();
  return `${baseURL}${path}${queryString ? `?${queryString}` : ''}`;
};

/**
 * Generate short shareable text
 * @param {object} item - Item to share (must have title, company, etc.)
 * @param {string} type - Type of opportunity
 * @returns {string} - Formatted share text
 */
export const generateShareText = (item, type = 'internship') => {
  const templates = {
    internship: `🚀 ${item.role} at ${item.company}\n💰 ${item.stipend}\n📍 ${item.location}\n\nApply now:`,
    scholarship: `🎓 ${item.title}\n💵 Amount: ${item.amount}\n📅 Deadline: ${item.deadline}\n\nApply here:`,
    job: `💼 ${item.role} at ${item.company}\n💰 ${item.salary}\n📍 ${item.location}\n\nApply now:`,
    course: `📚 ${item.title}\n🏫 ${item.institution}\n⏱️ ${item.duration}\n\nLearn more:`,
  };
  
  return templates[type] || `Check out this ${type}:`;
};

/**
 * Share via different platforms
 */
export const shareVia = {
  /**
   * Copy link to clipboard
   */
  copyLink: async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      return { success: true, message: 'Link copied to clipboard!' };
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return { success: true, message: 'Link copied!' };
      } catch (e) {
        document.body.removeChild(textArea);
        return { success: false, message: 'Failed to copy link' };
      }
    }
  },

  /**
   * Share via WhatsApp
   */
  whatsapp: (text, url) => {
    const message = encodeURIComponent(`${text}\n${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  },

  /**
   * Share via Twitter/X
   */
  twitter: (text, url) => {
    const tweet = encodeURIComponent(text);
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweet}&url=${shareUrl}`,
      '_blank',
      'width=550,height=420'
    );
  },

  /**
   * Share via LinkedIn
   */
  linkedin: (url) => {
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      '_blank',
      'width=550,height=420'
    );
  },

  /**
   * Share via Facebook
   */
  facebook: (url) => {
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      '_blank',
      'width=550,height=420'
    );
  },

  /**
   * Share via Telegram
   */
  telegram: (text, url) => {
    const message = encodeURIComponent(`${text}\n${url}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  },

  /**
   * Share via Email
   */
  email: (subject, body, url) => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + '\n\n' + url)}`;
    window.location.href = mailtoLink;
  },

  /**
   * Native share (Mobile)
   */
  native: async (title, text, url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        return { success: true, message: 'Shared successfully!' };
      } catch (err) {
        if (err.name !== 'AbortError') {
          return { success: false, message: 'Failed to share' };
        }
        return { success: false, message: 'Share cancelled' };
      }
    } else {
      return { success: false, message: 'Native share not supported' };
    }
  },
};

/**
 * Generate QR Code data URL for a link
 * @param {string} url - URL to encode
 * @returns {string} - QR code API URL
 */
export const generateQRCode = (url) => {
  // Using free QR code API
  const encodedUrl = encodeURIComponent(url);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`;
};

/**
 * Track share events (for analytics)
 * @param {string} type - Type of content
 * @param {string} id - Item ID
 * @param {string} platform - Share platform
 */
export const trackShare = (type, id, platform) => {
  // Send to your analytics
  console.log('Share tracked:', { type, id, platform, timestamp: new Date() });
  
  // Example: Google Analytics
  if (window.gtag) {
    window.gtag('event', 'share', {
      content_type: type,
      content_id: id,
      method: platform,
    });
  }
  
  // Example: Custom analytics endpoint
  // fetch('/api/analytics/share', {
  //   method: 'POST',
  //   body: JSON.stringify({ type, id, platform })
  // });
};

export default {
  generateShareURL,
  generateShareText,
  shareVia,
  generateQRCode,
  trackShare,
};
