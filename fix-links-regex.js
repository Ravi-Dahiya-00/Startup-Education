const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client-next/app/internships/page.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace top import
content = content.replace(
  /import { useRouter } from 'next\/navigation';/,
  "import { useRouter } from 'next/navigation';\nimport Link from 'next/link';"
);

// Replace h3 > router.push with <Link>
content = content.replace(
  /<h3\s+className="role-title"\s+onClick=\{\(\) =>\s+router\.push\(`\/internships\/\$\{internship\._id\}`,\s+\{\s+state:\s+\{\s+internship\s+\},\s+\}\)\s+\}\s+style=\{\{\s+cursor:\s+"pointer"\s+\}\}\s*>\s*\{internship\.role\}\s*<\/h3>/g,
  `<Link \n                          href={\`/internships/\${internship.slug || internship._id}\`}\n                          className="role-title"\n                          style={{ textDecoration: 'none', display: 'block' }}\n                        >\n                          <h3>{internship.role}</h3>\n                        </Link>`
);

// Replace apply button router.push with <Link>
content = content.replace(
  /<button\s+className="apply-btn"\s+onClick=\{\(\) =>\s+router\.push\(`\/internships\/\$\{internship\._id\}`,\s+\{\s+state:\s+\{\s+internship\s+\},\s+\}\)\s+\}\s*>\s*Apply Now\s*<ChevronRight size=\{18\}\s*\/>\s*<\/button>/g,
  `<Link\n                        href={\`/internships/\${internship.slug || internship._id}\`}\n                        className="apply-btn"\n                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}\n                      >\n                        Apply Now\n                        <ChevronRight size={18} />\n                      </Link>`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Successfully ran fix-links-regex.js");
