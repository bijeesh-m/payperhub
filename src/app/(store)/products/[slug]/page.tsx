import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { buildMetadata, buildProductJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found | Payperhub',
    };
  }

  return buildMetadata({
    title: `${product.name} — Buy Online`,
    description: product.description.slice(0, 160),
    slug: `products/${product.slug}`,
    keywords: [
      product.name,
      product.brand,
      product.subcategory,
      'electric bike parts',
      'e-bike accessories',
    ],
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Schema.org Structured Data
  const productJsonLd = buildProductJsonLd({
    name: product.name,
    description: product.description,
    price: product.price,
    brand: product.brand,
    sku: product.sku,
    inStock: product.inStock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    slug: product.slug,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.subcategory, url: `/products?category=${product.category}` },
    { name: product.name, url: `/products/${product.slug}` },
  ]);

  return (
    <>
      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
