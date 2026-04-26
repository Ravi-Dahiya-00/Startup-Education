export const metadata = {
  title: "Manage Internships",
  openGraph: {
    title: "Manage Internships | Startup Education",
    url: "https://startup-education-six.vercel.app/admin/internships",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Internships | Startup Education",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/admin/internships",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return children;
}
