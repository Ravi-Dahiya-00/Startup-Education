// Fix remaining react-router remnants in transformed files
const fs = require('fs');
const path = require('path');

const fixes = [
  // Fix JobDetails - remove useLocation, use direct fetch instead of location.state
  {
    file: 'client-next/app/jobs/[id]/page.js',
    find: '  const location = useLocation();\n',
    replace: ''
  },
  {
    file: 'client-next/app/jobs/[id]/page.js',
    find: 'if (location.state?.job) {\n        setJob({\n          ...mockJob,\n          ...location.state.job,\n          responsibilities: location.state.job.responsibilities?.length > 0 ? location.state.job.responsibilities : mockJob.responsibilities,\n          skills: location.state.job.skills?.length > 0 ? location.state.job.skills : (location.state.job.tags || mockJob.skills),\n          perks: location.state.job.perks?.length > 0 ? location.state.job.perks : mockJob.perks,\n          organizer: location.state.job.organizer || mockJob.organizer,\n          workDetails: {\n            days: location.state.job.workingDays || mockJob.workDetails.days,\n            schedule: \'Flexible Work Hours\',\n            timing: location.state.job.workType || mockJob.workDetails.timing\n          }\n        });\n        setLoading(false);\n        return;\n      }\n\n      try',
    replace: 'try'
  },
  {
    file: 'client-next/app/jobs/[id]/page.js',
    find: '  }, [id, location.state]);',
    replace: '  }, [id]);'
  },
  // Fix InternshipDetails
  {
    file: 'client-next/app/internships/[id]/page.js',
    find: '  const location = useLocation();\n',
    replace: ''
  },
  // Fix CompetitionDetails
  {
    file: 'client-next/app/competitions/[id]/page.js',
    find: '  const location = useLocation();\n',
    replace: ''
  },
  // Fix Notes - replace leftover navigate reference
  {
    file: 'client-next/app/notes/[[...slug]]/page.js',
    find: '}, [filterUniversity, filterSubject, navigate, universityId]);',
    replace: '}, [filterUniversity, filterSubject, router, universityId]);'
  },
  // Fix router.push(-1) -> router.back()
  {
    file: 'client-next/app/jobs/[id]/page.js',
    find: 'router.push(-1)',
    replace: 'router.back()'
  },
];

const ROOT = __dirname;

fixes.forEach(({ file, find, replace }) => {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(find)) {
    content = content.replace(find, replace);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${file} (replaced "${find.substring(0, 40)}...")`);
  } else {
    console.log(`⏭️  Pattern not found in: ${file} - "${find.substring(0, 50)}..."`);
  }
});

// Also fix any location.state references in internship and competition detail pages
['client-next/app/internships/[id]/page.js', 'client-next/app/competitions/[id]/page.js'].forEach(file => {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove location.state blocks (simpler approach - just remove the useLocation reference)
  if (content.includes('location.state')) {
    // Replace location.state?.xxx references with null
    content = content.replace(/location\.state\?\.(\w+)/g, 'null');
    content = content.replace(/location\.state/g, 'null');
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed location.state references: ${file}`);
  }
  
  // Fix router.push(-1) -> router.back()
  if (content.includes('router.push(-1)')) {
    content = content.replace(/router\.push\(-1\)/g, 'router.back()');
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed router.push(-1): ${file}`);
  }
});

// Fix router.push(-1) in all files
const glob = require('path');
function fixRouterBack(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      fixRouterBack(fullPath);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('router.push(-1)')) {
        content = content.replace(/router\.push\(-1\)/g, 'router.back()');
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Fixed router.back(): ${fullPath}`);
      }
    }
  }
}
fixRouterBack(path.join(ROOT, 'client-next', 'app'));

console.log('\n🎉 All fixes applied!');
