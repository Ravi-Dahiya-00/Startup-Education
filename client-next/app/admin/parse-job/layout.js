export const metadata = {
  title: "AI Job Parser",
  openGraph: {
    title: "AI Job Parser | Startup Education",
    url: "https://startup-education-six.vercel.app/admin/parse-job",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Job Parser | Startup Education",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/admin/parse-job",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return children;
}
