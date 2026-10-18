'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

export default function SearchClientPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const matchedProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCategory = p.category.toLowerCase().includes(q);
      const matchSubcategory = p.subcategory.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      const matchDesc = p.description.toLowerCase().includes(q);
      return matchName || matchBrand || matchCategory || matchSubcategory || matchTags || matchDesc;
    });
  }, [query]);

  const suggestions = ['Bafang', 'Battery', 'Controller', 'Hydraulic Brakes', 'Display', 'Throttle'];

  return (
    <div style={{ padding: 'var(--space-8) 0 var(--space-20)', background: 'var(--color-bg)', minHeight: '75vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Search Results
          </h1>
          {query ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
              Showing {matchedProducts.length} results for <strong style={{ color: 'var(--color-text-primary)' }}>&ldquo;{query}&rdquo;</strong>
            </p>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
              Enter a keyword to search our catalog of electric bike components.
            </p>
          )}
        </div>

        {/* Popular Search Suggestions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
            Popular Searches:
          </span>
          {suggestions.map((sug) => (
            <Link
              key={sug}
              href={`/search?q=${encodeURIComponent(sug)}`}
              style={{
                fontSize: '0.8125rem',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              {sug}
            </Link>
          ))}
        </div>

        {matchedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', background: 'var(--color-white)', borderRadius: '1.25rem', border: '1px solid var(--color-border)' }}>
            <Search size={56} style={{ color: 'var(--color-text-tertiary)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Matching Products Found</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
              We couldn&apos;t find any items matching &ldquo;{query}&rdquo;. Try checking for spelling errors or browsing all categories.
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
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {matchedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
