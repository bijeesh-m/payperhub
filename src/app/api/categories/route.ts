import { NextResponse } from 'next/server';
import { categories, products } from '@/data/products';

export async function GET() {
  const categoriesWithCounts = categories.map((cat) => {
    const count = products.filter((p) => p.category === cat.slug).length;
    return {
      ...cat,
      productCount: count,
    };
  });

  return NextResponse.json({ categories: categoriesWithCounts });
}
