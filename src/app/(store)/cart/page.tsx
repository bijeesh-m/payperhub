import type { Metadata } from 'next';
import { Suspense } from 'react';
import CartClientPage from './CartClientPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Shopping Cart',
  description: 'Review your selected electric vehicle parts, batteries, motors, and accessories. Secure checkout with free express shipping across India on orders over ₹1,999.',
  slug: 'cart',
  image: '/og-image.jpg',
  keywords: ['shopping cart', 'checkout e-bike parts', 'cart Payperhub', 'EV parts cart'],
});

export default function CartPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#9ca3af' }}>Loading cart…</div>}>
      <CartClientPage />
    </Suspense>
  );
}
