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

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url;
  const productOgImage = primaryImage || '/og-image.jpg';
  const cleanDescription =
    product.description.length > 160
      ? `${product.description.slice(0, 157)}...`
      : product.description;

  return buildMetadata({
    title: `${product.name} — Buy Online`,
    description: cleanDescription,
    slug: `products/${product.slug}`,
    image: productOgImage,
    type: 'article',
    keywords: [
      product.name,
      product.brand,
      product.category,
      product.subcategory,
      'buy EV parts',
      'electric vehicle component',
      'e-bike parts India',
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
