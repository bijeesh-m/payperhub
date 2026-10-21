'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart2, Trash2, ShoppingCart, ArrowRight, Zap, Star } from 'lucide-react';
import { useCompareStore } from '@/store/compareStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';

export default function CompareClientPage() {
  const [mounted, setMounted] = React.useState(false);
  const { items, removeItem, clearCompare } = useCompareStore();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayItems = mounted ? items : [];

  // Extract all unique spec labels across compared products
  const allSpecKeys = Array.from(
    new Set(
      displayItems.flatMap((item) => item.specs?.map((s) => s.label) || [])
    )
  );

  return (
    <div style={{ padding: 'var(--space-8) 0 var(--space-20)', background: 'var(--color-bg)', minHeight: '70vh' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              Compare Products ({displayItems.length}/4)
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              Compare specifications, compatibility, and pricing side-by-side.
            </p>
          </div>

          {displayItems.length > 0 && (
            <button
              onClick={clearCompare}
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
              Clear Comparison
            </button>
          )}
        </div>

        {displayItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', background: 'var(--color-white)', borderRadius: '1rem', border: '1px solid var(--color-border)' }}>
            <BarChart2 size={56} style={{ color: 'var(--color-text-tertiary)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Products to Compare</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Add up to 4 items from our catalog to compare them side-by-side.
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
              Browse Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', background: 'var(--color-white)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <tbody>
                {/* Product Header Row */}
                <tr>
                  <td style={{ padding: '1.5rem', fontWeight: 700, width: '220px', background: 'var(--color-slate-50)', borderBottom: '1px solid var(--color-border)' }}>
                    Product
                  </td>
                  {displayItems.map((item) => (
                    <td key={item.id} style={{ padding: '1.5rem', verticalAlign: 'top', borderBottom: '1px solid var(--color-border)', minWidth: '240px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', padding: 4 }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div style={{ position: 'relative', height: '120px', background: 'var(--color-slate-100)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', overflow: 'hidden' }}>
                        {item.images?.[0]?.url ? (
                          <Image
                            src={item.images[0].url}
                            alt={item.name}
                            fill
                            sizes="240px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Zap size={36} color="#0ea5e9" />
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {item.brand}
                      </div>
                      <Link href={`/products/${item.slug}`} style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', textDecoration: 'none', display: 'block', marginTop: '4px' }}>
                        {item.name}
                      </Link>
                    </td>
                  ))}
                </tr>

                {/* Price Row */}
                <tr>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, background: 'var(--color-slate-50)', borderBottom: '1px solid var(--color-border)' }}>
                    Price
                  </td>
                  {displayItems.map((item) => (
                    <td key={item.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', fontWeight: 800, fontSize: '1.125rem' }}>
                      {formatPrice(item.price)}
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, background: 'var(--color-slate-50)', borderBottom: '1px solid var(--color-border)' }}>
                    Customer Rating
                  </td>
                    {displayItems.map((item) => (
                      <td key={item.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <span>{item.rating} ({item.reviewCount} reviews)</span>
                        </span>
                      </td>
                    ))}
                </tr>

                {/* Availability Row */}
                <tr>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, background: 'var(--color-slate-50)', borderBottom: '1px solid var(--color-border)' }}>
                    Stock Status
                  </td>
                  {displayItems.map((item) => (
                    <td key={item.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ color: item.inStock ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Specifications Matrix */}
                {allSpecKeys.map((key) => (
                  <tr key={key}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700, background: 'var(--color-slate-50)', borderBottom: '1px solid var(--color-border)', textTransform: 'capitalize' }}>
                      {key}
                    </td>
                    {displayItems.map((item) => {
                      const spec = item.specs?.find((s) => s.label === key);
                      return (
                        <td key={item.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                          {spec?.value || '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Action Row */}
                <tr>
                  <td style={{ padding: '1.5rem', background: 'var(--color-slate-50)' }}>
                    Action
                  </td>
                  {displayItems.map((item) => (
                    <td key={item.id} style={{ padding: '1.5rem' }}>
                      <button
                        onClick={() => {
                          if (item.inStock) {
                            addItem(item);
                            openCart();
                          }
                        }}
                        disabled={!item.inStock}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          background: item.inStock ? 'var(--color-primary)' : 'var(--color-border)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 'var(--radius-lg)',
                          fontWeight: 700,
                          cursor: item.inStock ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontSize: '0.875rem'
                        }}
                      >
                        <ShoppingCart size={14} />
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
