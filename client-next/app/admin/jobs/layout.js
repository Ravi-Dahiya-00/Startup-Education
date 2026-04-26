export const metadata = {
  title: "Manage Jobs",
  openGraph: {
    title: "Manage Jobs | Startup Education",
    url: "https://startup-education-six.vercel.app/admin/jobs",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Jobs | Startup Education",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/admin/jobs",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return children;
}
