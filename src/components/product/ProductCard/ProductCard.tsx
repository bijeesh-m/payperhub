'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, BarChart2, Star, Check, Zap, AlertCircle } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { formatPrice } from '@/lib/utils';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export default function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const addItem = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => s.isInCart(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const rawIsInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const toggleCompare = useCompareStore((s) => s.toggleItem);
  const rawIsInCompare = useCompareStore((s) => s.isInCompare(product.id));
  const compareIsFull = useCompareStore((s) => s.isFull());

  const isInWishlist = mounted && rawIsInWishlist;
  const isInCompare = mounted && rawIsInCompare;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isInCompare && compareIsFull) return;
    toggleCompare(product);
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : product.discount;

  return (
    <article className={`${styles.card} ${layout === 'list' ? styles.listCard : ''}`}>
      <Link href={`/products/${product.slug}`} className={styles.imageWrapper}>
        {/* Product Image Placeholder */}
        <div className={styles.imagePlaceholder} aria-label={product.images[0]?.alt}>
          <Zap size={40} className={styles.placeholderIcon} />
          <span className={styles.placeholderCategory}>{product.subcategory}</span>
        </div>

        {/* Badges */}
        <div className={styles.badges}>
          {product.isNew && <span className={`badge badge-new ${styles.badge}`}>NEW</span>}
          {product.isBestSeller && <span className={`badge badge-accent ${styles.badge}`}>Best Seller</span>}
          {discount && discount > 0 && (
            <span className={`badge badge-error ${styles.badge}`}>-{discount}%</span>
          )}
          {!product.inStock && (
            <span className={`badge ${styles.badge} ${styles.badgeOutOfStock}`}>Out of Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${isInWishlist ? styles.actionActive : ''}`}
            onClick={handleWishlist}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            className={`${styles.actionBtn} ${isInCompare ? styles.actionActive : ''} ${!isInCompare && compareIsFull ? styles.actionDisabled : ''}`}
            onClick={handleCompare}
            aria-label={isInCompare ? 'Remove from compare' : 'Add to compare'}
            title={isInCompare ? 'Remove from compare' : compareIsFull ? 'Compare list is full (max 4)' : 'Add to compare'}
          >
            <BarChart2 size={16} />
          </button>
        </div>
      </Link>

      <div className={styles.body}>
        {/* Brand */}
        <div className={styles.brand}>{product.brand}</div>

        {/* Name */}
        <Link href={`/products/${product.slug}`} className={styles.nameLink}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className={styles.rating}>
          <div className={styles.stars} aria-label={`${product.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className={styles.ratingValue}>{product.rating}</span>
          <span className={styles.reviewCount}>({product.reviewCount})</span>
        </div>

        {/* Short description (list layout only) */}
        {layout === 'list' && (
          <p className={styles.shortDesc}>{product.shortDescription}</p>
        )}

        {/* Price & CTA */}
        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <button
            className={`${styles.cartBtn} ${addedToCart ? styles.cartBtnAdded : ''} ${!product.inStock ? styles.cartBtnDisabled : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            aria-label={addedToCart ? 'Added to cart' : `Add ${product.name} to cart`}
          >
            {addedToCart ? (
              <>
                <Check size={14} />
                <span>Added!</span>
              </>
            ) : !product.inStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {/* Stock indicator */}
        {product.inStock && product.stockCount <= 5 && (
          <div className={styles.lowStock}>
            <AlertCircle size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} />
            Only {product.stockCount} left in stock
          </div>
        )}
      </div>
    </article>
  );
}
