export const metadata = {
  title: "Jobs",
  description: "Browse and apply for the latest remote and on-site jobs. Find full-time, part-time, and contract positions across top companies in India.",
  keywords: ["jobs", "remote jobs", "full time jobs", "part time jobs", "fresher jobs", "tech jobs", "India"],
  openGraph: {
    title: "Jobs | Startup Education",
    description: "Browse and apply for the latest remote and on-site jobs. Find full-time, part-time, and contract positions across top companies in India.",
    url: "https://startup-education-six.vercel.app/jobs",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobs | Startup Education",
    description: "Browse and apply for the latest remote and on-site jobs. Find full-time, part-time, and contract positions across top companies in India.",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/jobs",
  },
};

export default function Layout({ children }) {
  return children;
}
