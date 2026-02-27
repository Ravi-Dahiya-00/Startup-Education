// Script to replace all hardcoded localhost:5000 URLs with API_URL from config
// Run: node fix-api-urls.js

const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src");

// Files to update with the pattern of their localhost usage
const filesToFix = [
  // Opportunities
  "pages/opportunities/Jobs.jsx",
  "pages/opportunities/JobDetails.jsx",
  "pages/opportunities/Scholarships.jsx",
  "pages/opportunities/ScholarshipDetails.jsx",
  "pages/opportunities/InternshipDetails.jsx",
  "pages/opportunities/Competitions.jsx",

  // Learning
  "pages/learning/Notes.jsx",
  "pages/learning/UploadNote.jsx",
  "pages/learning/Courses.jsx",
  "pages/learning/CourseDetails.jsx",

  // Content
  "pages/content/Profile.jsx",
  "pages/content/Blogs.jsx",
  "pages/content/BlogDetails.jsx",

  // Auth
  "pages/auth/Login.jsx",
  "pages/auth/Signup.jsx",

  // Admin
  "pages/admin/JobParser.jsx",
  "pages/admin/AdminScholarships.jsx",
  "pages/admin/AdminNotes.jsx",
  "pages/admin/AdminJobs.jsx",
  "pages/admin/AdminInternships.jsx",
  "pages/admin/AdminCourses.jsx",
  "pages/admin/AdminCompetitions.jsx",
  "pages/admin/AdminBlogs.jsx",

  // Search
  "pages/search/SearchResults.jsx",

  // Components
  "components/Hero.jsx",
  "components/Navbar.jsx",
  "components/learning/CodingProblemsList.jsx",
  "components/learning/CodingProblemRunner.jsx",
];

function fixFile(filePath) {
  const fullPath = path.join(srcDir, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, "utf8");
  const originalContent = content;

  // Check if API_URL import already exists
  const hasApiImport =
    content.includes("import API_URL from") ||
    content.includes("from '../config/api'") ||
    content.includes("from '../../config/api'") ||
    content.includes("from '../../../config/api'");

  // Determine the correct import path based on file location
  const depth = filePath.split("/").length - 1;
  let importPath;
  if (depth === 1) {
    importPath = "../config/api";
  } else if (depth === 2) {
    importPath = "../../config/api";
  } else if (depth === 3) {
    importPath = "../../../config/api";
  } else {
    importPath = "../../config/api";
  }

  // Add import if not present
  if (!hasApiImport && content.includes("http://localhost:5000")) {
    // Find the last import statement
    const importRegex = /^import .+ from .+;?\r?\n/gm;
    let lastImportMatch;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportMatch = match;
    }

    if (lastImportMatch) {
      const insertPosition = lastImportMatch.index + lastImportMatch[0].length;
      const importStatement = `import API_URL from '${importPath}';\n`;
      content =
        content.slice(0, insertPosition) +
        importStatement +
        content.slice(insertPosition);
    }
  }

  // Replace hardcoded URLs
  // Pattern 1: fetch('http://localhost:5000/api/...')
  content = content.replace(
    /fetch\('http:\/\/localhost:5000\/api\//g,
    "fetch(`${API_URL}/api/",
  );
  content = content.replace(
    /fetch\("http:\/\/localhost:5000\/api\//g,
    "fetch(`${API_URL}/api/",
  );

  // Pattern 2: fetch(`http://localhost:5000/api/...`)
  content = content.replace(
    /fetch\(`http:\/\/localhost:5000\/api\//g,
    "fetch(`${API_URL}/api/",
  );

  // Pattern 3: axios.get('http://localhost:5000/api/...')
  content = content.replace(
    /axios\.get\('http:\/\/localhost:5000\/api\//g,
    "axios.get(`${API_URL}/api/",
  );
  content = content.replace(
    /axios\.get\("http:\/\/localhost:5000\/api\//g,
    "axios.get(`${API_URL}/api/",
  );

  // Pattern 4: axios.get(`http://localhost:5000/api/...`)
  content = content.replace(
    /axios\.get\(`http:\/\/localhost:5000\/api\//g,
    "axios.get(`${API_URL}/api/",
  );

  // Pattern 5: axios.post('http://localhost:5000/api/...')
  content = content.replace(
    /axios\.post\('http:\/\/localhost:5000\/api\//g,
    "axios.post(`${API_URL}/api/",
  );
  content = content.replace(
    /axios\.post\("http:\/\/localhost:5000\/api\//g,
    "axios.post(`${API_URL}/api/",
  );

  // Pattern 6: axios.post(`http://localhost:5000/api/...`)
  content = content.replace(
    /axios\.post\(`http:\/\/localhost:5000\/api\//g,
    "axios.post(`${API_URL}/api/",
  );

  // Pattern 7: Plain URL strings with template literals
  content = content.replace(
    /`http:\/\/localhost:5000\/api\//g,
    "`${API_URL}/api/",
  );

  // Pattern 8: Plain URL strings with single quotes - make them template literals
  content = content.replace(
    /'http:\/\/localhost:5000\/api\/([^']+)'/g,
    "`${API_URL}/api/$1`",
  );

  // Pattern 9: Plain URL strings with double quotes - make them template literals
  content = content.replace(
    /"http:\/\/localhost:5000\/api\/([^"]+)"/g,
    "`${API_URL}/api/$1`",
  );

  // Fix closing quotes/backticks after replacements
  content = content.replace(
    /\$\{API_URL\}\/api\/([^`'"\)]+)'\)/g,
    "${API_URL}/api/$1`)",
  );
  content = content.replace(
    /\$\{API_URL\}\/api\/([^`'"\)]+)"\)/g,
    "${API_URL}/api/$1`)",
  );

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } else {
    console.log(`⬜ No changes: ${filePath}`);
    return false;
  }
}

console.log("🔧 Starting API URL fix...\n");

let fixedCount = 0;
for (const file of filesToFix) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✨ Done! Fixed ${fixedCount} files.`);
console.log("\n📝 Next steps:");
console.log("1. Review the changes: git diff");
console.log(
  '2. Commit: git add . && git commit -m "Fix: Replace all hardcoded localhost URLs with API_URL"',
);
console.log("3. Push: git push");
console.log("4. Vercel will auto-deploy the changes");
