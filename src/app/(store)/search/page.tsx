import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchClientPage from './SearchClientPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Search EV & Electric Bike Parts',
  description: 'Search our full catalog of 300+ electric vehicle parts, brushless motors, lithium battery packs, smart FOC inverters, hydraulic brakes, and accessories.',
  slug: 'search',
  image: '/og-image.jpg',
  keywords: [
    'search EV parts',
    'search e-bike motors',
    'find electric scooter parts',
    'EV components search',
  ],
});

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <div className="skeleton" style={{ height: '40px', width: '200px', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: '1rem' }} />
        </div>
      }
    >
      <SearchClientPage />
    </Suspense>
  );
}
