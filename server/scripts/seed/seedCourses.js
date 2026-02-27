const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');

const sampleCourses = [
  {
    title: "Python Programming Masterclass",
    instructor: "Dr. Priya Sharma",
    instructorBio: "Senior Python Developer with 10+ years of experience at top tech companies. PhD in Computer Science from IIT Delhi.",
    instructorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    thumbnail: "/images/courses/python_course.png",
    price: "Free",
    originalPrice: "₹4,999",
    rating: 4.8,
    reviewCount: 2847,
    duration: "25 Hours",
    category: "Development",
    level: "Beginner",
    language: "English",
    description: "Master Python programming from scratch! This comprehensive course covers everything from basic syntax to advanced concepts like decorators, generators, and OOP. Build real-world projects including web scrapers, automation scripts, and data analysis tools.",
    learnings: [
      "Understand Python fundamentals including variables, data types, and control flow",
      "Master Object-Oriented Programming concepts in Python",
      "Work with files, APIs, and databases",
      "Build automation scripts and web scrapers",
      "Create data visualization projects with matplotlib and pandas",
      "Develop problem-solving skills through coding challenges"
    ],
    curriculum: [
      {
        sectionTitle: "Getting Started with Python",
        lessons: [
          { title: "Introduction to Python", duration: "10:30", isPreview: true },
          { title: "Installing Python and IDE Setup", duration: "15:00", isPreview: true },
          { title: "Your First Python Program", duration: "12:45", isPreview: false },
          { title: "Variables and Data Types", duration: "20:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "Control Flow and Functions",
        lessons: [
          { title: "Conditional Statements", duration: "18:30", isPreview: false },
          { title: "Loops - For and While", duration: "22:00", isPreview: false },
          { title: "Functions and Parameters", duration: "25:00", isPreview: false },
          { title: "Lambda Functions", duration: "15:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "Object-Oriented Programming",
        lessons: [
          { title: "Classes and Objects", duration: "30:00", isPreview: false },
          { title: "Inheritance and Polymorphism", duration: "28:00", isPreview: false },
          { title: "Encapsulation and Abstraction", duration: "22:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "Advanced Topics",
        lessons: [
          { title: "File Handling", duration: "20:00", isPreview: false },
          { title: "Exception Handling", duration: "18:00", isPreview: false },
          { title: "Decorators and Generators", duration: "25:00", isPreview: false },
          { title: "Working with APIs", duration: "30:00", isPreview: false }
        ]
      }
    ],
    requirements: [
      "No prior programming experience required",
      "A computer with internet access",
      "Enthusiasm to learn!"
    ],
    features: {
      totalLessons: 15,
      totalHours: 25,
      hasQuizzes: true,
      hasCertificate: true,
      hasLifetimeAccess: true
    },
    tags: ["Python", "Programming", "Beginner", "Coding"],
    enrolledCount: 15420
  },
  {
    title: "Full Stack Web Development Bootcamp",
    instructor: "Rahul Verma",
    instructorBio: "Full Stack Developer and Tech Lead with experience at Google and Microsoft. Passionate about teaching web technologies.",
    instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    thumbnail: "/images/courses/web_dev_course.png",
    price: "₹2,499",
    originalPrice: "₹9,999",
    rating: 4.9,
    reviewCount: 4521,
    duration: "45 Hours",
    category: "Development",
    level: "Intermediate",
    language: "English",
    description: "Become a complete full-stack developer! Learn HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB. Build and deploy production-ready web applications from scratch.",
    learnings: [
      "Build responsive websites with HTML5, CSS3, and JavaScript",
      "Master React.js for frontend development",
      "Create REST APIs with Node.js and Express",
      "Work with MongoDB and Mongoose",
      "Implement authentication and authorization",
      "Deploy applications to cloud platforms"
    ],
    curriculum: [
      {
        sectionTitle: "Frontend Fundamentals",
        lessons: [
          { title: "HTML5 Structure and Semantics", duration: "25:00", isPreview: true },
          { title: "CSS3 Styling and Flexbox", duration: "35:00", isPreview: true },
          { title: "CSS Grid Layout", duration: "30:00", isPreview: false },
          { title: "Responsive Design Principles", duration: "28:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "JavaScript Deep Dive",
        lessons: [
          { title: "JavaScript Fundamentals", duration: "40:00", isPreview: false },
          { title: "DOM Manipulation", duration: "35:00", isPreview: false },
          { title: "Async JavaScript - Promises & Async/Await", duration: "45:00", isPreview: false },
          { title: "ES6+ Features", duration: "30:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "React.js",
        lessons: [
          { title: "React Introduction and JSX", duration: "30:00", isPreview: false },
          { title: "Components and Props", duration: "35:00", isPreview: false },
          { title: "State and Lifecycle", duration: "40:00", isPreview: false },
          { title: "Hooks - useState and useEffect", duration: "45:00", isPreview: false },
          { title: "React Router", duration: "30:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "Backend with Node.js",
        lessons: [
          { title: "Node.js Fundamentals", duration: "35:00", isPreview: false },
          { title: "Express.js Framework", duration: "40:00", isPreview: false },
          { title: "MongoDB and Mongoose", duration: "45:00", isPreview: false },
          { title: "Authentication with JWT", duration: "50:00", isPreview: false },
          { title: "Deployment to Render/Vercel", duration: "30:00", isPreview: false }
        ]
      }
    ],
    requirements: [
      "Basic understanding of HTML/CSS helpful but not required",
      "A modern web browser",
      "Code editor (VS Code recommended)"
    ],
    features: {
      totalLessons: 18,
      totalHours: 45,
      hasQuizzes: true,
      hasCertificate: true,
      hasLifetimeAccess: true
    },
    tags: ["Web Development", "React", "Node.js", "MongoDB", "JavaScript"],
    enrolledCount: 28350
  },
  {
    title: "UI/UX Design Fundamentals",
    instructor: "Ananya Gupta",
    instructorBio: "Lead Product Designer at a top startup. Previously at Flipkart and Ola. Specializes in user-centered design.",
    instructorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    thumbnail: "/images/courses/ui_ux_course.png",
    price: "₹1,999",
    originalPrice: "₹5,999",
    rating: 4.7,
    reviewCount: 1892,
    duration: "20 Hours",
    category: "Design",
    level: "Beginner",
    language: "English",
    description: "Learn the principles of great user interface and user experience design. Master Figma and create stunning designs that users love. Perfect for aspiring designers and developers who want to improve their design skills.",
    learnings: [
      "Understand core UI/UX design principles",
      "Master Figma from basics to advanced features",
      "Create wireframes and high-fidelity mockups",
      "Design complete mobile and web applications",
      "Build an impressive design portfolio",
      "Conduct user research and usability testing"
    ],
    curriculum: [
      {
        sectionTitle: "Design Fundamentals",
        lessons: [
          { title: "Introduction to UI/UX", duration: "15:00", isPreview: true },
          { title: "Design Thinking Process", duration: "20:00", isPreview: true },
          { title: "Color Theory and Typography", duration: "25:00", isPreview: false },
          { title: "Layout and Composition", duration: "22:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "Figma Masterclass",
        lessons: [
          { title: "Figma Interface Overview", duration: "18:00", isPreview: false },
          { title: "Shapes, Text, and Images", duration: "25:00", isPreview: false },
          { title: "Components and Variants", duration: "30:00", isPreview: false },
          { title: "Auto Layout", duration: "28:00", isPreview: false },
          { title: "Prototyping and Animations", duration: "35:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "Real Projects",
        lessons: [
          { title: "Mobile App Design - Food Delivery", duration: "60:00", isPreview: false },
          { title: "Web Dashboard Design", duration: "55:00", isPreview: false },
          { title: "E-commerce Website Design", duration: "65:00", isPreview: false }
        ]
      }
    ],
    requirements: [
      "No design experience needed",
      "Figma account (free)",
      "Creative mindset"
    ],
    features: {
      totalLessons: 12,
      totalHours: 20,
      hasQuizzes: false,
      hasCertificate: true,
      hasLifetimeAccess: true
    },
    tags: ["UI Design", "UX Design", "Figma", "Product Design"],
    enrolledCount: 9870
  },
  {
    title: "Data Science with Python",
    instructor: "Dr. Amit Patel",
    instructorBio: "Data Scientist at Amazon. PhD in Machine Learning from IISc Bangalore. Published researcher with 50+ papers.",
    instructorAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    thumbnail: "/images/courses/data_science_course.png",
    price: "₹3,499",
    originalPrice: "₹12,999",
    rating: 4.8,
    reviewCount: 3156,
    duration: "40 Hours",
    category: "Data Science",
    level: "Intermediate",
    language: "English",
    description: "Dive into the world of data science! Learn Python libraries like NumPy, Pandas, Matplotlib, and Scikit-learn. Master machine learning algorithms and build predictive models for real-world datasets.",
    learnings: [
      "Master NumPy and Pandas for data manipulation",
      "Create stunning visualizations with Matplotlib and Seaborn",
      "Understand machine learning algorithms",
      "Build and evaluate ML models with Scikit-learn",
      "Work with real-world datasets",
      "Implement end-to-end data science projects"
    ],
    curriculum: [
      {
        sectionTitle: "Python for Data Science",
        lessons: [
          { title: "NumPy Fundamentals", duration: "30:00", isPreview: true },
          { title: "Pandas DataFrames", duration: "40:00", isPreview: true },
          { title: "Data Cleaning Techniques", duration: "35:00", isPreview: false },
          { title: "Exploratory Data Analysis", duration: "45:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "Data Visualization",
        lessons: [
          { title: "Matplotlib Basics", duration: "25:00", isPreview: false },
          { title: "Advanced Matplotlib", duration: "30:00", isPreview: false },
          { title: "Seaborn for Statistical Plots", duration: "35:00", isPreview: false },
          { title: "Interactive Visualizations", duration: "28:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "Machine Learning",
        lessons: [
          { title: "Introduction to ML", duration: "25:00", isPreview: false },
          { title: "Linear and Logistic Regression", duration: "45:00", isPreview: false },
          { title: "Decision Trees and Random Forests", duration: "50:00", isPreview: false },
          { title: "Clustering Algorithms", duration: "40:00", isPreview: false },
          { title: "Model Evaluation and Tuning", duration: "35:00", isPreview: false }
        ]
      },
      {
        sectionTitle: "Capstone Projects",
        lessons: [
          { title: "Customer Churn Prediction", duration: "60:00", isPreview: false },
          { title: "Stock Price Analysis", duration: "55:00", isPreview: false },
          { title: "Sentiment Analysis", duration: "50:00", isPreview: false }
        ]
      }
    ],
    requirements: [
      "Basic Python knowledge recommended",
      "Understanding of basic statistics helpful",
      "Jupyter Notebook or Google Colab"
    ],
    features: {
      totalLessons: 16,
      totalHours: 40,
      hasQuizzes: true,
      hasCertificate: true,
      hasLifetimeAccess: true
    },
    tags: ["Data Science", "Python", "Machine Learning", "Pandas", "NumPy"],
    enrolledCount: 18540
  }
];

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert new courses
    const result = await Course.insertMany(sampleCourses);
    console.log(`✅ Inserted ${result.length} courses`);

    // Log course IDs for reference
    console.log('\nCourse IDs:');
    result.forEach(course => {
      console.log(`  ${course.title}: ${course._id}`);
    });

    await mongoose.disconnect();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedCourses();
