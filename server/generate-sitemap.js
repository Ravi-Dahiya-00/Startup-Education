const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Define models briefly
const jobSchema = new mongoose.Schema({ slug: String, updatedAt: Date, postedAt: Date }, { strict: false });
const Job = mongoose.model('Job', jobSchema);

const internshipSchema = new mongoose.Schema({ slug: String, updatedAt: Date, postedAt: Date }, { strict: false });
const Internship = mongoose.model('Internship', internshipSchema);

const competitionSchema = new mongoose.Schema({ slug: String, updatedAt: Date, datePosted: Date }, { strict: false });
const Competition = mongoose.model('Competition', competitionSchema);

const scholarshipSchema = new mongoose.Schema({ slug: String, updatedAt: Date, datePosted: Date }, { strict: false });
const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

const courseSchema = new mongoose.Schema({ slug: String, updatedAt: Date, publishedAt: Date }, { strict: false });
const Course = mongoose.model('Course', courseSchema);

const blogSchema = new mongoose.Schema({ slug: String, updatedAt: Date, date: Date }, { strict: false });
const Blog = mongoose.model('Blog', blogSchema);

const SITE_URL = 'https://startup-education-six.vercel.app';

async function generateSitemap() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/startup_education";
  
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const staticRoutes = [
      '',
      '/jobs',
      '/internships',
      '/competitions',
      '/scholarships',
      '/courses',
      '/blogs',
      '/notes',
      '/practice',
      '/login',
      '/signup',
      '/search',
      '/upload-note',
    ].map(route => {
      let priority = 0.7;
      if (route === '') priority = 1.0;
      else if (['/jobs', '/internships'].includes(route)) priority = 0.9;
      
      return `
  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    console.log("Fetching dynamic data...");
    
    // Fetch all dynamic data
    const jobs = await Job.find({}).select('slug _id updatedAt postedAt').lean();
    const internships = await Internship.find({}).select('slug _id updatedAt postedAt').lean();
    const competitions = await Competition.find({}).select('slug _id updatedAt datePosted').lean();
    const scholarships = await Scholarship.find({}).select('slug _id updatedAt datePosted').lean();
    const courses = await Course.find({}).select('slug _id updatedAt publishedAt').lean();
    const blogs = await Blog.find({}).select('slug _id updatedAt date').lean();

    const createUrlNodes = (items, basePath, priority = 0.8, changefreq = 'weekly') => {
      return items.map(item => {
        const urlId = item.slug || item._id.toString();
        const date = item.updatedAt || item.postedAt || item.datePosted || item.publishedAt || item.date || new Date();
        return `
  <url>
    <loc>${SITE_URL}${basePath}/${urlId}</loc>
    <lastmod>${new Date(date).toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
      });
    };

    const dynamicRoutes = [
      ...createUrlNodes(jobs, '/jobs'),
      ...createUrlNodes(internships, '/internships'),
      ...createUrlNodes(competitions, '/competitions'),
      ...createUrlNodes(scholarships, '/scholarships'),
      ...createUrlNodes(courses, '/courses'),
      ...createUrlNodes(blogs, '/blogs')
    ];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.join('')}
${dynamicRoutes.join('')}
</urlset>`;

    // Write to client/public
    const publicPath = path.join(__dirname, '..', 'client', 'public', 'sitemap.xml');
    fs.writeFileSync(publicPath, sitemapContent);
    console.log(`Sitemap successfully generated at ${publicPath} (${staticRoutes.length + dynamicRoutes.length} absolute URLs)`);

  } catch (err) {
    console.error("Error generating sitemap:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

generateSitemap();
