import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsClientPage from './ProductsClientPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'All EV & Electric Bike Parts Catalog',
  description: 'Explore 300+ tested electric vehicle components — high-power mid-drive & hub motors, lithium battery packs, FOC controllers, hydraulic disc brakes, smart displays & EV accessories. Filter by brand, voltage, price & vehicle compatibility.',
  slug: 'products',
  image: '/og-image.jpg',
  keywords: [
    'electric vehicle parts catalog',
    'buy e-bike motors online',
    'e-bike lithium battery India',
    'hydraulic ebike brakes',
    'FOC motor controller',
    'EV conversion kit parts',
  ],
});

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{padding:'4rem', textAlign:'center', color:'#9ca3af'}}>Loading products…</div>}>
      <ProductsClientPage />
    </Suspense>
  );
}
