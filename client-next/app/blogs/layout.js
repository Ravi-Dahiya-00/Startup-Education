export const metadata = {
  title: "Blogs & Articles",
  description: "Read insightful blogs and articles about careers, technology, startups, and education. Stay updated with the latest trends and tips.",
  keywords: ["blogs", "articles", "career tips", "technology", "startups", "education", "student resources"],
  openGraph: {
    title: "Blogs & Articles | Startup Education",
    description: "Read insightful blogs and articles about careers, technology, startups, and education. Stay updated with the latest trends and tips.",
    url: "https://startup-education-six.vercel.app/blogs",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs & Articles | Startup Education",
    description: "Read insightful blogs and articles about careers, technology, startups, and education. Stay updated with the latest trends and tips.",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/blogs",
  },
};

export default function Layout({ children }) {
  return children;
}
