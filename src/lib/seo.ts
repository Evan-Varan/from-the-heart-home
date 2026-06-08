const SITE_URL = "https://fromthehearttutoring.com";
const SITE_NAME = "From the Heart Tutoring";
const DEFAULT_IMAGE = "/og-image.jpg";

type SeoOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
};

export function buildSeo({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  noindex,
}: SeoOptions) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:image:alt", content: `${SITE_NAME} online tutoring` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo-full.png"),
    image: absoluteUrl(DEFAULT_IMAGE),
    email: "info@fromthehearttutoring.com",
    telephone: "+1-512-966-6064",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    sameAs: [SITE_URL],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function tutoringServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Online tutoring",
    provider: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    serviceType: "One-on-one virtual tutoring",
    offers: {
      "@type": "Offer",
      price: "70",
      priceCurrency: "USD",
      description: "60-minute one-on-one virtual tutoring session",
      availability: "https://schema.org/InStock",
    },
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function jsonLdScript(data: unknown) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
