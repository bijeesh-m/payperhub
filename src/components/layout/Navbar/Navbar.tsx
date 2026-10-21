'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  ChevronDown,
  User,
  BarChart2,
  Phone,
  Truck,
  Headphones,
  LayoutGrid,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { categories } from '@/data/products';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = useCartStore((s) => s.getTotalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const compareCount = useCompareStore((s) => s.items.length);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryOpen(false);
    setIsMobileSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        <div className="container">
          <div className={styles.announcementLeft}>
            <span className={styles.announcementItem}>
              <Truck size={14} className={styles.announcementIconTruck} />
              <span className={styles.announcementText}>Free shipping across India on orders over ₹1,999</span>
            </span>
            <span className={styles.announcementDivider}>|</span>
            <span className={`${styles.announcementItem} ${styles.announcementHideMobile}`}>
              <Headphones size={14} className={styles.announcementIconSupport} />
              <span className={styles.announcementText}>Pan-India Expert E-Bike Support</span>
            </span>
          </div>
          <div className={styles.announcementRight}>
            <Link href="tel:+9118002083727" className={styles.announcementLink}>
              <Phone size={12} /> 1800-208-PAYPERHUB
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={styles.navbarMain}>
        <div className="container">
          <nav className={styles.nav}>
            {/* Left Group */}
            <div className={styles.navLeft}>
              {/* Logo */}
              <Link href="/" className={styles.logo} aria-label="Payperhub - Premium E-Bike Store">
                <Image
                  src="/logo.png"
                  alt="Payperhub"
                  width={168}
                  height={38}
                  priority
                  className={styles.logoImg}
                />
              </Link>

              {/* Categories Dropdown */}
              <div className={styles.categoryDropdownWrapper} ref={dropdownRef}>
                <button
                  type="button"
                  className={`${styles.categoryBtn} ${isCategoryOpen ? styles.categoryBtnActive : ''}`}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  aria-expanded={isCategoryOpen}
                  aria-haspopup="true"
                  aria-label="Browse categories"
                >
                  <span className={styles.categoryIconWrap}>
                    <LayoutGrid size={15} />
                  </span>
                  <span className={styles.categoryBtnText}>Categories</span>
                  <ChevronDown
                    size={14}
                    className={`${styles.categoryChevron} ${isCategoryOpen ? styles.chevronOpen : ''}`}
                  />
                </button>

                {isCategoryOpen && (
                  <div className={styles.categoryDropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownHeaderLeft}>
                        <span className={styles.dropdownHeaderBadge}>Catalog</span>
                        <span className={styles.dropdownHeaderTitle}>Browse by Category</span>
                      </div>
                      <Link
                        href="/products"
                        className={styles.dropdownViewAll}
                        onClick={() => setIsCategoryOpen(false)}
                      >
                        <span>All Products</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div className={styles.dropdownGrid}>
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          className={styles.dropdownCard}
                          onClick={() => setIsCategoryOpen(false)}
                        >
                          <span className={styles.dropdownIconWrap}>
                            <CategoryIcon slug={cat.slug} size={18} />
                          </span>
                          <div className={styles.dropdownCardContent}>
                            <div className={styles.dropdownCardTop}>
                              <span className={styles.dropdownName}>{cat.name}</span>
                              <ChevronRight size={13} className={styles.dropdownArrow} />
                            </div>
                            <span className={styles.dropdownCount}>
                              {cat.productCount} products
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div> {/* End navLeft */}

            {/* Search Bar */}
            <form className={styles.searchForm} onSubmit={handleSearch} role="search">
              <div className={styles.searchWrapper}>
                <input
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search motors, batteries, brakes..."
                  className={styles.searchInput}
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={styles.searchClear}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="submit"
                  className={styles.searchSubmitBtn}
                  aria-label="Submit search"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* Right Group */}
            <div className={styles.navRight}>
              {/* Nav Links */}
              <div className={styles.navLinks}>
              <Link href="/products" className={styles.navLink}>Products</Link>
              <Link href="/products?tag=best-selling" className={styles.navLink}>Best Sellers</Link>
              <Link href="/products?isNew=true" className={styles.navLink}>New Arrivals</Link>
            </div>

            {/* Action Icons */}
            <div className={styles.actions}>
              {/* Compare */}
              {mounted && compareCount > 0 && (
                <Link href="/compare" className={styles.actionBtn} aria-label={`Compare ${compareCount} items`}>
                  <BarChart2 size={20} />
                  <span className={styles.badge}>{compareCount}</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link href="/wishlist" className={styles.actionBtn} aria-label={`Wishlist (${mounted ? wishlistCount : 0})`}>
                <Heart size={20} />
                {mounted && wishlistCount > 0 && (
                  <span className={styles.badge}>{wishlistCount}</span>
                )}
              </Link>

              {/* Cart */}
              <button
                className={`${styles.actionBtn} ${styles.cartBtn}`}
                onClick={toggleCart}
                aria-label={`Open cart (${mounted ? cartItems : 0} items)`}
              >
                <ShoppingCart size={20} />
                {mounted && cartItems > 0 && (
                  <span className={`${styles.badge} ${styles.badgeAccent}`}>{cartItems}</span>
                )}
              </button>

              {/* Mobile Search Toggle */}
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.mobileSearchToggle}`}
                onClick={() => {
                  setIsMobileSearchOpen(!isMobileSearchOpen);
                  setIsMobileMenuOpen(false);
                }}
                aria-label="Toggle search"
                aria-expanded={isMobileSearchOpen}
              >
                <Search size={20} />
              </button>

              {/* Account */}
              <Link href="/login" className={styles.actionBtn} aria-label="Account">
                <User size={20} />
              </Link>

              {/* Mobile menu toggle */}
              <button
                className={`${styles.actionBtn} ${styles.mobileMenuBtn}`}
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsMobileSearchOpen(false);
                }}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
            </div> {/* End navRight */}
          </nav>
        </div>

        {/* Mobile Quick Search Bar */}
        {isMobileSearchOpen && (
          <div className={styles.mobileQuickSearch}>
            <div className="container">
              <form onSubmit={handleSearch} className={styles.searchWrapper} role="search">
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search motors, batteries, brakes..."
                  className={styles.searchInput}
                  aria-label="Search products"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={styles.searchClear}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  type="submit"
                  className={styles.searchSubmitBtn}
                  aria-label="Submit search"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className="container">
              <form className={styles.mobileSearchForm} onSubmit={handleSearch} role="search">
                <div className={styles.searchWrapper}>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className={styles.searchInput}
                    aria-label="Search products"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className={styles.searchClear}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className={styles.searchSubmitBtn}
                    aria-label="Submit search"
                  >
                    <Search size={16} />
                  </button>
                </div>
              </form>

              <div className={styles.mobileCategoriesLabel}>Categories</div>
              <div className={styles.mobileCategories}>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={styles.mobileCategoryItem}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <CategoryIcon slug={cat.slug} size={18} />
                    </span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>

              <div className={styles.mobileNavLinks}>
                <Link href="/products" className={styles.mobileNavLink}>All Products</Link>
                <Link href="/products?tag=best-selling" className={styles.mobileNavLink}>Best Sellers</Link>
                <Link href="/products?isNew=true" className={styles.mobileNavLink}>New Arrivals</Link>
                <Link href="/wishlist" className={styles.mobileNavLink}>Wishlist ({mounted ? wishlistCount : 0})</Link>
                <Link href="/compare" className={styles.mobileNavLink}>Compare ({mounted ? compareCount : 0})</Link>
                <Link href="/login" className={styles.mobileNavLink}>My Account</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
