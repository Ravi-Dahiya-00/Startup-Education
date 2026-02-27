const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Internship = require('./models/Internship');
const Job = require('./models/Job');
const Course = require('./models/Course');
const Scholarship = require('./models/Scholarship');
const Blog = require('./models/Blog');
const Competition = require('./models/Competition');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/startup_education';

// Sample Users Data
const users = [
  {
    name: 'Admin User',
    email: 'admin@startuped.com',
    password: 'admin123',
    username: 'admin',
    role: 'admin',
    institution: 'Startup Education',
    branch: 'Computer Science',
    batch: '2024',
    skills: ['Management', 'Leadership', 'Tech']
  },
  {
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    password: 'password123',
    username: 'ravi_kumar',
    role: 'student',
    institution: 'IIT Delhi',
    branch: 'Computer Science',
    batch: '2025',
    semester: 6,
    subjects: ['DBMS', 'Operating Systems', 'AI'],
    skills: ['JavaScript', 'React', 'Node.js', 'Python']
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    username: 'priya_sharma',
    role: 'student',
    institution: 'BITS Pilani',
    branch: 'Electronics',
    batch: '2024',
    semester: 8,
    subjects: ['VLSI', 'Embedded Systems'],
    skills: ['C++', 'Java', 'Machine Learning']
  },
  {
    name: 'Dr. Amit Verma',
    email: 'amit@example.com',
    password: 'password123',
    username: 'dr_amit',
    role: 'teacher',
    institution: 'Delhi University',
    branch: 'Computer Science',
    skills: ['Teaching', 'Research', 'AI']
  }
];

// Sample Internships
const internships = [
  {
    role: 'Software Development Intern',
    title: 'Software Development Intern',
    company: 'Google India',
    location: 'Bangalore',
    duration: '3 months',
    stipend: '₹50,000/month',
    description: 'Work on cutting-edge projects with Google engineers. Learn and grow in a collaborative environment.',
    requirements: ['Strong programming skills', 'Knowledge of Data Structures', 'Team player'],
    applyLink: 'https://careers.google.com',
    deadline: new Date('2025-02-28'),
    category: 'Engineering',
    tags: ['Tech', 'Software', 'Full-time'],
    responsibilities: ['Write clean code', 'Collaborate with team', 'Learn new technologies'],
    skills: ['JavaScript', 'Python', 'Data Structures']
  },
  {
    role: 'Data Science Intern',
    title: 'Data Science Intern',
    company: 'Microsoft',
    location: 'Hyderabad',
    duration: '6 months',
    stipend: '₹45,000/month',
    description: 'Join our data science team to work on machine learning projects and big data analytics.',
    requirements: ['Python', 'Machine Learning', 'Statistics'],
    applyLink: 'https://careers.microsoft.com',
    deadline: new Date('2025-03-15'),
    category: 'Data Science',
    tags: ['Data Science', 'ML', 'Analytics'],
    responsibilities: ['Data analysis', 'Build ML models', 'Present findings'],
    skills: ['Python', 'Machine Learning', 'Statistics']
  },
  {
    role: 'Frontend Developer Intern',
    title: 'Frontend Developer Intern',
    company: 'Flipkart',
    location: 'Bangalore',
    duration: '4 months',
    stipend: '₹35,000/month',
    description: 'Build beautiful and responsive user interfaces for millions of users.',
    requirements: ['React', 'JavaScript', 'CSS', 'HTML'],
    applyLink: 'https://www.flipkartcareers.com',
    deadline: new Date('2025-02-20'),
    category: 'Engineering',
    tags: ['Frontend', 'React', 'UI/UX'],
    responsibilities: ['Develop UI components', 'Optimize performance', 'Work with designers'],
    skills: ['React', 'JavaScript', 'CSS']
  }
];

