export const metadata = {
  title: "Manage Blogs",
  openGraph: {
    title: "Manage Blogs | Startup Education",
    url: "https://startup-education-six.vercel.app/admin/blogs",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Blogs | Startup Education",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/admin/blogs",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return children;
}
