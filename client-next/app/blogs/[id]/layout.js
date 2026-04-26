import API_URL from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_URL}/api/blogs/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    
    const title = data.title || "Blog Post";
    const description = data.description?.substring(0, 160) || "Read this insightful article on Startup Education.";

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Startup Education`,
        description,
        url: `https://startup-education-six.vercel.app/blogs/${id}`,
        siteName: "Startup Education",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Startup Education`,
        description,
      },
      alternates: {
        canonical: `https://startup-education-six.vercel.app/blogs/${id}`,
      },
    };
  } catch {
    return {
      title: "Blog Post",
      description: "Read this insightful article on Startup Education.",
    };
  }
}

export default function Layout({ children }) {
  return children;
}
