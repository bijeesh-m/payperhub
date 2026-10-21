'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, Lock, ShieldCheck, Truck, 
  CreditCard, ArrowRight, Zap, ShoppingBag 
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import styles from './Checkout.module.css';

export default function CheckoutClientPage() {
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
    zip: '',
    country: 'India',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const subtotal = getTotalPrice();
  const isFreeStandard = subtotal >= 1999;
  const standardCost = isFreeStandard ? 0 : 149;
  const expressCost = 349;
  const shippingFee = shippingMethod === 'standard' ? standardCost : expressCost;
  const tax = subtotal * 0.18; // 18% GST (India)
  const total = subtotal + shippingFee + tax;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    setTimeout(() => {
      const generatedId = `PPH-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsSubmitting(false);
      setOrderComplete(true);
      clearCart();
    }, 1200);
  };

  if (orderComplete) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.successOverlay}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={48} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Order Confirmed!
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Thank you for choosing Payperhub. Your order <strong>#{orderId}</strong> has been received and is being prepared for shipment.
            </p>
            <div style={{ background: 'var(--color-slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem', textAlign: 'left', fontSize: '0.875rem' }}>
              <div><strong>Confirmation Email:</strong> {formData.email || 'customer@example.com'}</div>
              <div style={{ marginTop: '0.5rem' }}><strong>Shipping To:</strong> {formData.firstName} {formData.lastName}, {formData.address}, {formData.city}, {formData.state} {formData.zip}</div>
              <div style={{ marginTop: '0.5rem' }}><strong>Estimated Delivery:</strong> 2–4 Business Days across India</div>
            </div>
            <Link href="/products" className={styles.placeOrderBtn} style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Back to Catalog <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '5rem 0', background: 'var(--color-white)', borderRadius: '1rem', border: '1px solid var(--color-border)' }}>
            <ShoppingBag size={56} style={{ color: 'var(--color-text-tertiary)', marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Cart is Empty</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Please add items to your cart before proceeding to checkout.
            </p>
            <Link href="/products" className={styles.placeOrderBtn} style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto', padding: '0.75rem 2rem' }}>
              Browse Electric Bike Parts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
          <Lock size={18} color="#0ea5e9" />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Secure Checkout</h1>
        </div>

        <form onSubmit={handleSubmitOrder} className={styles.checkoutGrid}>
          {/* Main Checkout Steps Form */}
          <div>
            {/* Step 1: Customer Contact */}
            <div className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>1</div>
                <h2 className={styles.stepTitle}>Contact Information</h2>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>2</div>
                <h2 className={styles.stepTitle}>Delivery Address (India)</h2>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="Rahul"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Sharma"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.formColFull}`}>
                  <label className={styles.label}>Flat / House / Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Flat 302, Green Glen Layout, Bellandur"
                    value={formData.address}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Bengaluru"
                    value={formData.city}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>PIN Code *</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    placeholder="560103"
                    value={formData.zip}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="India">India</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Shipping Method */}
            <div className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>3</div>
                <h2 className={styles.stepTitle}>Shipping Method</h2>
              </div>
              <div className={styles.shippingOptions}>
                <div
                  className={`${styles.shippingOption} ${shippingMethod === 'standard' ? styles.shippingOptionSelected : ''}`}
                  onClick={() => setShippingMethod('standard')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Truck size={20} color="#0ea5e9" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Standard Ground Surface Delivery</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Delivered in 3–5 Business Days across India</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800 }}>
                    {isFreeStandard ? 'FREE' : formatPrice(standardCost)}
                  </div>
                </div>

                <div
                  className={`${styles.shippingOption} ${shippingMethod === 'express' ? styles.shippingOptionSelected : ''}`}
                  onClick={() => setShippingMethod('express')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Zap size={20} color="#f59e0b" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Express Priority Air (BlueDart / Delhivery)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Delivered in 1–2 Business Days</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800 }}>{formatPrice(expressCost)}</div>
                </div>
              </div>
            </div>

            {/* Step 4: Payment Details */}
            <div className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>4</div>
                <h2 className={styles.stepTitle}>Payment Method (INR)</h2>
              </div>

              <div className={styles.paymentTabs}>
                <button
                  type="button"
                  className={`${styles.paymentTab} ${paymentMethod === 'upi' ? styles.paymentTabActive : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <Zap size={18} style={{ display: 'block', margin: '0 auto 4px', color: '#0ea5e9' }} />
                  UPI (GPay / PhonePe)
                </button>
                <button
                  type="button"
                  className={`${styles.paymentTab} ${paymentMethod === 'card' ? styles.paymentTabActive : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={18} style={{ display: 'block', margin: '0 auto 4px' }} />
                  Cards / NetBanking
                </button>
                <button
                  type="button"
                  className={`${styles.paymentTab} ${paymentMethod === 'cod' ? styles.paymentTabActive : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <Truck size={18} style={{ display: 'block', margin: '0 auto 4px', color: 'var(--color-success)' }} />
                  Cash on Delivery
                </button>
              </div>

              {paymentMethod === 'upi' && (
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.formColFull}`}>
                    <label className={styles.label}>UPI ID / VPA *</label>
                    <input
                      type="text"
                      name="upiId"
                      placeholder="mobile@upi or yourname@okhdfcbank"
                      value={formData.upiId}
                      onChange={handleChange}
                      className={styles.input}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={12} color="#0ea5e9" /> Instant payment approval via Google Pay, PhonePe, Paytm, or BHIM.
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.formColFull}`}>
                    <label className={styles.label}>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="4000 1234 5678 9010 (RuPay / Visa / MC)"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Expiration (MM/YY) *</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="12/28"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>CVV *</label>
                    <input
                      type="text"
                      name="cardCvc"
                      placeholder="123"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', padding: '1rem', background: 'var(--color-slate-50)', borderRadius: '0.5rem' }}>
                  Pay cash or UPI upon courier arrival at your doorstep. Verified delivery with OTP.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className={styles.orderSidebar}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Order Review ({items.length} items)
            </h2>

            {/* Mini Items list */}
            <div className={styles.orderItemsMini}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.miniItem}>
                  <div className={styles.miniThumb}>
                    <Zap size={20} color="#0ea5e9" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Qty: {item.quantity} × {formatPrice(item.product.price)}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Shipping ({shippingMethod === 'standard' ? 'Ground' : 'Express'})</span>
                <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Estimated GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '1.25rem', fontWeight: 800 }}>
                <span>Total Due</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.placeOrderBtn}
            >
              {isSubmitting ? 'Processing Payment...' : `Complete Order — ${formatPrice(total)}`}
            </button>

            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
              <ShieldCheck size={16} color="var(--color-success)" />
              <span>256-bit Encrypted SSL Guarantee</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
