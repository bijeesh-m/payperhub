import type { Metadata } from 'next';
import { Suspense } from 'react';
import CompareClientPage from './CompareClientPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Compare EV & Electric Bike Parts',
  description: 'Compare technical specifications, voltage, torque, battery capacity, compatibility, and pricing side-by-side to make the best choice for your EV build.',
  slug: 'compare',
  image: '/og-image.jpg',
  keywords: ['compare EV parts', 'compare e-bike motors', 'e-bike battery comparison'],
});

export default function ComparePage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#9ca3af' }}>Loading comparison…</div>}>
      <CompareClientPage />
    </Suspense>
  );
}
