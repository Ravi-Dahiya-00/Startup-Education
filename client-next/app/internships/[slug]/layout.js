import API_URL from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_URL}/api/internships/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    
    const title = `${data.role} at ${data.company}` || "Internship Details";
    const description = data.description?.substring(0, 160) || "View detailed internship listing including responsibilities, stipend, and how to apply.";

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Startup Education`,
        description,
        url: `https://startup-education-six.vercel.app/internships/${id}`,
        siteName: "Startup Education",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Startup Education`,
        description,
      },
      alternates: {
        canonical: `https://startup-education-six.vercel.app/internships/${id}`,
      },
    };
  } catch {
    return {
      title: "Internship Details",
      description: "View detailed internship listing including responsibilities, stipend, and how to apply.",
    };
  }
}

export default function Layout({ children }) {
  return children;
}
