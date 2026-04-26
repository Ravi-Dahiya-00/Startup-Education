import API_URL from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_URL}/api/competitions/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    
    const title = data.title || "Competition Details";
    const description = data.description?.substring(0, 160) || "View competition details, prizes, deadlines, and how to participate.";

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Startup Education`,
        description,
        url: `https://startup-education-six.vercel.app/competitions/${id}`,
        siteName: "Startup Education",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Startup Education`,
        description,
      },
      alternates: {
        canonical: `https://startup-education-six.vercel.app/competitions/${id}`,
      },
    };
  } catch {
    return {
      title: "Competition Details",
      description: "View competition details, prizes, deadlines, and how to participate.",
    };
  }
}

export default function Layout({ children }) {
  return children;
}
