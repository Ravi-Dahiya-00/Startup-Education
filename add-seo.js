// Add SEO metadata to all Next.js pages
// For "use client" pages, we create wrapper layout.js files with metadata exports

const fs = require('fs');
const path = require('path');

const DEST = path.join(__dirname, 'client-next');
const SITE_URL = 'https://startup-education-six.vercel.app';

// Metadata for each route
const pageMetadata = {
  // Homepage (already has root layout metadata, but enhance page.js)
  'app/page.js': {
    // Homepage uses root layout metadata - skip
  },

  // Content
  'app/blogs/page.js': {
    title: 'Blogs & Articles',
    description: 'Read insightful blogs and articles about careers, technology, startups, and education. Stay updated with the latest trends and tips.',
    keywords: 'blogs, articles, career tips, technology, startups, education, student resources',
    path: '/blogs',
  },
  'app/blogs/[id]/page.js': null, // Dynamic - needs generateMetadata

  // Auth
  'app/login/page.js': {
    title: 'Login',
    description: 'Sign in to your Startup Education account to access jobs, internships, courses, and more.',
    keywords: 'login, sign in, student account, startup education',
    path: '/login',
  },
  'app/signup/page.js': {
    title: 'Create Account',
    description: 'Join Startup Education for free. Access thousands of jobs, internships, competitions, courses, and study notes.',
    keywords: 'sign up, register, create account, free, student platform',
    path: '/signup',
  },
  'app/profile/page.js': {
    title: 'My Profile',
    description: 'Manage your Startup Education profile, track applications, and update your preferences.',
    keywords: 'profile, account settings, dashboard',
    path: '/profile',
    noindex: true,
  },

  // Search
  'app/search/page.js': {
    title: 'Search Results',
    description: 'Search across jobs, internships, courses, competitions, blogs, and scholarships on Startup Education.',
    keywords: 'search, find opportunities, jobs search, internships search',
    path: '/search',
  },

  // Opportunities
  'app/jobs/page.js': {
    title: 'Jobs',
    description: 'Browse and apply for the latest remote and on-site jobs. Find full-time, part-time, and contract positions across top companies in India.',
    keywords: 'jobs, remote jobs, full time jobs, part time jobs, fresher jobs, tech jobs, India',
    path: '/jobs',
  },
  'app/jobs/[id]/page.js': null,

  'app/internships/page.js': {
    title: 'Internships',
    description: 'Discover paid and unpaid internships across tech, marketing, design, and more. Perfect for students and fresh graduates.',
    keywords: 'internships, paid internships, remote internships, student internships, India',
    path: '/internships',
  },
  'app/internships/[id]/page.js': null,

  'app/competitions/page.js': {
    title: 'Competitions & Hackathons',
    description: 'Participate in coding competitions, hackathons, and challenges. Win prizes and build your portfolio.',
    keywords: 'competitions, hackathons, coding challenges, prizes, tech competitions',
    path: '/competitions',
  },
  'app/competitions/[id]/page.js': null,

  'app/scholarships/page.js': {
    title: 'Scholarships',
    description: 'Find scholarships for Indian students. Merit-based, need-based, and government scholarships for all levels of education.',
    keywords: 'scholarships, financial aid, Indian scholarships, merit scholarships, government scholarships',
    path: '/scholarships',
  },
  'app/scholarships/[id]/page.js': null,

  // Learning
  'app/courses/page.js': {
    title: 'Courses',
    description: 'Explore free and paid online courses in programming, data science, design, business, and more from top educators.',
    keywords: 'online courses, free courses, programming courses, data science, design courses',
    path: '/courses',
  },
  'app/courses/[id]/page.js': null,

  'app/notes/[[...slug]]/page.js': {
    title: 'University Notes',
    description: 'Access study notes, previous year question papers, lab manuals, and more. Upload and share notes with fellow students.',
    keywords: 'university notes, study material, PYQ, lab manual, college notes, engineering notes',
    path: '/notes',
  },

  'app/upload-note/page.js': {
    title: 'Upload Note',
    description: 'Share your study notes with students across universities. Upload PDFs, documents, and presentations.',
    keywords: 'upload notes, share notes, contribute, study material',
    path: '/upload-note',
  },

  'app/practice/page.js': {
    title: 'Coding Practice',
    description: 'Practice coding problems, take quizzes, and improve your programming skills. Prepare for technical interviews.',
    keywords: 'coding practice, programming quiz, interview prep, DSA, algorithms',
    path: '/practice',
  },

  // Admin pages (noindex)
  'app/admin/page.js': {
    title: 'Admin Dashboard',
    description: 'Admin panel for managing content on Startup Education.',
    path: '/admin',
    noindex: true,
  },
  'app/admin/internships/page.js': { title: 'Manage Internships', path: '/admin/internships', noindex: true },
  'app/admin/jobs/page.js': { title: 'Manage Jobs', path: '/admin/jobs', noindex: true },
  'app/admin/competitions/page.js': { title: 'Manage Competitions', path: '/admin/competitions', noindex: true },
  'app/admin/courses/page.js': { title: 'Manage Courses', path: '/admin/courses', noindex: true },
  'app/admin/blogs/page.js': { title: 'Manage Blogs', path: '/admin/blogs', noindex: true },
  'app/admin/scholarships/page.js': { title: 'Manage Scholarships', path: '/admin/scholarships', noindex: true },
  'app/admin/notes/page.js': { title: 'Manage Notes', path: '/admin/notes', noindex: true },
  'app/admin/parse-job/page.js': { title: 'AI Job Parser', path: '/admin/parse-job', noindex: true },
};

