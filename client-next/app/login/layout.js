export const metadata = {
  title: "Login",
  description: "Sign in to your Startup Education account to access jobs, internships, courses, and more.",
  keywords: ["login", "sign in", "student account", "startup education"],
  openGraph: {
    title: "Login | Startup Education",
    description: "Sign in to your Startup Education account to access jobs, internships, courses, and more.",
    url: "https://startup-education-six.vercel.app/login",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login | Startup Education",
    description: "Sign in to your Startup Education account to access jobs, internships, courses, and more.",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/login",
  },
};

export default function Layout({ children }) {
  return children;
}
