const mongoose = require('mongoose');
require('dotenv').config();

const Blog = require('./models/Blog');
const Scholarship = require('./models/Scholarship');
const Internship = require('./models/Internship');
const Job = require('./models/Job');
const Competition = require('./models/Competition');
const Course = require('./models/Course');

// ============ BLOGS ============
const sampleBlogs = [
  {
    title: "10 Essential Skills Every Software Developer Should Master in 2024",
    excerpt: "From AI integration to cloud architecture, discover the must-have skills that will make you stand out in today's competitive tech landscape.",
    content: `<h2>Introduction</h2>
<p>The tech industry is evolving faster than ever. As we navigate through 2024, certain skills have become essential for any developer looking to stay relevant and advance their career.</p>

<h2>1. AI and Machine Learning Integration</h2>
<p>Understanding how to integrate AI tools like ChatGPT, GitHub Copilot, and custom ML models into your workflow is no longer optional. Developers who can leverage AI effectively are seeing 40% productivity gains.</p>

<h2>2. Cloud-Native Development</h2>
<p>AWS, GCP, and Azure certifications are highly valued. But more importantly, understanding containerization with Docker and orchestration with Kubernetes is essential.</p>

<h2>3. System Design</h2>
<p>As applications scale, knowing how to design distributed systems, handle millions of users, and ensure high availability becomes crucial.</p>

<h2>4. Security Best Practices</h2>
<p>With cyber threats increasing, every developer needs to understand OWASP principles, secure coding practices, and cloud security.</p>

<h2>5. API Design</h2>
<p>RESTful APIs are table stakes. GraphQL, gRPC, and WebSocket implementations are increasingly in demand.</p>

<blockquote>The best developers aren't just coders - they're problem solvers who understand business context.</blockquote>

<h2>Conclusion</h2>
<p>Invest in these skills throughout 2024, and you'll find yourself not just employed, but thriving in one of the world's most dynamic industries.</p>`,
    author: "Priya Sharma",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    authorBio: "Senior Software Engineer at Google with 8 years of experience. Passionate about mentoring the next generation of developers.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    category: "Career",
    readTime: "7 min read",
    tags: ["Software Development", "Career Growth", "Skills", "2024 Trends"],
    likes: 342,
    views: 4521
  },
  {
    title: "Building a Portfolio That Gets You Hired: A Complete Guide",
    excerpt: "Learn how to create a developer portfolio that stands out from thousands of applicants and lands you interviews at top companies.",
    content: `<h2>Why Your Portfolio Matters</h2>
<p>In 2024, your portfolio is often the first thing recruiters see. A well-crafted portfolio can be the difference between getting an interview and being overlooked.</p>

<h2>Essential Elements</h2>
<h3>1. A Strong Hero Section</h3>
<p>Your landing page should immediately communicate who you are and what you do. Use a clear headline and a compelling value proposition.</p>

<h3>2. Featured Projects</h3>
<p>Quality over quantity. Showcase 3-5 projects that demonstrate different skills. Each project should include:</p>
<ul>
<li>Problem statement</li>
<li>Your approach</li>
<li>Technologies used</li>
<li>Challenges overcome</li>
<li>Results/Impact</li>
</ul>

<h3>3. About Section</h3>
<p>Tell your story. What drives you? What's your unique perspective? Make it personal but professional.</p>

<h2>Technical Considerations</h2>
<p>Your portfolio itself is a demonstration of your skills. Ensure it's:</p>
<ul>
<li>Mobile responsive</li>
<li>Fast loading (aim for < 3 seconds)</li>
<li>Accessible (WCAG compliant)</li>
<li>SEO optimized</li>
</ul>

<h2>Final Tips</h2>
<p>Keep it updated, get feedback from peers, and don't be afraid to show personality. Your portfolio should be uniquely you.</p>`,
    author: "Rahul Verma",
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    authorBio: "Full Stack Developer and Technical Writer. Helped 500+ students land their dream tech jobs.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
    category: "Career",
    readTime: "10 min read",
    tags: ["Portfolio", "Job Search", "Web Development", "Career Tips"],
    likes: 567,
    views: 8934
  },
  {
    title: "React vs Vue vs Angular: Which Framework Should You Learn in 2024?",
    excerpt: "An unbiased comparison of the three most popular frontend frameworks to help you make the right choice for your career.",
    content: `<h2>The Eternal Debate</h2>
<p>Every developer faces this question at some point. Let's break down each framework objectively.</p>

<h2>React</h2>
<p><strong>Market Share:</strong> ~40% of frontend jobs</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Largest ecosystem and community</li>
<li>Backed by Meta</li>
<li>Flexible architecture</li>
<li>Great for mobile (React Native)</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>JSX learning curve</li>
<li>Need to choose your own libraries</li>
</ul>

<h2>Vue</h2>
<p><strong>Market Share:</strong> ~20% of frontend jobs</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Gentle learning curve</li>
<li>Excellent documentation</li>
<li>Progressive adoption</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Smaller job market</li>
<li>Fewer enterprise adoptions</li>
</ul>

<h2>Angular</h2>
<p><strong>Market Share:</strong> ~25% of frontend jobs</p>
<p><strong>Pros:</strong></p>
<ul>
<li>Complete framework solution</li>
<li>TypeScript by default</li>
<li>Popular in enterprise</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>Steeper learning curve</li>
<li>More boilerplate</li>
</ul>

<h2>The Verdict</h2>
<p>If you're just starting out, React offers the best job prospects. Vue is excellent for rapid prototyping. Angular suits large enterprise applications.</p>`,
    author: "Ananya Gupta",
    authorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    authorBio: "Frontend Architect with expertise in all three major frameworks. Building web apps since 2015.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    category: "Technology",
    readTime: "8 min read",
    tags: ["React", "Vue", "Angular", "Frontend", "JavaScript"],
    likes: 891,
    views: 12340
  },
  {
    title: "How I Cracked Google's Interview in 3 Months: A Step-by-Step Guide",
    excerpt: "A detailed breakdown of my preparation strategy, resources used, and lessons learned from interviewing at Google.",
    content: `<h2>My Background</h2>
<p>I was a developer at a mid-sized startup with 3 years of experience. Getting into Google felt like a distant dream until I created a structured plan.</p>

<h2>Month 1: Foundations</h2>
<h3>Data Structures</h3>
<p>I spent the first month mastering fundamental data structures:</p>
<ul>
<li>Arrays and Strings</li>
<li>Linked Lists</li>
<li>Trees and Graphs</li>
<li>Hash Tables</li>
<li>Heaps</li>
</ul>

<h3>Resources Used</h3>
<p>"Cracking the Coding Interview" was my bible. I complemented it with LeetCode easy problems (50+ solved).</p>

<h2>Month 2: Algorithms Deep Dive</h2>
<p>This month was intense. I focused on:</p>
<ul>
<li>Dynamic Programming (the most important!)</li>
<li>Graph algorithms (BFS, DFS, Dijkstra)</li>
<li>Sorting and Searching</li>
<li>Recursion and Backtracking</li>
</ul>

<h2>Month 3: Mock Interviews and System Design</h2>
<p>I did 20+ mock interviews on Pramp and practiced system design using "System Design Interview" book.</p>

<h2>The Interview Day</h2>
<p>5 rounds over one day. 4 coding rounds and 1 behavioral. I solved 4/5 problems optimally.</p>

<h2>Key Takeaways</h2>
<blockquote>Consistency beats intensity. 2 hours daily is better than 10 hours on weekends.</blockquote>`,
    author: "Vikram Singh",
    authorAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    authorBio: "Software Engineer at Google. Previously at Amazon and Flipkart.",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800",
    category: "Interview Prep",
    readTime: "12 min read",
    tags: ["Google", "Interview", "DSA", "Career", "FAANG"],
    likes: 1203,
    views: 18762
  },
  {
    title: "The Complete Roadmap to Becoming a Full Stack Developer in 2024",
    excerpt: "From HTML basics to deploying production applications, here's everything you need to know to become a job-ready full stack developer.",
    content: `<h2>Phase 1: Frontend Foundations (2-3 months)</h2>
<h3>HTML & CSS</h3>
<p>Master semantic HTML, CSS Grid, Flexbox, and responsive design. Build 5 static websites.</p>

<h3>JavaScript</h3>
<p>Core concepts: variables, functions, DOM manipulation, async/await, ES6+ features.</p>

<h3>React.js</h3>
<p>Components, hooks, state management, routing. Build 3 React projects.</p>

<h2>Phase 2: Backend Development (2-3 months)</h2>
<h3>Node.js & Express</h3>
<p>REST APIs, middleware, authentication, database integration.</p>

<h3>Databases</h3>
<p>Learn both SQL (PostgreSQL) and NoSQL (MongoDB). Understand when to use which.</p>

<h2>Phase 3: Full Stack Integration (1-2 months)</h2>
<p>Build 2-3 full stack projects:</p>
<ul>
<li>E-commerce platform</li>
<li>Social media clone</li>
<li>Real-time chat application</li>
</ul>

<h2>Phase 4: DevOps Basics (1 month)</h2>
<p>Git/GitHub, Docker basics, CI/CD pipelines, cloud deployment (Vercel, Railway, AWS).</p>

<h2>Resources</h2>
<ul>
<li>FreeCodeCamp</li>
<li>The Odin Project</li>
<li>Full Stack Open</li>
<li>YouTube: Traversy Media, Web Dev Simplified</li>
</ul>

<h2>Timeline</h2>
<p>With consistent effort (4-6 hours daily), you can be job-ready in 6-9 months.</p>`,
    author: "Neha Patel",
    authorAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
    authorBio: "Full Stack Developer and Educator. Teaching web development for 5 years.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    category: "Learning",
    readTime: "15 min read",
    tags: ["Full Stack", "Web Development", "Roadmap", "Learning Path"],
    likes: 756,
    views: 14230
  }
];