// Generate the metadata export string
function generateMetadataExport(meta) {
  if (!meta) return null;
  
  const fullTitle = meta.title;
  const lines = [`export const metadata = {`];
  lines.push(`  title: "${fullTitle}",`);
  
  if (meta.description) {
    lines.push(`  description: "${meta.description}",`);
  }
  if (meta.keywords) {
    const kw = meta.keywords.split(', ').map(k => `"${k}"`).join(', ');
    lines.push(`  keywords: [${kw}],`);
  }
  
  // Open Graph
  lines.push(`  openGraph: {`);
  lines.push(`    title: "${fullTitle} | Startup Education",`);
  if (meta.description) lines.push(`    description: "${meta.description}",`);
  lines.push(`    url: "${SITE_URL}${meta.path || ''}",`);
  lines.push(`    siteName: "Startup Education",`);
  lines.push(`    type: "website",`);
  lines.push(`  },`);
  
  // Twitter
  lines.push(`  twitter: {`);
  lines.push(`    card: "summary_large_image",`);
  lines.push(`    title: "${fullTitle} | Startup Education",`);
  if (meta.description) lines.push(`    description: "${meta.description}",`);
  lines.push(`  },`);
  
  // Canonical
  if (meta.path) {
    lines.push(`  alternates: {`);
    lines.push(`    canonical: "${SITE_URL}${meta.path}",`);
    lines.push(`  },`);
  }

  // Robots
  if (meta.noindex) {
    lines.push(`  robots: {`);
    lines.push(`    index: false,`);
    lines.push(`    follow: false,`);
    lines.push(`  },`);
  }
  
  lines.push(`};`);
  return lines.join('\n');
}

