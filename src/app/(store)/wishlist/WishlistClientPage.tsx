'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistClientPage() {
  const [mounted, setMounted] = React.useState(false);
  const { items, clearWishlist } = useWishlistStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayItems = mounted ? items : [];

  return (
    <div style={{ padding: 'var(--space-8) 0 var(--space-20)', background: 'var(--color-bg)', minHeight: '70vh' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              My Wishlist ({displayItems.length})
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Your saved favorite e-bike parts, ready whenever you need them.
            </p>
          </div>

          {displayItems.length > 0 && (
            <button
              onClick={clearWishlist}
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 14px',
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {displayItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', background: 'var(--color-white)', borderRadius: '1rem', border: '1px solid var(--color-border)' }}>
            <Heart size={56} style={{ color: 'var(--color-text-tertiary)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Wishlist is Empty</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Save parts you want to track by clicking the heart icon on any product card.
            </p>
            <Link
              href="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.5rem',
                background: 'var(--color-primary)',
                color: '#fff',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Explore Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {displayItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
