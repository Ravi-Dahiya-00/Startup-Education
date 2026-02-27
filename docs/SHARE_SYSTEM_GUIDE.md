# Universal Share System - Complete Guide

## 🎯 Features

✅ **Multiple Platforms**: WhatsApp, Twitter, LinkedIn, Facebook, Telegram, Email  
✅ **Copy Link**: One-click copy to clipboard  
✅ **QR Code**: Generate QR code for mobile sharing  
✅ **Universal**: Works for internships, scholarships, jobs, courses, etc.  
✅ **Analytics**: Built-in share tracking  
✅ **SEO Friendly**: UTM parameters for tracking  
✅ **Mobile Optimized**: Native share API support  
✅ **Beautiful UI**: Dark/Light theme support  

---

## 📦 Installation

```bash
cd client
npm install react-icons
```

---

## 🚀 Quick Start

### Step 1: Import ShareModal

```javascript
import ShareModal from '../components/ShareModal';
import '../components/ShareModal.css';
```

### Step 2: Add State

```javascript
const [shareModalOpen, setShareModalOpen] = useState(false);
const [itemToShare, setItemToShare] = useState(null);
```

### Step 3: Add Share Button

```javascript
<button onClick={() => {
  setItemToShare(internship);
  setShareModalOpen(true);
}}>
  <Share2 size={18} />
  Share
</button>
```

### Step 4: Add ShareModal Component

```javascript
<ShareModal
  item={itemToShare}
  type="internship"
  isOpen={shareModalOpen}
  onClose={() => setShareModalOpen(false)}
/>
```

---

## 📚 Usage Examples

### For Internships

```javascript
const internship = {
  _id: '123456',
  role: 'Frontend Developer',
  company: 'Google',
  stipend: '₹50,000/month',
  location: 'Bangalore',
};

<ShareModal
  item={internship}
  type="internship"
  isOpen={shareModalOpen}
  onClose={() => setShareModalOpen(false)}
/>
```

### For Scholarships

```javascript
const scholarship = {
  _id: '789012',
  title: 'Merit Scholarship 2024',
  amount: '₹1,00,000',
  deadline: 'Dec 31, 2024',
};

<ShareModal
  item={scholarship}
  type="scholarship"
  isOpen={shareModalOpen}
  onClose={() => setShareModalOpen(false)}
/>
```

### For Jobs

```javascript
const job = {
  _id: '345678',
  role: 'Full Stack Developer',
  company: 'Microsoft',
  salary: '₹15-20 LPA',
  location: 'Hyderabad',
};

<ShareModal
  item={job}
  type="job"
  isOpen={shareModalOpen}
  onClose={() => setShareModalOpen(false)}
/>
```

### For Courses

```javascript
const course = {
  _id: '901234',
  title: 'React Masterclass',
  institution: 'Udemy',
  duration: '30 hours',
};

<ShareModal
  item={course}
  type="course"
  isOpen={shareModalOpen}
  onClose={() => setShareModalOpen(false)}
/>
```

---

## 🔧 Using Share Utils Directly

### Generate Share URL

```javascript
import { generateShareURL } from '../utils/shareUtils';

const url = generateShareURL('internship', '123456', {
  utm_source: 'email',
  utm_medium: 'newsletter',
});
// Output: https://yoursite.com/internship/123456?utm_source=email&utm_medium=newsletter
```

### Share via WhatsApp (without modal)

```javascript
import { shareVia, generateShareText, generateShareURL } from '../utils/shareUtils';

const handleQuickShare = () => {
  const url = generateShareURL('internship', item._id);
  const text = generateShareText(item, 'internship');
  shareVia.whatsapp(text, url);
};
```

### Copy Link Only

```javascript
import { shareVia, generateShareURL } from '../utils/shareUtils';

const handleCopyLink = async () => {
  const url = generateShareURL('internship', item._id);
  const result = await shareVia.copyLink(url);
  if (result.success) {
    alert('Link copied!');
  }
};
```

---

## 🎨 Customization

### Custom Share Text Templates

Edit `shareUtils.js`:

```javascript
const templates = {
  internship: `🚀 ${item.role} at ${item.company}\n💰 ${item.stipend}\n📍 ${item.location}\n\nApply now:`,
  // Add your custom template
  event: `🎉 ${item.title}\n📅 ${item.date}\n📍 ${item.venue}\n\nRegister:`,
};
```

### Add More Platforms

In `ShareModal.jsx`:

```javascript
import { FaReddit } from 'react-icons/fa';

const shareOptions = [
  // ... existing options
  { name: 'Reddit', icon: FaReddit, color: '#FF4500', key: 'reddit' },
];

// In shareVia object (shareUtils.js)
reddit: (title, url) => {
  window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
},
```

---

## 📊 Analytics Integration

### Google Analytics

The share system automatically tracks shares if Google Analytics is installed:

```javascript
// In shareUtils.js - already implemented
if (window.gtag) {
  window.gtag('event', 'share', {
    content_type: 'internship',
    content_id: '123456',
    method: 'whatsapp',
  });
}
```

### Custom Analytics

Add your own tracking in `shareUtils.js`:

```javascript
export const trackShare = (type, id, platform) => {
  // Send to your backend
  fetch('/api/analytics/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, id, platform, timestamp: new Date() }),
  });
};
```

---

## 🔗 URL Structure

Generated URLs follow this pattern:

```
https://yoursite.com/{type}/{id}?utm_source=share&utm_medium=social
```

Examples:
- `https://yoursite.com/internship/123456?utm_source=share&utm_medium=social`
- `https://yoursite.com/scholarship/789012?utm_source=share&utm_medium=social`
- `https://yoursite.com/job/345678?utm_source=share&utm_medium=social`

---

## 📱 Mobile Support

The system automatically uses:
- **Desktop**: Custom share modal with all platforms
- **Mobile**: Native share sheet (if available) + fallback to custom modal

```javascript
// Native share (auto-detects mobile)
if (navigator.share) {
  await navigator.share({
    title: 'Frontend Developer at Google',
    text: 'Check out this internship!',
    url: 'https://yoursite.com/internship/123456',
  });
}
```

---

## 🎯 Complete Integration Example

```javascript
import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import ShareModal from '../components/ShareModal';
import '../components/ShareModal.css';

const InternshipCard = ({ internship }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  return (
    <div className="card">
      <h3>{internship.role}</h3>
      <p>{internship.company}</p>
      
      <button
        className="share-btn"
        onClick={() => setShareModalOpen(true)}
      >
        <Share2 size={18} />
        Share
      </button>

      <ShareModal
        item={internship}
        type="internship"
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
};
```

---

## 🚀 Next Steps

1. ✅ Import ShareModal in Internships page
2. ✅ Add share button to cards
3. ✅ Customize share text templates
4. ✅ Set up analytics tracking
5. ✅ Test on mobile devices

Your universal share system is ready to use! 🎉