// Process each page
let count = 0;
Object.entries(pageMetadata).forEach(([relPath, meta]) => {
  if (meta === null) return; // Skip dynamic pages (handled separately)
  if (!meta.title) return; // Skip homepage
  
  const filePath = path.join(DEST, relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${relPath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const metadataExport = generateMetadataExport(meta);
  
  // Check if metadata already exists
  if (content.includes('export const metadata')) {
    console.log(`⏭️  Already has metadata: ${relPath}`);
    return;
  }
  
  // For "use client" pages, we need to put metadata in a layout.js file instead
  if (content.includes('"use client"')) {
    // Create a layout.js in the same directory with just the metadata
    const dir = path.dirname(filePath);
    const layoutPath = path.join(dir, 'layout.js');
    
    // Don't overwrite existing layouts
    if (fs.existsSync(layoutPath)) {
      // Check if we can add metadata to existing layout
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      if (layoutContent.includes('"use client"') && !layoutContent.includes('export const metadata')) {
        // Can't add metadata to a client layout - skip
        console.log(`⏭️  Client layout already exists: ${relPath} - adding metadata wrapper`);
      } else if (!layoutContent.includes('export const metadata')) {
        // Add metadata to existing server layout
        const newLayout = metadataExport + '\n\n' + layoutContent;
        fs.writeFileSync(layoutPath, newLayout);
        console.log(`✅ Added metadata to existing layout: ${path.relative(DEST, layoutPath)}`);
        count++;
      }
      return;
    }
    
    // Create new layout.js with metadata
    const layoutContent = `${metadataExport}\n\nexport default function Layout({ children }) {\n  return children;\n}\n`;
    fs.writeFileSync(layoutPath, layoutContent);
    console.log(`✅ Created layout with metadata: ${path.relative(DEST, layoutPath)}`);
    count++;
  } else {
    // Server component - add metadata directly to the page file
    content = metadataExport + '\n\n' + content;
    fs.writeFileSync(filePath, content);
    console.log(`✅ Added metadata to: ${relPath}`);
    count++;
  }
});

// Now handle dynamic pages with generateMetadata
const dynamicPages = [
  {
    file: 'app/jobs/[id]/page.js',
    type: 'job',
    apiPath: '/api/jobs',
    fallbackTitle: 'Job Details',
    fallbackDescription: 'View detailed job listing including responsibilities, required skills, salary, and application details.',
  },
  {
    file: 'app/internships/[id]/page.js',
    type: 'internship',
    apiPath: '/api/internships',
    fallbackTitle: 'Internship Details',
    fallbackDescription: 'View detailed internship listing including responsibilities, stipend, and how to apply.',
  },
  {
    file: 'app/competitions/[id]/page.js',
    type: 'competition',
    apiPath: '/api/competitions',
    fallbackTitle: 'Competition Details',
    fallbackDescription: 'View competition details, prizes, deadlines, and how to participate.',
  },
  {
    file: 'app/scholarships/[id]/page.js',
    type: 'scholarship',
    apiPath: '/api/scholarships',
    fallbackTitle: 'Scholarship Details',
    fallbackDescription: 'View scholarship details including eligibility, amount, and application process.',
  },
  {
    file: 'app/blogs/[id]/page.js',
    type: 'blog',
    apiPath: '/api/blogs',
    fallbackTitle: 'Blog Post',
    fallbackDescription: 'Read this insightful article on Startup Education.',
  },
  {
    file: 'app/courses/[id]/page.js',
    type: 'course',
    apiPath: '/api/courses',
    fallbackTitle: 'Course Details',
    fallbackDescription: 'View course details, curriculum, and enrollment information.',
  },
];

dynamicPages.forEach(({ file, type, apiPath, fallbackTitle, fallbackDescription }) => {
  const filePath = path.join(DEST, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('generateMetadata') || content.includes('export const metadata')) {
    console.log(`⏭️  Already has metadata: ${file}`);
    return;
  }

  // For dynamic pages we need a separate layout.js with generateMetadata
  const dir = path.dirname(filePath);
  const layoutPath = path.join(dir, 'layout.js');
  
  if (fs.existsSync(layoutPath)) {
    console.log(`⏭️  Layout already exists: ${file}`);
    return;
  }

  const titleField = type === 'blog' ? 'title' : (type === 'job' || type === 'internship' ? 'role' : 'title');
  const companyField = type === 'job' || type === 'internship' ? 'company' : null;
  
  let titleTemplate;
  if (companyField) {
    titleTemplate = `\`\${data.${titleField}} at \${data.${companyField}}\``;
  } else {
    titleTemplate = `data.${titleField}`;
  }

  const layoutContent = `import API_URL from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const res = await fetch(\`\${API_URL}${apiPath}/\${id}\`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    
    const title = ${titleTemplate} || "${fallbackTitle}";
    const description = data.description?.substring(0, 160) || "${fallbackDescription}";

    return {
      title,
      description,
      openGraph: {
        title: \`\${title} | Startup Education\`,
        description,
        url: \`${SITE_URL}/${type}s/\${id}\`,
        siteName: "Startup Education",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: \`\${title} | Startup Education\`,
        description,
      },
      alternates: {
        canonical: \`${SITE_URL}/${type}s/\${id}\`,
      },
    };
  } catch {
    return {
      title: "${fallbackTitle}",
      description: "${fallbackDescription}",
    };
  }
}

export default function Layout({ children }) {
  return children;
}
`;

  fs.writeFileSync(layoutPath, layoutContent);
  console.log(`✅ Created dynamic metadata layout: ${path.relative(DEST, layoutPath)}`);
  count++;
});

console.log(`\n🎉 SEO metadata added to ${count} pages!`);
