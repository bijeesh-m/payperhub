import type { Metadata } from 'next';
import './globals.css';
import { buildOrganizationJsonLd, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';
import InitialLoader from '@/components/ui/InitialLoader';

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Premium Electric Vehicle & EV Parts`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: 'electric vehicle parts, EV parts, electric bike parts, e-bike motors, lithium battery packs, ebike controller, hub motor, mid drive motor, EV accessories, India',
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://payperhub.com'),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    title: `${SITE_NAME} — Premium Electric Vehicle & EV Parts`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Premium Electric Vehicle & EV Parts`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Premium Electric Vehicle & EV Parts`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.jpg'],
    creator: '@payperhub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = buildOrganizationJsonLd();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="preload" href="/loading-poster.jpg" as="image" />
        <link rel="preload" href="/loading.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/logo.png" as="image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Payperhub" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <InitialLoader />
        {children}
      </body>
    </html>
  );
}