// Sample Jobs
const jobs = [
  {
    role: 'Full Stack Developer',
    title: 'Full Stack Developer',
    company: 'Amazon',
    location: 'Bangalore',
    type: 'Full-time',
    salary: '₹15-20 LPA',
    experience: '2-4 years',
    description: 'Build scalable web applications using modern technologies. Work with cross-functional teams.',
    requirements: ['Node.js', 'React', 'MongoDB', 'AWS'],
    perks: ['Health Insurance', 'Stock Options', 'Flexible Hours'],
    applyLink: 'https://amazon.jobs',
    deadline: new Date('2025-03-30'),
    category: 'Engineering',
    tags: ['Full Stack', 'JavaScript', 'Cloud']
  },
  {
    role: 'DevOps Engineer',
    title: 'DevOps Engineer',
    company: 'Zomato',
    location: 'Gurgaon',
    type: 'Full-time',
    salary: '₹12-18 LPA',
    experience: '3-5 years',
    description: 'Manage infrastructure, automate deployments, and ensure system reliability.',
    requirements: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    perks: ['Food Allowance', 'Remote Work', 'Learning Budget'],
    applyLink: 'https://www.zomato.com/careers',
    deadline: new Date('2025-04-15'),
    category: 'DevOps',
    tags: ['DevOps', 'Cloud', 'Infrastructure']
  }
];

// Sample Courses
const courses = [
  {
    title: 'Complete Web Development Bootcamp',
    instructor: 'Angela Yu',
    platform: 'Udemy',
    duration: '60 hours',
    price: 'Free',
    description: 'Learn HTML, CSS, JavaScript, Node.js, React, MongoDB and more!',
    level: 'Beginner',
    category: 'Web Development',
    rating: 4.7,
    link: 'https://www.udemy.com/course/the-complete-web-development-bootcamp',
    tags: ['Web Dev', 'JavaScript', 'React']
  },
  {
    title: 'Machine Learning A-Z',
    instructor: 'Kirill Eremenko',
    platform: 'Udemy',
    duration: '44 hours',
    price: '₹499',
    description: 'Learn to create Machine Learning Algorithms in Python and R',
    level: 'Intermediate',
    category: 'Machine Learning',
    rating: 4.5,
    link: 'https://www.udemy.com/course/machinelearning',
    tags: ['ML', 'Python', 'AI']
  },
  {
    title: 'Data Structures and Algorithms',
    instructor: 'Abdul Bari',
    platform: 'Udemy',
    duration: '50 hours',
    price: 'Free',
    description: 'Master DSA for interview preparation and competitive programming',
    level: 'Beginner',
    category: 'Programming',
    rating: 4.8,
    link: 'https://www.udemy.com/course/datastructurescncpp',
    tags: ['DSA', 'Algorithms', 'Interview Prep']
  }
];

// Sample Scholarships
const scholarships = [
  {
    title: 'INSPIRE Scholarship',
    provider: 'Department of Science and Technology',
    amount: '₹80,000/year',
    eligibility: 'Top 1% students in Class 12',
    description: 'Scholarship for pursuing Bachelor\'s and Master\'s degree in Natural and Basic Sciences',
    deadline: new Date('2025-06-30'),
    applyLink: 'https://online-inspire.gov.in',
    category: 'Government',
    tags: ['Government', 'Science', 'Merit-based']
  },
  {
    title: 'Google Women Techmakers Scholarship',
    provider: 'Google',
    amount: '₹2,00,000',
    eligibility: 'Female students in Computer Science',
    description: 'Supporting women in technology through financial assistance and mentorship',
    deadline: new Date('2025-03-31'),
    applyLink: 'https://buildyourfuture.withgoogle.com/scholarships',
    category: 'Private',
    tags: ['Women', 'Tech', 'Google']
  },{
    title: 'Reliance Foundation Scholarship',
    provider: 'Reliance Foundation',
    amount: '₹2,00,000',
    eligibility: 'Students from underprivileged backgrounds',
    description: 'Financial support for undergraduate students across India',
    deadline: new Date('2025-05-15'),
    applyLink: 'https://www.reliancefoundation.org/scholarships',
    category: 'Private',
    tags: ['Need-based', 'Undergraduate']
  }
];

