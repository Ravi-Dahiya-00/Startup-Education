export const metadata = {
  title: "Manage Courses",
  openGraph: {
    title: "Manage Courses | Startup Education",
    url: "https://startup-education-six.vercel.app/admin/courses",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Courses | Startup Education",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/admin/courses",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return children;
}
