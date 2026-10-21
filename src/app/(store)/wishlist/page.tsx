import type { Metadata } from 'next';
import { Suspense } from 'react';
import WishlistClientPage from './WishlistClientPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'My Saved Wishlist',
  description: 'View your saved electric vehicle parts, high-performance motors, battery packs, and accessories on Payperhub.',
  slug: 'wishlist',
  image: '/og-image.jpg',
  noIndex: true,
  keywords: ['saved EV parts', 'wishlist Payperhub', 'favorite e-bike components'],
});

export default function WishlistPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#9ca3af' }}>Loading wishlist…</div>}>
      <WishlistClientPage />
    </Suspense>
  );
}
