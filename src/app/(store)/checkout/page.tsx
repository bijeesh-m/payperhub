import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutClientPage from './CheckoutClientPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Secure Checkout',
  description: 'Complete your order with 256-bit SSL encryption. Fast UPI, card, and netbanking payments with pan-India delivery on all EV parts and components.',
  slug: 'checkout',
  image: '/og-image.jpg',
  noIndex: true,
  keywords: ['checkout', 'secure payment', 'buy EV parts India'],
});

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#9ca3af' }}>Loading checkout…</div>}>
      <CheckoutClientPage />
    </Suspense>
  );
}
