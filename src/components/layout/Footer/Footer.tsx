'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Mail, Phone, MapPin, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import styles from './Footer.module.css';

const shopLinks = [
  { label: 'All Products', href: '/products' },
  { label: 'Best Sellers', href: '/products?tag=best-selling' },
  { label: 'New Arrivals', href: '/products?isNew=true' },
  { label: 'Motors & Controllers', href: '/products?category=motors-controllers' },
  { label: 'Batteries & Charging', href: '/products?category=batteries-charging' },
  { label: 'Brakes & Safety', href: '/products?category=brakes-safety' },
];

const supportLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Warranty Info', href: '/warranty' },
  { label: 'Track My Order', href: '/track' },
  { label: 'Contact Us', href: '/contact' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Newsletter Banner */}
      <div className={styles.newsletter}>
        <div className="container">
          <div className={styles.newsletterInner}>
            <div className={styles.newsletterText}>
              <h3>Stay charged. Stay ahead.</h3>
              <p>Get the latest products, deals & e-bike guides delivered to your inbox.</p>
            </div>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.newsletterInputWrapper}>
                <Mail size={16} className={styles.newsletterIcon} />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={styles.newsletterInput}
                  aria-label="Newsletter email"
                />
              </div>
              <button type="submit" className={styles.newsletterBtn}>
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className={styles.main}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand Column */}
            <div className={styles.brandColumn}>
              <Link href="/" className={styles.footerLogo}>
                <div className={styles.footerLogoIcon}>
                  <Zap size={20} />
                </div>
                <div>
                  <div className={styles.footerLogoMain}>Payperhub</div>
                  <div className={styles.footerLogoSub}>E-Bike Store</div>
                </div>
              </Link>
              <p className={styles.brandDesc}>
                India&apos;s trusted destination for premium electric bike components. From high-torque motors to long-range batteries,
                we carry everything you need to build, upgrade, or service your electric ride.
              </p>

              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <Phone size={14} />
                  <span>1800-208-PAYPERHUB (Mon–Sat 9am–6pm IST)</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={14} />
                  <a href="mailto:support@payperhub.com">support@payperhub.com</a>
                </div>
                <div className={styles.contactItem}>
                  <MapPin size={14} />
                  <span>Tech Innovation Park, Electronic City, Bengaluru, KA 560100</span>
                </div>
              </div>

              <div className={styles.socials}>
                <a href="#" className={styles.socialLink} aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className={styles.socialLink} aria-label="X / Twitter">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className={styles.socialLink} aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a href="#" className={styles.socialLink} aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Shop */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Shop</h4>
              <ul className={styles.linkList}>
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Support</h4>
              <ul className={styles.linkList}>
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Company</h4>
              <ul className={styles.linkList}>
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>

              <div className={styles.trustBadges}>
                <div className={styles.trustBadge}>
                  <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
                  <span>100% Secure Checkout</span>
                </div>
                <div className={styles.trustBadge}>
                  <Truck size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
                  <span>Free Shipping ₹1,999+</span>
                </div>
                <div className={styles.trustBadge}>
                  <RotateCcw size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
                  <span>30-Day Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className={styles.payments}>
            <span className={styles.paymentsLabel}>We accept:</span>
            <div className={styles.paymentIcons}>
              {['UPI', 'GPay', 'PhonePe', 'Paytm', 'RuPay', 'NetBanking', 'Visa', 'COD'].map((method) => (
                <span key={method} className={styles.paymentIcon}>{method}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Payperhub. All rights reserved.
            </p>
            <div className={styles.bottomLinks}>
              <Link href="/privacy" className={styles.bottomLink}>Privacy</Link>
              <Link href="/terms" className={styles.bottomLink}>Terms</Link>
              <Link href="/sitemap.xml" className={styles.bottomLink}>Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
