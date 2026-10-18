'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal, Grid, List, X, ChevronDown, ChevronUp, Search, Star } from 'lucide-react';
import { products, categories, brands, priceRange as globalPriceRange } from '@/data/products';
import { Product, SortOption } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import CategoryIcon from '@/components/ui/CategoryIcon';
import styles from './ProductFilters.module.css';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const PER_PAGE = 12;

function sortProducts(productList: Product[], sort: SortOption): Product[] {
  const sorted = [...productList];
  switch (sort) {
    case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'rating': return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest': return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'best-selling': return sorted.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    case 'featured': default: return sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={styles.filterSection}>
      <button className={styles.filterSectionBtn} onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {isOpen && <div className={styles.filterSectionBody}>{children}</div>}
    </div>
  );
}

export default function ProductsClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read URL params
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const isNewParam = searchParams.get('isNew') === 'true';
  const featuredParam = searchParams.get('featured') === 'true';
  const tagParam = searchParams.get('tag') || '';
  const searchParam = searchParams.get('q') || '';
  const sortParam = (searchParams.get('sort') as SortOption) || 'featured';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Local filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(brandParam ? [brandParam] : []);
  const [priceMin, setPriceMin] = useState(globalPriceRange[0]);
  const [priceMax, setPriceMax] = useState(globalPriceRange[1]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<SortOption>(sortParam);
  const [page, setPage] = useState(pageParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const updateUrl = useCallback((params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const handleSort = (value: SortOption) => {
    setSort(value);
    setPage(1);
    updateUrl({ sort: value, page: '1' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrl({ q: searchQuery, page: '1' });
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
    setPage(1);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceMin(globalPriceRange[0]);
    setPriceMax(globalPriceRange[1]);
    setInStockOnly(false);
    setMinRating(0);
    setSearchQuery('');
    setPage(1);
    router.replace(pathname);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceMin > globalPriceRange[0] ||
    priceMax < globalPriceRange[1] ||
    inStockOnly ||
    minRating > 0 ||
    searchQuery;

  // Filter & sort products
  const filtered = useMemo(() => {
    let list = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (isNewParam) list = list.filter((p) => p.isNew);
    if (featuredParam) list = list.filter((p) => p.isFeatured);
    if (tagParam === 'best-selling') list = list.filter((p) => p.isBestSeller);

    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.categorySlug));
    }
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }
    list = list.filter((p) => p.price >= priceMin && p.price <= priceMax);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);

    return sortProducts(list, sort);
  }, [selectedCategories, selectedBrands, priceMin, priceMax, inStockOnly, minRating, sort, searchQuery, isNewParam, featuredParam, tagParam]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const Sidebar = () => (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarTitle}>
          <SlidersHorizontal size={16} />
          Filters
        </span>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className={styles.clearBtn}>
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Search Filter */}
      <FilterSection title="Search">
        <form onSubmit={handleSearch} className={styles.filterSearch}>
          <div className={styles.filterSearchWrapper}>
            <Search size={14} className={styles.filterSearchIcon} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className={styles.filterSearchInput}
            />
          </div>
        </form>
      </FilterSection>

      {/* Categories */}
      <FilterSection title="Category">
        <div className={styles.checkList}>
          {categories.map((cat) => (
            <label key={cat.id} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className={styles.checkbox}
              />
              <span className={styles.checkLabel} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CategoryIcon slug={cat.slug} size={14} />
                <span>{cat.name}</span>
              </span>
              <span className={styles.checkCount}>{cat.productCount}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brand">
        <div className={styles.checkList}>
          {brands.map((brand) => (
            <label key={brand} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className={styles.checkbox}
              />
              <span className={styles.checkLabel}>{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range (INR)">
        <div className={styles.priceRange}>
          <div className={styles.priceInputRow}>
            <div className={styles.priceInput}>
              <span>₹</span>
              <input
                type="number"
                value={priceMin}
                min={globalPriceRange[0]}
                max={priceMax}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className={styles.priceField}
              />
            </div>
            <span className={styles.priceSep}>–</span>
            <div className={styles.priceInput}>
              <span>₹</span>
              <input
                type="number"
                value={priceMax}
                min={priceMin}
                max={globalPriceRange[1]}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className={styles.priceField}
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Min. Rating">
        <div className={styles.ratingList}>
          {[4, 3, 2, 0].map((r) => (
            <label key={r} className={styles.checkItem}>
              <input
                type="radio"
                checked={minRating === r}
                onChange={() => setMinRating(r)}
                className={styles.checkbox}
              />
              <span className={styles.checkLabel}>
                {r === 0 ? (
                  'Any Rating'
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>{r}</span>
                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                    <span>& above</span>
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* In Stock */}
      <FilterSection title="Availability">
        <label className={styles.checkItem}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkLabel}>In Stock Only</span>
        </label>
      </FilterSection>
    </aside>
  );

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.resultCount}>
            <span className={styles.resultNum}>{filtered.length}</span>
            <span> products</span>
            {hasActiveFilters && <span className={styles.filterTag}>• Filtered</span>}
          </div>

          <div className={styles.controls}>
            {/* Mobile Filter Toggle */}
            <button
              className={`btn btn-outline btn-sm ${styles.mobileFilterBtn}`}
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={14} /> Filters
              {hasActiveFilters && <span className={styles.filterCountBadge}>{
                selectedCategories.length + selectedBrands.length + (inStockOnly ? 1 : 0) + (minRating > 0 ? 1 : 0)
              }</span>}
            </button>

            {/* Sort */}
            <div className={styles.sortWrapper}>
              <label htmlFor="sort-select" className="sr-only">Sort products</label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => handleSort(e.target.value as SortOption)}
                className={styles.sortSelect}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Layout Toggle */}
            <div className={styles.layoutToggle}>
              <button
                className={`${styles.layoutBtn} ${layout === 'grid' ? styles.layoutActive : ''}`}
                onClick={() => setLayout('grid')}
                aria-label="Grid layout"
              >
                <Grid size={16} />
              </button>
              <button
                className={`${styles.layoutBtn} ${layout === 'list' ? styles.layoutActive : ''}`}
                onClick={() => setLayout('list')}
                aria-label="List layout"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className={styles.activeTags}>
            {selectedCategories.map((slug) => {
              const cat = categories.find((c) => c.slug === slug);
              return cat ? (
                <button key={slug} className={styles.activeTag} onClick={() => toggleCategory(slug)}>
                  {cat.name} <X size={12} />
                </button>
              ) : null;
            })}
            {selectedBrands.map((brand) => (
              <button key={brand} className={styles.activeTag} onClick={() => toggleBrand(brand)}>
                {brand} <X size={12} />
              </button>
            ))}
            {inStockOnly && (
              <button className={styles.activeTag} onClick={() => setInStockOnly(false)}>
                In Stock <X size={12} />
              </button>
            )}
            {searchQuery && (
              <button className={styles.activeTag} onClick={() => setSearchQuery('')}>
                &quot;{searchQuery}&quot; <X size={12} />
              </button>
            )}
            <button onClick={clearAllFilters} className={styles.clearAllTag}>
              Clear All
            </button>
          </div>
        )}

        {/* Main Layout */}
        <div className={styles.main}>
          {/* Desktop Sidebar */}
          <div className={styles.desktopSidebar}>
            <Sidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {isMobileFiltersOpen && (
            <div className={styles.mobileOverlay} onClick={() => setIsMobileFiltersOpen(false)}>
              <div className={styles.mobileSidebar} onClick={(e) => e.stopPropagation()}>
                <div className={styles.mobileSidebarHeader}>
                  <h3>Filters</h3>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className={styles.mobileCloseBtn}>
                    <X size={20} />
                  </button>
                </div>
                <div className={styles.mobileSidebarBody}>
                  <Sidebar />
                </div>
                <div className={styles.mobileSidebarFooter}>
                  <button className="btn btn-primary" style={{width:'100%'}} onClick={() => setIsMobileFiltersOpen(false)}>
                    View {filtered.length} Products
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <div className={styles.content}>
            {paginated.length === 0 ? (
              <div className={styles.emptyState}>
                <Search size={48} className={styles.emptyIcon} />
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button onClick={clearAllFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={layout === 'grid' ? styles.gridLayout : styles.listLayout}>
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} layout={layout} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
