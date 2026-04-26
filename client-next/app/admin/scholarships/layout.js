export const metadata = {
  title: "Manage Scholarships",
  openGraph: {
    title: "Manage Scholarships | Startup Education",
    url: "https://startup-education-six.vercel.app/admin/scholarships",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Scholarships | Startup Education",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/admin/scholarships",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return children;
}
