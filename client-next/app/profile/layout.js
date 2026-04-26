export const metadata = {
  title: "My Profile",
  description: "Manage your Startup Education profile, track applications, and update your preferences.",
  keywords: ["profile", "account settings", "dashboard"],
  openGraph: {
    title: "My Profile | Startup Education",
    description: "Manage your Startup Education profile, track applications, and update your preferences.",
    url: "https://startup-education-six.vercel.app/profile",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Profile | Startup Education",
    description: "Manage your Startup Education profile, track applications, and update your preferences.",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/profile",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return children;
}
