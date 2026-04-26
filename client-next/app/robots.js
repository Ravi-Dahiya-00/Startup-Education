export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/profile', '/upload-note'],
      },
    ],
    sitemap: 'https://startup-education-six.vercel.app/sitemap.xml',
  };
}