// ============ SCHOLARSHIPS ============
const sampleScholarships = [
  {
    title: "Google Generation Scholarship",
    provider: "Google",
    providerLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/120px-Google_%22G%22_Logo.svg.png",
    amount: "₹75,000",
    deadline: "March 31, 2025",
    eligibility: "Undergraduate/Postgraduate students in CS/IT",
    category: "Merit-based",
    description: "The Google Generation Scholarship is designed to help aspiring computer scientists excel in technology and become leaders in the field. This scholarship supports students from underrepresented communities pursuing CS degrees.",
    benefits: [
      "₹75,000 one-time scholarship award",
      "Google mentorship opportunity",
      "Exclusive networking events",
      "Access to Google's learning resources",
      "Priority consideration for Google internships"
    ],
    requirements: [
      "Currently enrolled in a CS/IT undergraduate or postgraduate program",
      "Minimum CGPA of 8.0",
      "Strong academic record and leadership skills",
      "Active participation in community activities",
      "Indian citizen or permanent resident"
    ],
    howToApply: "Apply through the Google Scholarships portal. Submit your resume, transcripts, and two essays describing your leadership experience and career goals. Applications are reviewed on a rolling basis.",
    applicationLink: "https://buildyourfuture.withgoogle.com/scholarships",
    tags: ["Google", "Technology", "Computer Science", "Merit"],
    applicants: 4520
  },
  {
    title: "AICTE Pragati Scholarship for Girls",
    provider: "AICTE",
    providerLogo: "https://www.aicte-india.org/themes/Developer/images/logo.svg",
    amount: "₹50,000/year",
    deadline: "December 31, 2024",
    eligibility: "1st/2nd Year Female B.Tech Students",
    category: "Need-based",
    description: "AICTE Pragati Scholarship aims to provide assistance to girl students from economically weaker sections to pursue technical education. This initiative supports female empowerment in STEM fields.",
    benefits: [
      "₹50,000 per year for tuition fees",
      "Additional ₹2,000/month for incidentals",
      "Valid for entire duration of degree",
      "No repayment required"
    ],
    requirements: [
      "Female students enrolled in AICTE approved institutions",
      "Family income below ₹8 lakhs per annum",
      "Admission through centralized counseling",
      "Only two girls from one family are eligible",
      "Not receiving any other scholarship"
    ],
    howToApply: "Register on the National Scholarship Portal (NSP). Fill in the application form with required documents including income certificate, Aadhaar, and admission letter.",
    applicationLink: "https://scholarships.gov.in",
    tags: ["Government", "Girls", "Engineering", "Need-based"],
    applicants: 12400
  },
  {
    title: "Tata Trusts Scholarship",
    provider: "Tata Trusts",
    providerLogo: "https://www.tatatrusts.org/images/logo.svg",
    amount: "Up to ₹1,50,000/year",
    deadline: "February 28, 2025",
    eligibility: "Undergraduate students from any discipline",
    category: "Need-based",
    description: "Tata Trusts Educational Scholarships support meritorious students from economically disadvantaged backgrounds. The scholarship covers tuition fees and provides a monthly stipend for living expenses.",
    benefits: [
      "Full tuition fee coverage",
      "Monthly stipend of ₹5,000",
      "Laptop/Equipment allowance",
      "Annual book grant of ₹10,000",
      "Mentorship from Tata professionals"
    ],
    requirements: [
      "Indian national",
      "Family income below ₹4 lakhs per annum",
      "Minimum 60% in Class 12",
      "Currently enrolled in a recognized institution",
      "Demonstrate financial need"
    ],
    howToApply: "Apply through the Tata Trusts online portal. Submit income proof, academic transcripts, and a personal statement explaining your need and aspirations.",
    applicationLink: "https://www.tatatrusts.org/scholarships",
    tags: ["Tata", "Education", "Need-based", "All Disciplines"],
    applicants: 8750
  },
  {
    title: "Amazon Future Engineer Scholarship",
    provider: "Amazon",
    providerLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    amount: "₹80,000 + Internship",
    deadline: "April 15, 2025",
    eligibility: "1st Year CS/IT Students",
    category: "Merit-based",
    description: "Amazon Future Engineer is a comprehensive childhood-to-career program aimed at increasing access to computer science education for underserved communities. Scholars also receive a guaranteed internship at Amazon.",
    benefits: [
      "₹80,000 scholarship amount",
      "Guaranteed paid internship at Amazon",
      "Amazon mentorship program",
      "AWS credits for personal projects",
      "Exclusive Amazon career workshops"
    ],
    requirements: [
      "First-year undergraduate in CS/IT/ECE",
      "From underrepresented community",
      "Strong academic performance",
      "Demonstrated interest in computer science",
      "Good communication skills"
    ],
    howToApply: "Apply via Amazon's scholarship portal. Include your resume, a video introduction, and an essay about a technical project you've worked on or would like to build.",
    applicationLink: "https://www.amazonfutureengineer.com",
    tags: ["Amazon", "Technology", "Internship", "CS/IT"],
    applicants: 6230
  },
  {
    title: "Central Sector Scheme of Scholarships",
    provider: "Ministry of Education",
    providerLogo: "",
    amount: "₹20,000/year",
    deadline: "October 31, 2024",
    eligibility: "Top 20 percentile of Class 12 board exam",
    category: "Merit-based",
    description: "The Central Sector Scheme provides financial assistance to meritorious students from low income families to meet day-to-day expenses during their graduation. Administered by the Ministry of Education.",
    benefits: [
      "₹10,000 for first 3 years of graduation",
      "₹20,000 for 4th and 5th year",
      "₹20,000 per annum for postgraduate",
      "No bond or service obligation"
    ],
    requirements: [
      "Scored above 80 percentile in Class 12",
      "Family income below ₹8 lakhs per annum",
      "Regular admission in recognized institution",
      "Age below 30 years",
      "Not receiving any other Central scholarship"
    ],
    howToApply: "Apply through National Scholarship Portal (NSP). Verify eligibility based on your board exam percentile. Upload required documents including marksheet and income certificate.",
    applicationLink: "https://scholarships.gov.in",
    tags: ["Government", "Merit", "Central", "UG/PG"],
    applicants: 25600
  }
];

