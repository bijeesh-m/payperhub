'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, ShoppingCart, BarChart2, Star, Check, 
  Truck, ShieldCheck, RotateCcw, Headphones, 
  Zap, ChevronRight, PackageCheck, AlertCircle
} from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/product/ProductCard';
import styles from './ProductDetail.module.css';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'shipping' | 'reviews'>('specs');
  const [justAdded, setJustAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const toggleCompare = useCompareStore((s) => s.toggleItem);
  const isInCompare = useCompareStore((s) => s.isInCompare(product.id));
  const compareIsFull = useCompareStore((s) => s.isFull());

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product, quantity);
    setJustAdded(true);
    openCart();
    setTimeout(() => setJustAdded(false), 2500);
  };

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stockCount || 99, prev + delta)));
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : product.discount;

  const currentImage = product.images?.[selectedImageIndex] || product.images?.[0];

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} className={styles.breadcrumbSeparator} />
          <Link href="/products">Products</Link>
          <ChevronRight size={12} className={styles.breadcrumbSeparator} />
          <Link href={`/products?category=${product.category}`}>{product.subcategory}</Link>
          <ChevronRight size={12} className={styles.breadcrumbSeparator} />
          <span className={styles.breadcrumbCurrent}>{product.name}</span>
        </nav>

        {/* Product Showcase Grid */}
        <div className={styles.productGrid}>
          {/* Gallery Column */}
          <div className={styles.gallerySection}>
            <div className={styles.mainImageWrapper}>
              <div className={styles.badgesOverlay}>
                {product.isNew && <span className="badge badge-new">NEW</span>}
                {product.isBestSeller && <span className="badge badge-accent">Best Seller</span>}
                {discount && discount > 0 && <span className="badge badge-error">-{discount}% OFF</span>}
              </div>

              {currentImage?.url ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || product.name}
                  fill
                  priority
                  sizes="(max-width: 992px) 100vw, 50vw"
                  className={styles.mainImage}
                />
              ) : (
                <Zap size={96} className={styles.mainPlaceholderIcon} />
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className={styles.thumbList}>
                {product.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    className={`${styles.thumbItem} ${selectedImageIndex === idx ? styles.thumbItemActive : ''}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={img.alt || `Product image ${idx + 1}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      sizes="72px"
                      className={styles.thumbImage}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className={styles.infoSection}>
            <div className={styles.brandRow}>
              <span className={styles.brandName}>{product.brand}</span>
              <span className={styles.sku}>SKU: {product.sku}</span>
            </div>

            <h1 className={styles.productTitle}>{product.name}</h1>

            {/* Reviews summary */}
            <div className={styles.reviewsRating}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className={styles.ratingNumber}>{product.rating}</span>
              <button 
                className={styles.reviewCountLink} 
                onClick={() => setActiveTab('reviews')}
              >
                ({product.reviewCount} customer reviews)
              </button>
            </div>

            {/* Price display */}
            <div className={styles.pricingRow}>
              <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className={styles.comparePrice}>{formatPrice(product.compareAtPrice)}</span>
                  <span className={styles.savingsTag}>
                    Save {formatPrice(product.compareAtPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Stock indicator */}
            <div className={styles.stockStatus}>
              {product.inStock ? (
                product.stockCount <= 5 ? (
                  <span className={styles.lowStockText}>
                    <AlertCircle size={16} style={{ display: 'inline', verticalAlign: '-3px' }} /> Only {product.stockCount} left in stock — order soon!
                  </span>
                ) : (
                  <span className={styles.inStockText}>
                    <PackageCheck size={16} style={{ display: 'inline', verticalAlign: '-3px' }} /> In Stock & Ready to Ship
                  </span>
                )
              ) : (
                <span className={styles.outOfStockText}>
                  <AlertCircle size={16} style={{ display: 'inline', verticalAlign: '-3px' }} /> Currently Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className={styles.description}>{product.description}</p>

            {/* Actions: Quantity Stepper & Add to Cart */}
            <div className={styles.actionsRow}>
              <div className={styles.qtySelector}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => handleQtyChange(-1)}
                  disabled={quantity <= 1 || !product.inStock}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => handleQtyChange(1)}
                  disabled={quantity >= product.stockCount || !product.inStock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {justAdded ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : !product.inStock ? (
                  <span>Out of Stock</span>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Add to Cart — {formatPrice(product.price * quantity)}</span>
                  </>
                )}
              </button>

              <button
                className={`${styles.iconBtn} ${isInWishlist ? styles.iconBtnActive : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
                title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>

              <button
                className={`${styles.iconBtn} ${isInCompare ? styles.iconBtnActive : ''}`}
                onClick={() => toggleCompare(product)}
                aria-label={isInCompare ? 'Remove from compare' : 'Compare product'}
                title={isInCompare ? 'Remove from compare' : compareIsFull ? 'Compare full' : 'Compare product'}
              >
                <BarChart2 size={20} />
              </button>
            </div>

            {/* Trust Assurances */}
            <div className={styles.trustList}>
              <div className={styles.trustItem}>
                <Truck size={16} className={styles.trustIcon} />
                <span>Free shipping on orders over ₹1,999</span>
              </div>
              <div className={styles.trustItem}>
                <ShieldCheck size={16} className={styles.trustIcon} />
                <span>Official 1-Year Manufacturer Warranty</span>
              </div>
              <div className={styles.trustItem}>
                <RotateCcw size={16} className={styles.trustIcon} />
                <span>30-Day Hassle-Free Returns</span>
              </div>
              <div className={styles.trustItem}>
                <Headphones size={16} className={styles.trustIcon} />
                <span>Dedicated Technical Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabHeaders}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'specs' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Technical Specifications
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'desc' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('desc')}
            >
              Compatibility & Fitment
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'shipping' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping & Warranty
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Verified Reviews ({product.reviewCount})
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'specs' && (
              <table className={styles.specsTable}>
                <tbody>
                  {product.specs?.map((spec) => (
                    <tr key={spec.label}>
                      <td className={styles.specsLabel}>{spec.label}</td>
                      <td className={styles.specsVal}>{spec.value}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className={styles.specsLabel}>Brand</td>
                    <td className={styles.specsVal}>{product.brand}</td>
                  </tr>
                  <tr>
                    <td className={styles.specsLabel}>Part Number / SKU</td>
                    <td className={styles.specsVal}>{product.sku}</td>
                  </tr>
                  <tr>
                    <td className={styles.specsLabel}>Subcategory</td>
                    <td className={styles.specsVal}>{product.subcategory}</td>
                  </tr>
                </tbody>
              </table>
            )}

            {activeTab === 'desc' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                  System Compatibility
                </h3>
                <p style={{ lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  This genuine {product.brand} component is designed to OEM specifications. It complies with standard e-bike wiring harnesses and mounting bracket points.
                </p>
                <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
                  <li>Direct replacement for OEM e-bike assemblies</li>
                  <li>Plug-and-play quick disconnect waterproof Julet / Higo cables</li>
                  <li>Weather-sealed housing rated for IP65 water resistance</li>
                  <li>Operating temperature range: -20°C to +60°C</li>
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Fast & Insured Delivery
                </h3>
                <p style={{ lineHeight: 1.6, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  Orders placed before 2:00 PM IST dispatch the same business day from our Bengaluru fulfillment center. All parcels are fully insured and include door-to-door tracking across India.
                </p>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                  1-Year Full Replacement Warranty
                </h4>
                <p style={{ lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
                  Every item sold by Payperhub comes with our comprehensive 12-month manufacturer replacement warranty against defects in materials and craftsmanship.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{product.rating}</div>
                  <div>
                    <div className={styles.stars}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} className={styles.starFilled} fill="currentColor" />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Based on {product.reviewCount} customer ratings
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>Verified Buyer — Mark T.</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>2 weeks ago</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Outstanding quality. Exactly as described, installed within 20 minutes on my custom build. Torque and thermal performance are top tier!
                    </p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--color-slate-50)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>Verified Buyer — Sarah L.</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>1 month ago</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      Quick shipping, arrived well-packaged with all the cables and connectors. Customer service helped me confirm pinout compatibility before purchasing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Frequently Bought Together & Related Parts</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
