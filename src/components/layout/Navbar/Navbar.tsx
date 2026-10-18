'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Zap,
  ChevronDown,
  User,
  BarChart2,
  Phone,
  Truck,
  Headphones,
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
              <Link href="/" className={styles.logo}>
                <div className={styles.logoIcon}>
                  <Zap size={20} />
                </div>
                <div className={styles.logoText}>
                  <span className={styles.logoMain}>Payperhub</span>
                  <span className={styles.logoSub}>E-Bike Store</span>
                </div>
              </Link>

              {/* Categories Dropdown */}
              <div className={styles.categoryDropdownWrapper} ref={dropdownRef}>
              <button
                className={styles.categoryBtn}
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                aria-expanded={isCategoryOpen}
              >
                <Menu size={16} />
                All Categories
                <ChevronDown
                  size={14}
                  className={isCategoryOpen ? styles.chevronOpen : ''}
                  style={{ transition: 'transform 200ms ease' }}
                />
              </button>

              {isCategoryOpen && (
                <div className={styles.categoryDropdown}>
                  <div className={styles.dropdownGrid}>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className={styles.dropdownItem}
                        onClick={() => setIsCategoryOpen(false)}
                      >
                        <span className={styles.dropdownIcon}>
                          <CategoryIcon slug={cat.slug} size={18} />
                        </span>
                        <div>
                          <div className={styles.dropdownName}>{cat.name}</div>
                          <div className={styles.dropdownCount}>
                            {cat.productCount} products
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </div> {/* End navLeft */}

            {/* Search Bar */}
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <div className={styles.searchWrapper}>
                <Search size={16} className={styles.searchIcon} />
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
              </div>
              <button type="submit" className={styles.searchSubmit} aria-label="Submit search">
                Search
              </button>
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

              {/* Account */}
              <Link href="/login" className={styles.actionBtn} aria-label="Account">
                <User size={20} />
              </Link>

              {/* Mobile menu toggle */}
              <button
                className={`${styles.actionBtn} ${styles.mobileMenuBtn}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
            </div> {/* End navRight */}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className="container">
              <form className={styles.mobileSearchForm} onSubmit={handleSearch}>
                <div className={styles.searchWrapper}>
                  <Search size={16} className={styles.searchIcon} />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className={styles.searchInput}
                  />
                </div>
                <button type="submit" className={styles.searchSubmit}>Go</button>
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