// ============ INTERNSHIPS ============
const sampleInternships = [
  {
    role: "Software Development Intern",
    company: "Microsoft",
    location: "Hyderabad",
    stipend: "₹80,000/month",
    duration: "3 months",
    category: "Engineering",
    workType: "Full Time",
    skills: ["Python", "Azure", "Git", "Docker"],
    responsibilities: ["Build cloud features", "Write tests", "Code reviews"],
    learning: ["Enterprise development", "Cloud architecture"],
    deadline: new Date("2025-01-15"),
    tags: ["Microsoft", "Cloud", "Python"]
  },
  {
    role: "Frontend Developer Intern",
    company: "Flipkart",
    location: "Bangalore",
    stipend: "₹60,000/month",
    duration: "6 months",
    category: "Engineering",
    workType: "Full Time",
    skills: ["React", "JavaScript", "CSS", "Redux"],
    responsibilities: ["Build UI components", "Optimize performance"],
    learning: ["Large scale React apps", "E-commerce UX"],
    deadline: new Date("2025-02-01"),
    tags: ["Flipkart", "React", "Frontend"]
  },
  {
    role: "Data Science Intern",
    company: "Swiggy",
    location: "Bangalore",
    stipend: "₹50,000/month",
    duration: "4 months",
    category: "Data Science",
    workType: "Full Time",
    skills: ["Python", "Pandas", "Scikit-learn", "SQL"],
    responsibilities: ["Analyze datasets", "Build ML models"],
    learning: ["Real-world ML", "Logistics optimization"],
    deadline: new Date("2025-01-20"),
    tags: ["Swiggy", "ML", "Data Science"]
  },
  {
    role: "Backend Development Intern",
    company: "Razorpay",
    location: "Bangalore",
    stipend: "₹75,000/month",
    duration: "3 months",
    category: "Engineering",
    workType: "Full Time",
    skills: ["Node.js", "MongoDB", "Redis", "REST APIs"],
    responsibilities: ["API development", "Database design"],
    learning: ["Payment systems", "High availability"],
    deadline: new Date("2025-02-15"),
    tags: ["Razorpay", "Fintech", "Backend"]
  },
  {
    role: "UI/UX Design Intern",
    company: "Zomato",
    location: "Gurgaon",
    stipend: "₹40,000/month",
    duration: "3 months",
    category: "Design",
    workType: "Full Time",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    responsibilities: ["App redesign", "User research"],
    learning: ["Food tech UX", "Mobile design"],
    deadline: new Date("2025-01-25"),
    tags: ["Zomato", "Design", "UX"]
  }
];

