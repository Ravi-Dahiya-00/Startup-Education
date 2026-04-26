import API_URL from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_URL}/api/courses/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    
    const title = data.title || "Course Details";
    const description = data.description?.substring(0, 160) || "View course details, curriculum, and enrollment information.";

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Startup Education`,
        description,
        url: `https://startup-education-six.vercel.app/courses/${id}`,
        siteName: "Startup Education",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Startup Education`,
        description,
      },
      alternates: {
        canonical: `https://startup-education-six.vercel.app/courses/${id}`,
      },
    };
  } catch {
    return {
      title: "Course Details",
      description: "View course details, curriculum, and enrollment information.",
    };
  }
}

export default function Layout({ children }) {
  return children;
}
