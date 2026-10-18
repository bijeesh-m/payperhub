import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Zap, Battery, Shield, Star, ArrowRight,
  Truck, RotateCcw, Headphones, Award,
  TrendingUp, Package, CheckCircle
} from 'lucide-react';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { buildMetadata, SITE_NAME } from '@/lib/seo';
import { formatPrice } from '@/lib/utils';
import styles from './page.module.css';

export const metadata: Metadata = buildMetadata({
  title: 'Premium Electric Bike Parts & Accessories',
  description: `Shop ${SITE_NAME} for the best electric bike parts — motors, batteries, brakes, displays & more. Expert support. Fast shipping. 30-day returns.`,
  keywords: ['electric bike parts', 'e-bike motor', 'e-bike battery', 'ebike accessories', 'hub motor', 'mid drive motor'],
});

const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
const newArrivals = products.filter((p) => p.isNew).slice(0, 3);

const stats = [
  { value: '10K+', label: 'Happy Builders' },
  { value: '300+', label: 'Products' },
  { value: '4.8 / 5', label: 'Avg. Rating' },
  { value: '2-Day', label: 'Avg. Shipping' },
];

const trustFeatures = [
  { icon: <Truck size={22} />, title: 'Free Shipping', desc: 'On all orders over ₹1,999 across India.' },
  { icon: <RotateCcw size={22} />, title: '30-Day Returns', desc: 'Not satisfied? Return hassle-free.' },
  { icon: <Headphones size={22} />, title: 'Expert Support', desc: 'Pan-India e-bike experts, Mon–Sat.' },
  { icon: <Award size={22} />, title: 'Warranty Assured', desc: 'All parts come with manufacturer warranty.' },
];

const topBrands = ['Bafang', 'Shimano', 'Samsung SDI', 'Sabvoton', 'MXUS', 'Kenda', 'Ergon', 'A123 Systems'];

