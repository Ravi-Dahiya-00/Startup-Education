import { notFound } from 'next/navigation';
import API_URL from '@/lib/api';
import InternshipDetailClient from './InternshipDetailClient';

// Remove the old layout.js logic which we'll handle directly here or in a cleaner layout
export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    
    // Fallback to fetch by ID if migrating, but primary is slug
    let res = await fetch(`${API_URL}/api/internships/slug/${slug}`, { next: { revalidate: 3600 } });
    
    // If slug not found, try fetching by ID (backward compatibility)
    if (!res.ok && slug.length === 24) {
      res = await fetch(`${API_URL}/api/internships/${slug}`, { next: { revalidate: 3600 } });
    }
    
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
        url: `https://startup-education-six.vercel.app/internships/${slug}`,
        siteName: "Startup Education",
        type: "job",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Startup Education`,
        description,
      },
      alternates: {
        canonical: `https://startup-education-six.vercel.app/internships/${slug}`,
      },
    };
  } catch {
    return {
      title: "Internship Details",
      description: "View detailed internship listing including responsibilities, stipend, and how to apply.",
    };
  }
}

// Ensure it's a Server Component
export default async function InternshipPage({ params }) {
  const { slug } = await params;
  
  let internship = null;
  
  try {
    // Primary: fetch by slug
    let res = await fetch(`${API_URL}/api/internships/slug/${slug}`, { 
      next: { revalidate: 3600 },
      cache: 'force-cache'
    });
    
    // Fallback: fetch by ID for backward compatibility
    if (!res.ok && slug.length === 24) {
      res = await fetch(`${API_URL}/api/internships/${slug}`, { 
        next: { revalidate: 3600 },
        cache: 'force-cache'
      });
    }
    
    if (!res.ok) {
      notFound();
    }
    
    internship = await res.json();
  } catch (error) {
    console.error(`Error fetching internship ${slug}:`, error);
    notFound();
  }

  // Generate structured data for Google Jobs
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: internship.role,
    description: internship.description || internship.role,
    identifier: {
      '@type': 'PropertyValue',
      name: internship.company,
      value: internship._id
    },
    datePosted: internship.postedAt || internship.createdAt || new Date().toISOString(),
    validThrough: internship.deadline || new Date(Date.now() + 30*24*60*60*1000).toISOString(),
    employmentType: 'INTERN',
    hiringOrganization: {
      '@type': 'Organization',
      name: internship.company,
      sameAs: internship.companyWebsite,
      logo: internship.logo
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: internship.location,
        addressCountry: 'IN' // Defaulting to India, adjust if dynamic
      }
    },
  };

  if (internship.stipend && internship.stipend !== 'Unpaid') {
    // Basic extraction of numbers for baseSalary (Simplified for example)
    const stipendValue = internship.stipend.replace(/[^0-9]/g, '');
    if (stipendValue) {
      jsonLd.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: 'INR',
        value: {
          '@type': 'QuantitativeValue',
          value: parseInt(stipendValue, 10),
          unitText: 'MONTH'
        }
      };
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <InternshipDetailClient internship={internship} />
    </>
  );
}
