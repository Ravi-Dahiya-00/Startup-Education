import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "Startup Education - Jobs, Internships, Courses & More",
    template: "%s | Startup Education",
  },
  description: "Find remote jobs, internships, competitions, scholarships, courses, and study notes. Your one-stop platform for career and education opportunities.",
  keywords: ["jobs", "internships", "courses", "scholarships", "competitions", "education", "startup", "remote jobs", "study notes"],
  openGraph: {
    title: "Startup Education",
    description: "Your one-stop platform for career and education opportunities.",
    type: "website",
    siteName: "Startup Education",
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Education",
    description: "Your one-stop platform for career and education opportunities.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-container">
            <Navbar />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