export default function HomePage() {
  return (
    <>
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.heroBadge}>
                <Zap size={12} />
                <span>The #1 E-Bike Parts Store</span>
              </div>
              <h1 className={styles.heroTitle}>
                Build Your Dream
                <br />
                <span>Electric Bike.</span>
              </h1>
              <p className={styles.heroDesc}>
                From motors to batteries, brakes to displays — everything you need to build,
                upgrade, or repair your e-bike. 300+ premium parts in stock with expert support.
              </p>
              <div className={styles.heroActions}>
                <Link href="/products" className="btn btn-primary btn-lg">
                  Shop All Parts <ArrowRight size={18} />
                </Link>
                <Link href="/products?category=motors-controllers" className="btn btn-outline btn-lg">
                  Browse Motors
                </Link>
              </div>

              {/* Stats */}
              <div className={styles.heroStats}>
                {stats.map((stat) => (
                  <div key={stat.label} className={styles.heroStat}>
                    <span className={styles.heroStatValue}>{stat.value}</span>
                    <span className={styles.heroStatLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className={styles.heroVisual}>
              <div className={styles.heroCard}>
                <div className={styles.heroCardInner}>
                  <div className={styles.motorAnim}>
                    <Zap size={80} className={styles.motorIcon} />
                    <div className={styles.motorRing} />
                    <div className={`${styles.motorRing} ${styles.motorRing2}`} />
                  </div>
                  <div className={styles.heroCardTitle}>Bafang M620 Ultra</div>
                  <div className={styles.heroCardSub}>1000W Mid-Drive Motor</div>
                  <div className={styles.heroCardPrice}>{formatPrice(549.99)}</div>
                  <div className={styles.heroCardBadge}>
                    <CheckCircle size={12} />
                    <span>In Stock — Ships Today</span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className={`${styles.floatBadge} ${styles.floatBadge1}`}>
                <TrendingUp size={14} /> Best Seller
              </div>
              <div className={`${styles.floatBadge} ${styles.floatBadge2}`}>
                <Package size={14} /> Free Shipping
              </div>
              <div className={`${styles.floatBadge} ${styles.floatBadge3}`}>
                <Star size={14} fill="currentColor" /> 4.8 / 5.0
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────── */}
      <section className={styles.trustBar}>
        <div className="container">
          <div className={styles.trustGrid}>
            {trustFeatures.map((feature) => (
              <div key={feature.title} className={styles.trustItem}>
                <div className={styles.trustIcon}>{feature.icon}</div>
                <div>
                  <div className={styles.trustTitle}>{feature.title}</div>
                  <div className={styles.trustDesc}>{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.sectionEyebrow}>Shop by Category</div>
              <h2 className={styles.sectionTitle}>Find Exactly What You Need</h2>
            </div>
            <Link href="/products" className="btn btn-outline">
              All Products <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.categoriesGrid}>
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={styles.categoryCard}
              >
                <div className={styles.categoryIcon}>
                  <CategoryIcon slug={cat.slug} size={32} />
                </div>
                <div className={styles.categoryInfo}>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <span className={styles.categoryCount}>{cat.productCount} products</span>
                </div>
                <ArrowRight size={16} className={styles.categoryArrow} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────── */}
      <section className={`section ${styles.featuredSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.sectionEyebrow}>
                <Zap size={14} /> Featured Products
              </div>
              <h2 className={styles.sectionTitle}>Top Picks for Your Build</h2>
            </div>
            <Link href="/products?featured=true" className="btn btn-outline">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ─────────────────────────────────── */}
      <section className={styles.promoBanner}>
        <div className="container">
          <div className={styles.promoGrid}>
            <div className={`${styles.promoCard} ${styles.promoCardLarge}`}>
              <div className={styles.promoContent}>
                <div className={styles.promoEyebrow}>
                  <Battery size={14} /> Top-Selling
                </div>
                <h2>Samsung 48V 17Ah Battery Pack</h2>
                <p>816Wh of range. Smart BMS. 800+ cycle life. Plug &amp; play.</p>
                <div className={styles.promoPrice}>
                  <span className={styles.promoPriceCurrent}>{formatPrice(389.99)}</span>
                  <span className={styles.promoPriceOld}>{formatPrice(449.99)}</span>
                  <span className={styles.promoPriceSave}>Save 13%</span>
                </div>
                <Link href="/products/samsung-48v-17ah-lithium-battery-pack" className="btn btn-primary">
                  Shop Now <ArrowRight size={14} />
                </Link>
              </div>
              <div className={styles.promoVisual}>
                <Battery size={80} className={styles.promoIcon} />
              </div>
            </div>

            <div className={styles.promoSmallStack}>
              <div className={`${styles.promoCard} ${styles.promoCardSmall} ${styles.promoCardDark}`}>
                <div className={styles.promoContent}>
                  <div className={styles.promoEyebrow}>
                    <Shield size={14} /> Safety First
                  </div>
                  <h3>Shimano XT Disc Brakes</h3>
                  <p>4-piston hydraulic stopping power</p>
                  <Link href="/products/shimano-deore-xt-hydraulic-disc-brake-set" className="btn btn-outline-white">
                    Shop <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className={`${styles.promoCard} ${styles.promoCardSmall} ${styles.promoCardAccent}`}>
                <div className={styles.promoContent}>
                  <div className={styles.promoEyebrow}>
                    <Zap size={14} /> New Arrival
                  </div>
                  <h3>Sabvoton FOC Controller</h3>
                  <p>72V/50A with Bluetooth programming</p>
                  <Link href="/products/ebike-controller-sabvoton-96v-72v-50a" className="btn btn-outline-white">
                    Shop <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.sectionEyebrow}>
                <TrendingUp size={14} /> Best Sellers
              </div>
              <h2 className={styles.sectionTitle}>Most Popular Parts</h2>
            </div>
            <Link href="/products?tag=best-selling" className="btn btn-outline">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className={styles.productsGrid}>
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className={`section ${styles.newArrivalsSection}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionEyebrow}>Fresh Stock</div>
                <h2 className={styles.sectionTitle}>New Arrivals</h2>
              </div>
              <Link href="/products?isNew=true" className="btn btn-outline">
                See All New <ArrowRight size={14} />
              </Link>
            </div>

            <div className={styles.productsGrid}>
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRANDS ───────────────────────────────────────── */}
      <section className={styles.brandsSection}>
        <div className="container">
          <div className={styles.brandsSectionHeader}>
            <h2>Trusted Brands</h2>
            <p>We carry only the most reliable, performance-tested brands in the e-bike industry.</p>
          </div>
          <div className={styles.brandsGrid}>
            {topBrands.map((brand) => (
              <Link
                key={brand}
                href={`/products?brand=${encodeURIComponent(brand)}`}
                className={styles.brandChip}
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <div className={styles.ctaIcon}>
              <Zap size={32} />
            </div>
            <h2>Ready to Go Electric?</h2>
            <p>
              Browse our full catalog of 300+ e-bike components. Expert support available
              7 days a week to help you find the right parts for your build.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/products" className="btn btn-white btn-lg">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link href="/products?category=motors-controllers" className="btn btn-outline-white btn-lg">
                View Motors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
