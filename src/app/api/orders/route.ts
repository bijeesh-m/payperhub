import { NextRequest, NextResponse } from 'next/server';

interface OrderItemPayload {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

interface OrderPayload {
  customer: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: OrderItemPayload[];
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'upi' | 'card' | 'cod';
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderPayload = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item.' }, { status: 400 });
    }

    if (!body.customer?.email || !body.customer?.address) {
      return NextResponse.json({ error: 'Customer email and shipping address are required.' }, { status: 400 });
    }

    const subtotal = body.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = body.shippingMethod === 'express' ? 349 : subtotal >= 1999 ? 0 : 149;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shippingFee + tax;

    const orderId = `PPH-${Date.now().toString().slice(-6)}`;

    const orderSummary = {
      orderId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      customer: body.customer,
      items: body.items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingFee: parseFloat(shippingFee.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      shippingMethod: body.shippingMethod,
      paymentMethod: body.paymentMethod,
    };

    return NextResponse.json({ order: orderSummary }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process order.' }, { status: 500 });
  }
}
