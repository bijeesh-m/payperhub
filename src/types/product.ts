// Product Types
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  date: string;
  helpful: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  images: ProductImage[];
  description: string;
  shortDescription: string;
  specs: ProductSpec[];
  tags: string[];
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  compatibility?: string[];
  weight?: string;
  warranty?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  subcategories: string[];
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'best-selling';

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  rating: number | null;
  tags: string[];
}

export interface PaginationInfo {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
