import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchClientPage from './SearchClientPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Search Results — Electric Bike Parts',
  description: 'Search for electric bike motors, batteries, controllers, throttles, and accessories.',
  slug: 'search',
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
