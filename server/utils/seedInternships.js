const mongoose = require('mongoose');
const Internship = require('../models/Internship');
require('dotenv').config();

const dummyInternships = [
  {
    role: 'Software Engineering Intern',
    company: 'Google',
    location: 'Bangalore, India',
    stipend: '₹80,000/month',
    duration: '3 Months',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    category: 'Engineering',
    tags: ['Java', 'Python', 'C++'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png'
  },
  {
    role: 'Product Design Intern',
    company: 'Airbnb',
    location: 'Remote',
    stipend: '₹45,000/month',
    duration: '6 Months',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    category: 'Design',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/1200px-Airbnb_Logo_B%C3%A9lo.svg.png'
  },
  {
    role: 'Data Science Intern',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    stipend: '₹70,000/month',
    duration: '2 Months',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    category: 'Data Science',
    tags: ['Python', 'Machine Learning', 'SQL'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png'
  },
  {
    role: 'Marketing Intern',
    company: 'Zomato',
    location: 'Gurgaon, India',
    stipend: '₹25,000/month',
    duration: '3 Months',
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Expired 2 days ago
    category: 'Marketing',
    tags: ['Social Media', 'SEO', 'Content Writing'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png'
  },
  {
    role: 'Backend Developer Intern',
    company: 'Razorpay',
    location: 'Bangalore, India',
    stipend: '₹50,000/month',
    duration: '6 Months',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Ends tomorrow
    category: 'Engineering',
    tags: ['Node.js', 'Go', 'PostgreSQL'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg'
  }
];

async function seedInternships() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    // Optional: Clear existing if you want a fresh start
    // await Internship.deleteMany({}); 

    await Internship.insertMany(dummyInternships);
    console.log(`Added ${dummyInternships.length} dummy internships.`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedInternships();