// ============ JOBS ============
const sampleJobs = [
  {
    role: "Software Development Engineer",
    company: "Amazon",
    location: "Bangalore",
    salary: "₹25-35 LPA",
    experience: "0-2 years",
    category: "Engineering",
    workType: "Full Time",
    skills: ["Java", "AWS", "Microservices", "SQL"],
    responsibilities: ["Build scalable systems", "Design APIs", "Code reviews"],
    perks: ["Health insurance", "RSUs", "Learning budget"],
    deadline: new Date("2025-03-01"),
    tags: ["Amazon", "SDE", "Backend"]
  },
  {
    role: "Frontend Engineer",
    company: "Google",
    location: "Hyderabad",
    salary: "₹30-45 LPA",
    experience: "2-4 years",
    category: "Engineering",
    workType: "Full Time",
    skills: ["JavaScript", "TypeScript", "React", "Web Performance"],
    responsibilities: ["Build UI", "Performance optimization"],
    perks: ["Stock options", "Free meals", "Gym"],
    deadline: new Date("2025-02-28"),
    tags: ["Google", "Frontend", "React"]
  },
  {
    role: "Full Stack Developer",
    company: "Paytm",
    location: "Noida",
    salary: "₹15-25 LPA",
    experience: "1-3 years",
    category: "Engineering",
    workType: "Full Time",
    skills: ["Node.js", "React", "PostgreSQL", "Redis"],
    responsibilities: ["End-to-end feature development"],
    perks: ["Health insurance", "WFH flexibility"],
    deadline: new Date("2025-02-15"),
    tags: ["Paytm", "Fintech", "Full Stack"]
  },
  {
    role: "DevOps Engineer",
    company: "PhonePe",
    location: "Bangalore",
    salary: "₹20-30 LPA",
    experience: "2-5 years",
    category: "Engineering",
    workType: "Full Time",
    skills: ["Kubernetes", "Docker", "Terraform", "AWS"],
    responsibilities: ["CI/CD pipelines", "Infrastructure management"],
    perks: ["Stock options", "Flexible hours"],
    deadline: new Date("2025-03-15"),
    tags: ["PhonePe", "DevOps", "Cloud"]
  },
  {
    role: "Machine Learning Engineer",
    company: "Ola",
    location: "Bangalore",
    salary: "₹25-40 LPA",
    experience: "2-4 years",
    category: "Data Science",
    workType: "Full Time",
    skills: ["Python", "TensorFlow", "MLOps", "Apache Spark"],
    responsibilities: ["Build ML models", "Deploy to production"],
    perks: ["Stock options", "Learning budget"],
    deadline: new Date("2025-02-20"),
    tags: ["Ola", "ML", "AI"]
  }
];

