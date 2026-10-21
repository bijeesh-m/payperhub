'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  const currentItems = mounted ? items : [];
  const totalItems = mounted ? getTotalItems() : 0;
  const totalPrice = mounted ? getTotalPrice() : 0;
  const shippingThreshold = 1999;
  const shipping = totalPrice >= shippingThreshold ? 0 : 149;
  const grandTotal = totalPrice + shipping;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`${styles.drawer} ${isOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShoppingCart size={20} />
            <h2>Your Cart</h2>
            {totalItems > 0 && (
              <span className={styles.itemCount}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            )}
          </div>
          <button onClick={closeCart} className={styles.closeBtn} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {currentItems.length === 0 ? (
            <div className={styles.emptyState}>
              <ShoppingBag size={56} className={styles.emptyIcon} />
              <h3>Your cart is empty</h3>
              <p>Add some electric bike parts to get started!</p>
              <Link href="/products" className="btn btn-primary" onClick={closeCart}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {currentItems.map((item) => (
                <div key={item.product.id} className={styles.cartItem}>
                  {/* Product Image */}
                  <div className={styles.itemImageWrapper}>
                    {item.product.images?.[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        sizes="72px"
                        className={styles.itemImage}
                      />
                    ) : (
                      <div className={styles.itemImagePlaceholder}>
                        <Zap size={22} color="#0ea5e9" />
                      </div>
                    )}
                  </div>

                  <div className={styles.itemInfo}>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className={styles.itemName}
                      onClick={closeCart}
                    >
                      {item.product.name}
                    </Link>
                    <div className={styles.itemBrand}>{item.product.brand}</div>
                    <div className={styles.itemSku}>SKU: {item.product.sku}</div>

                    <div className={styles.itemFooter}>
                      {/* Quantity Controls */}
                      <div className={styles.qtyControls}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          disabled={item.quantity >= item.product.stockCount}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className={styles.itemPriceRow}>
                        <span className={styles.itemPrice}>
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeItem(item.product.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {currentItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className={shipping === 0 ? styles.freeShipping : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <div className={styles.shippingNote}>
                  Add {formatPrice(shippingThreshold - totalPrice)} more for free shipping
                </div>
              )}
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className={`btn btn-accent btn-lg ${styles.checkoutBtn}`}
              onClick={closeCart}
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/cart"
              className={`btn btn-outline ${styles.viewCartBtn}`}
              onClick={closeCart}
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
