const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const jobs = [
  {
    role: 'Senior Frontend Developer',
    company: 'TechCorp Solutions',
    companyWebsite: 'https://google.com',
    logo: 'https://ui-avatars.com/api/?name=Tech+Corp&background=0D8ABC&color=fff',
    location: 'Bangalore, India',
    salary: '₹18,00,000 - ₹25,00,000/year',
    experience: '3-5 years',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    category: 'Engineering',
    tags: ['React', 'Redux', 'TypeScript', 'Tailwind'],
    workType: 'Full Time',
    workingDays: '5 Days/Week',
    userType: 'Experienced',
    responsibilities: [
      'Architect and build scalable frontend applications',
      'Mentor junior developers',
      'Collaborate with product and design teams'
    ],
    skills: ['React', 'JavaScript', 'CSS', 'System Design'],
    perks: ['Health Insurance', 'Stock Options', 'Remote Work'],
    organizer: { name: 'Sarah Jenkins', email: 'sarah@techcorp.com' }
  },
  {
    role: 'Product Designer',
    company: 'Creative Studio',
    companyWebsite: 'https://dribbble.com',
    logo: 'https://ui-avatars.com/api/?name=Creative+Studio&background=FF5722&color=fff',
    location: 'Mumbai, India',
    salary: '₹12,00,000 - ₹18,00,000/year',
    experience: '2-4 years',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    category: 'Design',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
    workType: 'Full Time',
    workingDays: '5 Days/Week',
    userType: 'Professional',
    responsibilities: [
      'Create user-centered designs',
      'Conduct user research',
      'Build high-fidelity prototypes'
    ],
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    perks: ['Creative Environment', 'Annual Retreat', 'Learning Budget'],
    organizer: { name: 'Mike Ross', email: 'mike@creativestudio.com' }
  },
  {
    role: 'Backend Engineer',
    company: 'FinTech Innovators',
    companyWebsite: 'https://github.com',
    logo: 'https://ui-avatars.com/api/?name=FinTech&background=4CAF50&color=fff',
    location: 'Remote',
    salary: '₹20,00,000 - ₹30,00,000/year',
    experience: '4+ years',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    category: 'Engineering',
    tags: ['Node.js', 'PostgreSQL', 'AWS', 'Microservices'],
    workType: 'Full Time',
    workingDays: 'Flexible',
    userType: 'Experienced',
    responsibilities: [
      'Design and implement secure APIs',
      'Optimize database performance',
      'Manage cloud infrastructure'
    ],
    skills: ['Node.js', 'Python', 'SQL', 'Docker'],
    perks: ['Remote First', 'Performance Bonus', 'Wellness Allowance'],
    organizer: { name: 'David Lee', email: 'david@fintech.io' }
  },
  {
    role: 'Marketing Manager',
    company: 'Growth Hackers',
    companyWebsite: 'https://hubspot.com',
    logo: 'https://ui-avatars.com/api/?name=Growth&background=9C27B0&color=fff',
    location: 'Delhi, India',
    salary: '₹10,00,000 - ₹15,00,000/year',
    experience: '2-3 years',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    category: 'Marketing',
    tags: ['SEO', 'Content Marketing', 'Analytics'],
    workType: 'Full Time',
    workingDays: '6 Days/Week',
    userType: 'Professional',
    responsibilities: [
      'Develop marketing strategies',
      'Manage social media campaigns',
      'Analyze market trends'
    ],
    skills: ['Google Analytics', 'SEO', 'Copywriting'],
    perks: ['Commission', 'Travel Opportunities'],
    organizer: { name: 'Emily Chen', email: 'emily@growthhackers.com' }
  },
  {
    role: 'Junior React Developer',
    company: 'StartUp Inc',
    companyWebsite: 'https://reactjs.org',
    logo: 'https://ui-avatars.com/api/?name=StartUp&background=FFC107&color=fff',
    location: 'Pune, India',
    salary: '₹6,00,000 - ₹9,00,000/year',
    experience: '0-1 years',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    category: 'Engineering',
    tags: ['React', 'JavaScript', 'HTML/CSS'],
    workType: 'Full Time',
    workingDays: '5 Days/Week',
    userType: 'Fresher',
    responsibilities: [
      'Assist in frontend development',
      'Fix bugs and improve UI',
      'Learn from senior developers'
    ],
    skills: ['React', 'JavaScript', 'Git'],
    perks: ['Mentorship', 'Free Snacks', 'Casual Dress Code'],
    organizer: { name: 'Alex Turner', email: 'alex@startup.inc' }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Job.deleteMany({});
    console.log('Cleared Jobs collection');

    await Job.insertMany(jobs);
    console.log('Seeded Jobs');

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
