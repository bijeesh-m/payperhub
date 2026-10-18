import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsClientPage from './ProductsClientPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Shop Electric Bike Parts',
  description: 'Browse 300+ electric bike parts — motors, batteries, brakes, displays, tires & accessories. Filter by brand, price, rating & more.',
  slug: 'products',
  keywords: ['electric bike parts', 'e-bike motor', 'e-bike battery', 'buy ebike parts online'],
});

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{padding:'4rem', textAlign:'center', color:'#9ca3af'}}>Loading products…</div>}>
      <ProductsClientPage />
    </Suspense>
  );
}
