export const metadata = {
  title: "University Notes",
  description: "Access study notes, previous year question papers, lab manuals, and more. Upload and share notes with fellow students.",
  keywords: ["university notes", "study material", "PYQ", "lab manual", "college notes", "engineering notes"],
  openGraph: {
    title: "University Notes | Startup Education",
    description: "Access study notes, previous year question papers, lab manuals, and more. Upload and share notes with fellow students.",
    url: "https://startup-education-six.vercel.app/notes",
    siteName: "Startup Education",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "University Notes | Startup Education",
    description: "Access study notes, previous year question papers, lab manuals, and more. Upload and share notes with fellow students.",
  },
  alternates: {
    canonical: "https://startup-education-six.vercel.app/notes",
  },
};

export default function Layout({ children }) {
  return children;
}