// ============ COMPETITIONS ============
const sampleCompetitions = [
  {
    title: "Google Code Jam 2025",
    organizer: "Google",
    category: "Coding",
    mode: "Online",
    deadline: "March 15, 2025",
    prizes: "$15,000 Grand Prize",
    tags: ["Google", "Coding", "DSA"]
  },
  {
    title: "Smart India Hackathon 2025",
    organizer: "Government of India",
    category: "Hackathon",
    mode: "Hybrid",
    deadline: "February 1, 2025",
    prizes: "₹1,00,000 per winning team",
    tags: ["SIH", "Government", "Innovation"]
  },
  {
    title: "Microsoft Imagine Cup",
    organizer: "Microsoft",
    category: "Innovation",
    mode: "Hybrid",
    deadline: "April 1, 2025",
    prizes: "$100,000 + Azure credits",
    tags: ["Microsoft", "AI", "Startup"]
  },
  {
    title: "Flipkart GRiD 6.0",
    organizer: "Flipkart",
    category: "Engineering",
    mode: "Online",
    deadline: "January 31, 2025",
    prizes: "PPO + ₹3,00,000",
    tags: ["Flipkart", "Campus", "Coding"]
  },
  {
    title: "ICPC Asia Regionals",
    organizer: "ICPC Foundation",
    category: "Competitive Programming",
    mode: "On-site",
    deadline: "February 15, 2025",
    prizes: "World Finals qualification",
    tags: ["ICPC", "CP", "Team"]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Seed Blogs
    console.log('Seeding Blogs...');
    await Blog.deleteMany({});
    await Blog.insertMany(sampleBlogs);
    console.log(`✅ Inserted ${sampleBlogs.length} blogs`);

    // Seed Scholarships
    console.log('\nSeeding Scholarships...');
    await Scholarship.deleteMany({});
    await Scholarship.insertMany(sampleScholarships);
    console.log(`✅ Inserted ${sampleScholarships.length} scholarships`);

    // Seed Internships
    console.log('\nSeeding Internships...');
    await Internship.deleteMany({});
    await Internship.insertMany(sampleInternships);
    console.log(`✅ Inserted ${sampleInternships.length} internships`);

    // Seed Jobs
    console.log('\nSeeding Jobs...');
    await Job.deleteMany({});
    await Job.insertMany(sampleJobs);
    console.log(`✅ Inserted ${sampleJobs.length} jobs`);

    // Seed Competitions
    console.log('\nSeeding Competitions...');
    await Competition.deleteMany({});
    await Competition.insertMany(sampleCompetitions);
    console.log(`✅ Inserted ${sampleCompetitions.length} competitions`);

    console.log('\n========================================');
    console.log('✅ All data seeded successfully!');
    console.log('========================================');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
