export const metadata = {
  title: "Manage Competitions",
  openGraph: {
    title: "Manage Competitions | Startup Education",
    url: "https://startup-education-six.vercel.app/admin/competitions",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Competitions | Startup Education",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/admin/competitions",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return children;
}
