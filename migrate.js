// This script transforms React SPA files to Next.js compatible files
// Run with: node migrate.js

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'client', 'src');
const DEST = path.join(__dirname, 'client-next');

function transform(content, filePath) {
  let result = content;
  
  // Add "use client" if not present and file uses client-side features
  const needsUseClient = 
    result.includes('useState') || 
    result.includes('useEffect') || 
    result.includes('useRef') ||
    result.includes('useContext') ||
    result.includes('useNavigate') ||
    result.includes('useParams') ||
    result.includes('useSearchParams') ||
    result.includes('useLocation') ||
    result.includes('framer-motion') ||
    result.includes('localStorage') ||
    result.includes('sessionStorage') ||
    result.includes('window.') ||
    result.includes('document.');
  
  if (needsUseClient && !result.includes('"use client"')) {
    result = '"use client";\n\n' + result;
  }

  // Replace react-router-dom imports
  // Replace Link import
  result = result.replace(
    /import\s*\{[^}]*Link[^}]*\}\s*from\s*['"]react-router-dom['"];?/g,
    (match) => {
      const imports = match.match(/\{([^}]+)\}/)[1].split(',').map(s => s.trim());
      const otherImports = imports.filter(i => i !== 'Link');
      let replacement = "import Link from 'next/link';";
      
      if (otherImports.some(i => i === 'useNavigate')) {
        replacement += "\nimport { useRouter } from 'next/navigation';";
      }
      if (otherImports.some(i => i === 'useParams')) {
        replacement += "\nimport { useParams } from 'next/navigation';";
      }
      if (otherImports.some(i => i === 'useSearchParams')) {
        replacement += "\nimport { useSearchParams } from 'next/navigation';";
      }
      if (otherImports.some(i => i === 'useLocation')) {
        replacement += "\nimport { useSearchParams as useLocationParams } from 'next/navigation';";
      }
      
      return replacement;
    }
  );
  
  // Handle imports that don't include Link
  result = result.replace(
    /import\s*\{\s*(useNavigate|useParams|useSearchParams|useLocation)(?:\s*,\s*(useNavigate|useParams|useSearchParams|useLocation))*\s*\}\s*from\s*['"]react-router-dom['"];?/g,
    (match) => {
      let replacement = '';
      if (match.includes('useNavigate')) replacement += "import { useRouter } from 'next/navigation';\n";
      if (match.includes('useParams')) replacement += "import { useParams } from 'next/navigation';\n";
      if (match.includes('useSearchParams')) replacement += "import { useSearchParams } from 'next/navigation';\n";
      return replacement.trim();
    }
  );

  // Replace remaining react-router-dom imports
  result = result.replace(/from\s*['"]react-router-dom['"];?/g, "from 'next/link';");

  // Replace useNavigate() calls with useRouter()
  result = result.replace(/const\s+navigate\s*=\s*useNavigate\(\)/g, 'const router = useRouter()');
  result = result.replace(/navigate\s*\(/g, 'router.push(');
  
  // Replace useParams() - Next.js useParams returns the same thing
  // No changes needed for useParams

  // Replace Link "to" prop with "href"
  result = result.replace(/<Link\s+to=/g, '<Link href=');
  result = result.replace(/<Link(\s+[^>]*?)to=/g, '<Link$1href=');

  // Fix import paths
  result = result.replace(/from\s*['"]\.\.\/config\/api['"];?/g, "from '@/lib/api';");
  result = result.replace(/from\s*['"]\.\.\/\.\.\/config\/api['"];?/g, "from '@/lib/api';");
  result = result.replace(/from\s*['"]\.\/config\/api['"];?/g, "from '@/lib/api';");
  
  result = result.replace(/from\s*['"]\.\.\/context\/AuthContext['"];?/g, "from '@/context/AuthContext';");
  result = result.replace(/from\s*['"]\.\.\/\.\.\/context\/AuthContext['"];?/g, "from '@/context/AuthContext';");
  
  result = result.replace(/from\s*['"]\.\.\/components\//g, "from '@/components/");
  result = result.replace(/from\s*['"]\.\.\/\.\.\/components\//g, "from '@/components/");
  
  result = result.replace(/from\s*['"]\.\.\/hooks\//g, "from '@/hooks/");
  result = result.replace(/from\s*['"]\.\.\/\.\.\/hooks\//g, "from '@/hooks/");
  
  result = result.replace(/from\s*['"]\.\.\/data\//g, "from '@/data/");
  result = result.replace(/from\s*['"]\.\.\/\.\.\/data\//g, "from '@/data/");
  
  result = result.replace(/from\s*['"]\.\.\/utils\//g, "from '@/utils/");
  result = result.replace(/from\s*['"]\.\.\/\.\.\/utils\//g, "from '@/utils/");

  // Replace import.meta.env with process.env
  result = result.replace(/import\.meta\.env\.VITE_/g, 'process.env.NEXT_PUBLIC_');

  return result;
}

// Copy and transform a file
function copyAndTransform(srcPath, destPath) {
  const content = fs.readFileSync(srcPath, 'utf8');
  const transformed = transform(content, srcPath);
  
  const destDir = path.dirname(destPath);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(destPath, transformed);
  console.log(`✅ ${path.relative(DEST, destPath)}`);
}

// Copy a file without transformation (CSS, JSON, etc.)
function copyRaw(srcPath, destPath) {
  const destDir = path.dirname(destPath);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, destPath);
  console.log(`📋 ${path.relative(DEST, destPath)}`);
}

// ============== COMPONENTS ==============
const componentFiles = [
  'Hero.jsx',
  'FeaturedOpportunities.jsx', 
  'AdminGuard.jsx',
  'ShareModal.jsx',
  'ShareModal.css',
  'CompanyProfileModal.jsx',
  'CompanyProfileModal.css',
  'CustomDatePicker.jsx',
];
componentFiles.forEach(f => {
  const src = path.join(SRC, 'components', f);
  const dest = path.join(DEST, 'components', f);
  if (f.endsWith('.css')) copyRaw(src, dest);
  else copyAndTransform(src, dest);
});

// Learning sub-components
const learningComponents = [
  'CodingProblemRunner.jsx',
  'CodingProblemRunner.css',
  'CodingProblemsList.jsx',
  'CodingProblemsList.css',
];
learningComponents.forEach(f => {
  const src = path.join(SRC, 'components', 'learning', f);
  const dest = path.join(DEST, 'components', 'learning', f);
  if (f.endsWith('.css')) copyRaw(src, dest);
  else copyAndTransform(src, dest);
});

// ============== HOOKS ==============
const hooks = ['useLocationAutocomplete.js', 'useSkillsAutocomplete.js', 'useUserLocation.js'];
hooks.forEach(f => {
  copyAndTransform(path.join(SRC, 'hooks', f), path.join(DEST, 'hooks', f));
});

// ============== DATA ==============
const data = ['locations.js', 'skills.js', 'quizData.json'];
data.forEach(f => {
  const src = path.join(SRC, 'data', f);
  const dest = path.join(DEST, 'data', f);
  if (f.endsWith('.json')) copyRaw(src, dest);
  else copyRaw(src, dest); // Data files don't need transformation
});

// ============== UTILS ==============
copyAndTransform(path.join(SRC, 'utils', 'shareUtils.js'), path.join(DEST, 'utils', 'shareUtils.js'));

// ============== PAGES ==============
// Content pages
const pageMap = {
  // Content
  'pages/content/Home.jsx': 'app/page.js',
  'pages/content/Blogs.jsx': 'app/blogs/page.js',
  'pages/content/BlogDetails.jsx': 'app/blogs/[id]/page.js',
  'pages/content/BlogDetails.css': 'app/blogs/[id]/BlogDetails.css',
  'pages/content/Profile.jsx': 'app/profile/page.js',
  // Auth
  'pages/auth/Login.jsx': 'app/login/page.js',
  'pages/auth/Signup.jsx': 'app/signup/page.js',
  // Search
  'pages/search/SearchResults.jsx': 'app/search/page.js',
  // Opportunities
  'pages/opportunities/Jobs.jsx': 'app/jobs/page.js',
  'pages/opportunities/JobDetails.jsx': 'app/jobs/[id]/page.js',
  'pages/opportunities/Internships.jsx': 'app/internships/page.js',
  'pages/opportunities/InternshipDetails.jsx': 'app/internships/[id]/page.js',
  'pages/opportunities/Competitions.jsx': 'app/competitions/page.js',
  'pages/opportunities/CompetitionDetails.jsx': 'app/competitions/[id]/page.js',
  'pages/opportunities/Scholarships.jsx': 'app/scholarships/page.js',
  'pages/opportunities/ScholarshipDetails.jsx': 'app/scholarships/[id]/page.js',
  'pages/opportunities/ScholarshipDetails.css': 'app/scholarships/[id]/ScholarshipDetails.css',
  // Learning
  'pages/learning/Courses.jsx': 'app/courses/page.js',
  'pages/learning/Courses.css': 'app/courses/Courses.css',
  'pages/learning/CourseDetails.jsx': 'app/courses/[id]/page.js',
  'pages/learning/CourseDetails.css': 'app/courses/[id]/CourseDetails.css',
  'pages/learning/Notes.jsx': 'app/notes/[[...slug]]/page.js',
  'pages/learning/UploadNote.jsx': 'app/upload-note/page.js',
  'pages/learning/Practice.jsx': 'app/practice/page.js',
  'pages/learning/Practice.css': 'app/practice/Practice.css',
  // Admin
  'pages/admin/AdminDashboard.jsx': 'app/admin/page.js',
  'pages/admin/AdminInternships.jsx': 'app/admin/internships/page.js',
  'pages/admin/AdminJobs.jsx': 'app/admin/jobs/page.js',
  'pages/admin/AdminCompetitions.jsx': 'app/admin/competitions/page.js',
  'pages/admin/AdminCourses.jsx': 'app/admin/courses/page.js',
  'pages/admin/AdminBlogs.jsx': 'app/admin/blogs/page.js',
  'pages/admin/AdminScholarships.jsx': 'app/admin/scholarships/page.js',
  'pages/admin/AdminNotes.jsx': 'app/admin/notes/page.js',
  'pages/admin/JobParser.jsx': 'app/admin/parse-job/page.js',
};

Object.entries(pageMap).forEach(([srcRel, destRel]) => {
  const src = path.join(SRC, srcRel);
  const dest = path.join(DEST, destRel);
  
  if (srcRel.endsWith('.css')) {
    copyRaw(src, dest);
  } else {
    copyAndTransform(src, dest);
  }
});

console.log('\n🎉 Migration complete! All files transformed.');
