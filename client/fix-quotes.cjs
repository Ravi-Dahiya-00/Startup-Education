// Fix mixed quotes in all files
const fs = require("fs");
const path = require("path");

const files = [
  "src/pages/learning/UploadNote.jsx",
  "src/pages/auth/Signup.jsx",
  "src/pages/auth/Login.jsx",
  "src/pages/admin/JobParser.jsx",
  "src/pages/admin/AdminScholarships.jsx",
  "src/pages/admin/AdminNotes.jsx",
  "src/pages/admin/AdminJobs.jsx",
  "src/pages/admin/AdminInternships.jsx",
  "src/pages/admin/AdminCourses.jsx",
  "src/pages/admin/AdminCompetitions.jsx",
  "src/pages/admin/AdminBlogs.jsx",
  "src/components/learning/CodingProblemRunner.jsx",
];

const baseDir = __dirname;

files.forEach((file) => {
  const fullPath = path.join(baseDir, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf8");
    // Fix pattern: `${API_URL}/api/...' should be `${API_URL}/api/...`
    const before = content;
    content = content.replace(/`\$\{API_URL\}([^`]*?)'/g, "`${API_URL}$1`");
    if (content !== before) {
      fs.writeFileSync(fullPath, content, "utf8");
      console.log("Fixed:", file);
    } else {
      console.log("No change:", file);
    }
  } else {
    console.log("Not found:", file);
  }
});

console.log("Done!");