// Sample Blogs
const blogs = [
  {
    title: 'How to Prepare for Technical Interviews',
    author: 'Ravi Kumar',
    excerpt: 'A comprehensive guide to acing technical interviews with practical tips and strategies.',
    content: `Technical interviews can be challenging, but with the right preparation, you can ace them! 

**Key Tips:**

1. **Master Data Structures:** Focus on arrays, linked lists, trees, graphs, and hash tables.

2. **Practice Algorithms:** Solve problems on LeetCode, HackerRank, and CodeChef regularly.

3. **System Design:** Understand scalability, databases, caching, and load balancing.

4. **Mock Interviews:** Practice with friends or use platforms like Pramp.

5. **Stay Updated:** Learn about the company's tech stack and recent projects.

Remember, consistency is key. Dedicate at least 2-3 hours daily for coding practice!`,
    category: 'Career',
    tags: ['Interviews', 'Coding', 'Career'],
    readTime: 5
  },
  {
    title: 'Top 10 Skills Every Developer Should Learn in 2024',
    author: 'Dr. Amit Verma',
    excerpt: 'Stay ahead in your tech career by mastering these essential skills for 2024.',
    content: `The tech landscape is constantly evolving. Here are the must-have skills:

1. **Cloud Computing** - AWS, Azure, or GCP
2. **DevOps** - Docker, Kubernetes, CI/CD
3. **AI/ML** - Python, TensorFlow, PyTorch
4. **Blockchain** - Smart contracts, Web3
5. **Cybersecurity** - Ethical hacking, security best practices
6. **Mobile Development** - React Native, Flutter
7. **System Design** - Scalability, microservices
8. **Soft Skills** - Communication, teamwork
9. **Git & Version Control** - Essential for all developers
10. **Testing** - Unit tests, integration tests

Start learning these skills to stay competitive in the job market!`,
    category: 'Technology',
    tags: ['Skills', 'Development', 'Learning'],
    readTime: 7
  }
];

// Sample Competitions
const competitions = [
  {
    title: 'Google Code Jam',
    organizer: 'Google',
    description: 'World\'s largest coding competition with exciting algorithmical challenges',
    registrationLink: 'https://codingcompetitions.withgoogle.com/codejam',
    startDate: new Date('2025-03-15'),
    endDate: new Date('2025-05-30'),
    deadline: new Date('2025-03-10'),
    prize: '$15,000',
    prizes: '1st: $15,000 | 2nd: $2,000 | 3rd: $1,000',
    category: 'Coding',
    mode: 'Online',
    tags: ['Coding', 'Algorithms', 'Global']
  },
  {
    title: 'Smart India Hackathon',
    organizer: 'Government of India',
    description: 'India\'s biggest hackathon for students to solve real-world problems',
    registrationLink: 'https://www.sih.gov.in',
    startDate: new Date('2025-04-01'),
    endDate: new Date('2025-08-31'),
    deadline: new Date('2025-03-25'),
    prize: '₹1,00,000',
    prizes: '1st: ₹1,00,000 | 2nd: ₹75,000 | 3rd: ₹50,000',
    category: 'Hackathon',
    mode: 'Hybrid',
    tags: ['Hackathon', 'Innovation', 'India']
  },
  {
    title: 'Meta Hacker Cup',
    organizer: 'Meta (Facebook)',
    description: 'Annual programming competition with multiple rounds of challenges',
    registrationLink: 'https://www.facebook.com/codingcompetitions/hacker-cup',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-09-30'),
    deadline: new Date('2025-05-25'),
    prize: '$20,000',
    prizes: '1st: $20,000 | 2nd: $5,000 | 3rd: $2,500',
    category: 'Coding',
    mode: 'Online',
    tags: ['Programming', 'Competitive', 'Global']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if connection is actually active
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection is not active');
    }

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Internship.deleteMany({});
    await Job.deleteMany({});
    await Course.deleteMany({});
    await Scholarship.deleteMany({});
    await Blog.deleteMany({});
    await Competition.deleteMany({});
    console.log('✅ Cleared existing data');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get the admin user for blog authorship
    const adminUser = createdUsers.find(u => u.role === 'admin');

    // Create internships
    const createdInternships = await Internship.insertMany(internships);
    console.log(`✅ Created ${createdInternships.length} internships`);

    // Create jobs
    const createdJobs = await Job.insertMany(jobs);
    console.log(`✅ Created ${createdJobs.length} jobs`);

    // Create courses
    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${createdCourses.length} courses`);

    // Create scholarships
    const createdScholarships = await Scholarship.insertMany(scholarships);
    console.log(`✅ Created ${createdScholarships.length} scholarships`);

    // Create blogs
    const createdBlogs = await Blog.insertMany(blogs);
    console.log(`✅ Created ${createdBlogs.length} blogs`);

    // Create competitions
    const createdCompetitions = await Competition.insertMany(competitions);
    console.log(`✅ Created ${createdCompetitions.length} competitions`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@startuped.com / admin123');
    console.log('Student 1: ravi@example.com / password123');
    console.log('Student 2: priya@example.com / password123');
    console.log('Teacher: amit@example.com / password123');

    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    // Ensure we close connection if it was opened
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedDatabase();
