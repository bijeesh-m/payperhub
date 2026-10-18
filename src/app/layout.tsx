import type { Metadata } from 'next';
import './globals.css';
import { buildOrganizationJsonLd, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Premium Electric Bike Parts`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: 'electric bike parts, e-bike motors, e-bike batteries, ebike controller, hub motor, mid drive motor, e-bike accessories',
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://payperhub.com'),
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
