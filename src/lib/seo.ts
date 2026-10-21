import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://payperhub.com';
const SITE_NAME = 'Payperhub';
const SITE_DESCRIPTION = 'Payperhub — India\'s leading electric bike parts store. Premium motors, batteries, brakes, controllers & accessories with fast pan-India shipping.';

export function buildMetadata({
  title,
  description,
  slug,
  image,
  type = 'website',
  keywords,
  noIndex = false,
}: {
  title: string;
  description: string;
  slug?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = slug ? `${BASE_URL}/${slug}` : BASE_URL;
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`
    : `${BASE_URL}/og-image.jpg`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: keywords?.join(', '),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
      creator: '@payperhub',
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },
  };
}

export function buildProductJsonLd(product: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image?: string;
  brand: string;
  sku: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    image: product.image ? [`${BASE_URL}${product.image}`] : [],
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/products/${product.slug}`,
      priceCurrency: product.currency || 'INR',
      price: product.price.toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: SITE_NAME },
    },
    ...(product.rating && product.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/payperhub',
      'https://facebook.com/payperhub',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-1800-208-3727',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

export { BASE_URL, SITE_NAME, SITE_DESCRIPTION };
