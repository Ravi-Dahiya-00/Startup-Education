export const metadata = {
  title: "Manage Notes",
  openGraph: {
    title: "Manage Notes | Startup Education",
    url: "https://startup-education-six.vercel.app/admin/notes",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Notes | Startup Education",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/admin/notes",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return children;
}
