export const metadata = {
  title: "Search Results",
  description: "Search across jobs, internships, courses, competitions, blogs, and scholarships on Startup Education.",
  keywords: ["search", "find opportunities", "jobs search", "internships search"],
  openGraph: {
    title: "Search Results | Startup Education",
    description: "Search across jobs, internships, courses, competitions, blogs, and scholarships on Startup Education.",
    url: "https://startup-education-six.vercel.app/search",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Results | Startup Education",
    description: "Search across jobs, internships, courses, competitions, blogs, and scholarships on Startup Education.",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/search",
  },
};

export default function Layout({ children }) {
  return children;
}
