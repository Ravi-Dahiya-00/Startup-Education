import API_URL from '@/lib/api';

const SITE_URL = 'https://startup-education-six.vercel.app';

export default async function sitemap() {
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
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route.includes('jobs') || route.includes('internships') ? 0.9 : 0.7,
  }));

  let dynamicInternships = [];
  try {
    const res = await fetch(`${API_URL}/api/internships`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const internships = await res.json();
      dynamicInternships = internships.map((internship) => ({
        url: `${SITE_URL}/internships/${internship.slug || internship._id}`,
        lastModified: new Date(internship.updatedAt || internship.postedAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch internships for sitemap:", err);
  }

  return [...staticRoutes, ...dynamicInternships];
}
