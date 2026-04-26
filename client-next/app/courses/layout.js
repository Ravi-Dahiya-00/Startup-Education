export const metadata = {
  title: "Courses",
  description: "Explore free and paid online courses in programming, data science, design, business, and more from top educators.",
  keywords: ["online courses", "free courses", "programming courses", "data science", "design courses"],
  openGraph: {
    title: "Courses | Startup Education",
    description: "Explore free and paid online courses in programming, data science, design, business, and more from top educators.",
    url: "https://startup-education-six.vercel.app/courses",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Courses | Startup Education",
    description: "Explore free and paid online courses in programming, data science, design, business, and more from top educators.",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/courses",
  },
};

export default function Layout({ children }) {
  return children;
}
