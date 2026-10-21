'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck, Zap, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import styles from './CartPage.module.css';

export default function CartClientPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getTotalPrice();
  const freeShippingThreshold = 1999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const shippingCost = subtotal === 0 || isFreeShipping ? 0 : 149;
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'ELECTRIC10') {
      setDiscountPercent(10);
      setCouponMsg({ text: '10% discount applied successfully!' });
    } else if (code === 'VOLT20') {
      setDiscountPercent(20);
      setCouponMsg({ text: '20% VIP discount applied!' });
    } else {
      setCouponMsg({ text: 'Invalid promotional code. Try ELECTRIC10', error: true });
    }
  };

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.emptyState}>
            <ShoppingBag size={64} className={styles.emptyIcon} />
            <h1 className={styles.emptyTitle}>Your Shopping Cart is Empty</h1>
            <p className={styles.emptyDesc}>
              Looks like you haven&apos;t added any e-bike parts to your cart yet.
            </p>
            <Link href="/products" className={styles.exploreBtn}>
              Explore Parts & Accessories <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Shopping Cart ({getTotalItems()} items)</h1>

        {/* Free Shipping Banner */}
        <div className={styles.shippingBar}>
          <div className={styles.shippingText}>
            <Truck size={18} color="#0ea5e9" />
            {isFreeShipping ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span>Great news! You have unlocked <strong>FREE Standard Shipping across India</strong>!</span>
              </span>
            ) : (
              <span>
                Add <strong>{formatPrice(freeShippingThreshold - subtotal)}</strong> more to get <strong>FREE Shipping</strong>!
              </span>
            )}
          </div>
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} style={{ width: `${shippingProgress}%` }} />
          </div>
        </div>

        <div className={styles.cartLayout}>
          {/* Cart Items List */}
          <div>
            <div className={styles.itemsCard}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Zap size={28} />
                  </div>

                  <div className={styles.itemInfo}>
                    <span className={styles.itemBrand}>{item.product.brand}</span>
                    <Link href={`/products/${item.product.slug}`} className={styles.itemName}>
                      {item.product.name}
                    </Link>
                    <span className={styles.itemUnitPrice}>{formatPrice(item.product.price)} each</span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className={styles.qtyControls}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className={styles.qtyVal}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stockCount}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className={styles.itemSubtotal}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>

                  {/* Delete Button */}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removeItem(item.product.id)}
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-tertiary)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {discountPercent > 0 && (
              <div className={styles.summaryRow} style={{ color: '#16a34a' }}>
                <span>Discount ({discountPercent}%)</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>Estimated Shipping</span>
              <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Estimated Tax (Calculated at checkout)</span>
              <span>$0.00</span>
            </div>

            {/* Coupon Field */}
            <form onSubmit={handleApplyCoupon} className={styles.couponBox}>
              <input
                type="text"
                placeholder="PROMO CODE"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className={styles.couponInput}
              />
              <button type="submit" className={styles.couponBtn}>Apply</button>
            </form>
            {couponMsg && (
              <div style={{ fontSize: '0.75rem', color: couponMsg.error ? '#dc2626' : '#16a34a', marginBottom: '1rem' }}>
                {couponMsg.text}
              </div>
            )}

            <div className={styles.summaryRowTotal}>
              <span>Estimated Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Link href="/checkout" className={styles.checkoutBtn} style={{ marginTop: '1.5rem' }}>
              Proceed to Checkout <ArrowRight size={18} />
            </Link>

            <Link href="/products" className={styles.continueShopping}>
              ← Continue Shopping
            </Link>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', justifyContent: 'center' }}>
              <ShieldCheck size={16} color="var(--color-success)" />
              <span>Guaranteed Safe & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
