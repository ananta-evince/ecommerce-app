import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useToast } from "../components/ToastContainer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton";
import "./Products.css";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(window.innerWidth >= 1024);
  
  // Auto-open filters on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setFiltersOpen(true);
      } else if (window.innerWidth < 1024 && filtersOpen) {
        setFiltersOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [filtersOpen]);

  const category = searchParams.get("category") || "all";
  const brand = searchParams.get("brand") || "all";
  const minPrice = searchParams.get("minPrice") || "0";
  const maxPrice = searchParams.get("maxPrice") || "100000";
  const rating = searchParams.get("rating") || "0";
  const availability = searchParams.get("availability") || "all";
  const sortBy = searchParams.get("sort") || "popular";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPageParam = searchParams.get("perPage") || "12";
  const productsPerPage = [12, 24, 48].includes(parseInt(perPageParam, 10)) ? parseInt(perPageParam, 10) : 12;

  // Local state for filter form (before applying)
  const [localFilters, setLocalFilters] = useState({
    category: category,
    brand: brand,
    minPrice: minPrice,
    maxPrice: maxPrice,
    rating: rating,
    availability: availability
  });

  useEffect(() => {
    fetchProducts();
  }, [category, brand, minPrice, maxPrice, rating]);

  useEffect(() => {
    if (products.length > 0) {
      filterAndSortProducts();
    } else if (!loading) {
      setFilteredProducts([]);
    }
  }, [products, availability, sortBy, loading]);

  // Update local filters when URL params change
  useEffect(() => {
    setLocalFilters({
      category: category,
      brand: brand,
      minPrice: minPrice,
      maxPrice: maxPrice,
      rating: rating,
      availability: availability
    });
  }, [category, brand, minPrice, maxPrice, rating, availability]);

  // Prevent body scroll when filters are open on mobile only
  useEffect(() => {
    if (filtersOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [filtersOpen]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (category !== "all") params.append("category", category);
      if (brand !== "all") params.append("brand", brand);
      if (minPrice !== "0") params.append("minPrice", minPrice);
      if (maxPrice !== "100000") params.append("maxPrice", maxPrice);
      if (rating !== "0") params.append("minRating", rating);
      
      const queryString = params.toString();
      const url = queryString ? `/products?${queryString}` : "/products";
      
      const res = await API.get(url);
      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      showToast("Failed to load products. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    const isDefault = (key, value) => {
      if (value === "all" || value === "0" || value === "" || value === null) return true;
      if (key === "maxPrice" && value === "100000") return true;
      return false;
    };
    Object.entries(updates).forEach(([key, value]) => {
      if (isDefault(key, value)) newParams.delete(key);
      else newParams.set(key, value);
    });
    if (!updates.hasOwnProperty("page")) newParams.delete("page");
    setSearchParams(newParams);
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (brand !== "all") {
      filtered = filtered.filter((product) => product.brand === brand);
    }

    const min = parseInt(minPrice, 10);
    const max = parseInt(maxPrice, 10);
    filtered = filtered.filter(
      (product) => product.price >= min && product.price <= max
    );

    const minRating = parseInt(rating, 10);
    if (minRating > 0) {
      filtered = filtered.filter((product) => (product.rating || 0) >= minRating);
    }

    if (availability === "in-stock") {
      filtered = filtered.filter((product) => (product.stock || 0) > 0);
    } else if (availability === "out-of-stock") {
      filtered = filtered.filter((product) => (product.stock || 0) === 0);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];
  const brands = ["all", ...new Set(products.map((p) => p.brand).filter(Boolean))];

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const categoryName = category === "all" ? "All Products" : category.charAt(0).toUpperCase() + category.slice(1);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newParams.delete("page");
    } else {
      newParams.set("page", newPage.toString());
    }
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchParams({});
    setFiltersOpen(false);
    setLocalFilters({
      category: "all",
      brand: "all",
      minPrice: "0",
      maxPrice: "100000",
      rating: "0",
      availability: "all"
    });
  };

  const applyFilters = () => {
    updateURL(localFilters);
    setFiltersOpen(false);
  };

  const handleLocalFilterChange = (updates) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    
    // Auto-apply on desktop
    if (window.innerWidth >= 1024) {
      updateURL(newFilters);
    }
  };

  const hasActiveFilters = category !== "all" || brand !== "all" || minPrice !== "0" || maxPrice !== "100000" || rating !== "0" || availability !== "all";

  return (
    <div className="products-page">
      <Navbar />
      
      <div className="products-container">
        <PageHeader categoryName={categoryName} />
        
        <FilterSortBar 
          totalCount={filteredProducts.length}
          startIndex={startIndex + 1}
          endIndex={Math.min(startIndex + productsPerPage, filteredProducts.length)}
          productsPerPage={productsPerPage}
          sortBy={sortBy}
          onSortChange={(value) => updateURL({ sort: value })}
          onPerPageChange={(n) => updateURL({ perPage: String(n) })}
          onFiltersToggle={() => setFiltersOpen(!filtersOpen)}
          filtersOpen={filtersOpen}
        />
        {hasActiveFilters && (
          <ActiveFilterChips
            category={category}
            brand={brand}
            minPrice={minPrice}
            maxPrice={maxPrice}
            rating={rating}
            availability={availability}
            categories={categories}
            brands={brands}
            onClearOne={updateURL}
            onClearAll={clearFilters}
          />
        )}

        <div className="products-layout">
          <FiltersSidebar
            categories={categories}
            brands={brands}
            category={localFilters.category}
            brand={localFilters.brand}
            minPrice={localFilters.minPrice}
            maxPrice={localFilters.maxPrice}
            rating={localFilters.rating}
            availability={localFilters.availability}
            onFilterChange={handleLocalFilterChange}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            localFilters={localFilters}
            updateURL={updateURL}
          />

          <main className="products-main">
            {loading ? (
              <ProductGridSkeleton count={12} />
            ) : paginatedProducts.length === 0 ? (
              <NoResultsState onClearFilters={clearFilters} hasActiveFilters={hasActiveFilters} />
            ) : (
              <>
                <ProductsGrid products={paginatedProducts} />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function PageHeader({ categoryName }) {
  return (
    <div className="page-header">
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Products</span>
        {categoryName !== "All Products" && (
          <>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{categoryName}</span>
          </>
        )}
      </div>
      <div className="page-title-section">
        <h1 className="page-title">{categoryName}</h1>
        <p className="page-subtitle">Discover our amazing collection of fashion products</p>
      </div>
    </div>
  );
}

function FilterSortBar({ totalCount, startIndex, endIndex, productsPerPage, sortBy, onSortChange, onPerPageChange, onFiltersToggle, filtersOpen }) {
  return (
    <div className="filter-sort-bar">
      <div className="filter-sort-left">
        <button 
          className="filters-toggle-btn"
          onClick={onFiltersToggle}
          aria-label="Toggle filters"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span>Filters</span>
        </button>
        <p className="results-count">
          <span className="results-total">{totalCount} {totalCount === 1 ? "product" : "products"}</span>
          {totalCount > 0 && (
            <span className="results-range"> — Showing {startIndex}-{endIndex}</span>
          )}
        </p>
      </div>
      <div className="filter-sort-right">
        <div className="filter-sort-group">
          <label htmlFor="per-page-select" className="sort-label">Show:</label>
          <select
            id="per-page-select"
            className="sort-select per-page-select"
            value={productsPerPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
          <span className="per-page-suffix">per page</span>
        </div>
        <div className="filter-sort-group">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="popular">Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function ActiveFilterChips({ category, brand, minPrice, maxPrice, rating, availability, categories, brands, onClearOne, onClearAll }) {
  const chips = [];
  if (category && category !== "all") {
    const label = categories.includes(category) ? category.charAt(0).toUpperCase() + category.slice(1) : category;
    chips.push({ key: "category", label: `Category: ${label}` });
  }
  if (brand && brand !== "all") {
    const label = brands.includes(brand) ? brand.charAt(0).toUpperCase() + brand.slice(1) : brand;
    chips.push({ key: "brand", label: `Brand: ${label}` });
  }
  if (minPrice !== "0" || maxPrice !== "100000") {
    chips.push({ key: "price", label: `Price: ₹${minPrice} – ₹${maxPrice}` });
  }
  if (rating && rating !== "0") chips.push({ key: "rating", label: `${rating}+ Stars` });
  if (availability === "in-stock") chips.push({ key: "availability", label: "In Stock" });
  if (availability === "out-of-stock") chips.push({ key: "availability", label: "Out of Stock" });
  if (chips.length === 0) return null;

  const clearOne = (key) => {
    if (key === "category") onClearOne({ category: "all" });
    else if (key === "brand") onClearOne({ brand: "all" });
    else if (key === "price") onClearOne({ minPrice: "0", maxPrice: "100000" });
    else if (key === "rating") onClearOne({ rating: "0" });
    else if (key === "availability") onClearOne({ availability: "all" });
  };

  return (
    <div className="active-filter-chips">
      {chips.map(({ key, label }) => (
        <span key={`${key}-${label}`} className="filter-chip">
          {label}
          <button type="button" className="filter-chip-remove" onClick={() => clearOne(key)} aria-label={`Remove ${label}`}>×</button>
        </span>
      ))}
      <button type="button" className="filter-chip-clear-all" onClick={onClearAll}>Clear all</button>
    </div>
  );
}

function FiltersSidebar({
  categories,
  brands,
  category,
  brand,
  minPrice,
  maxPrice,
  rating,
  availability,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  hasActiveFilters,
  isOpen,
  onClose,
  localFilters,
  updateURL
}) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const shouldShowOverlay = isOpen && !isDesktop;
  const shouldShowSidebar = isOpen || isDesktop;
  
  return (
    <>
      {shouldShowOverlay && <div className="filters-overlay active" onClick={onClose}></div>}
      <aside className={`filters-sidebar ${shouldShowSidebar ? 'open' : ''}`}>
        <div className="filters-header">
          <div className="filters-header-content">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button className="filters-clear-header-btn" onClick={onClearFilters} aria-label="Clear all filters">
                Clear
              </button>
            )}
          </div>
          {!isDesktop && (
            <button className="filters-close-btn" onClick={onClose} aria-label="Close filters">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>

        <div className="filters-content">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Brand</label>
            <select
              value={brand}
              onChange={(e) => onFilterChange({ brand: e.target.value })}
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === "all" ? "All Brands" : b.charAt(0).toUpperCase() + b.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range (₹)</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  const value = e.target.value || "0";
                  onFilterChange({ minPrice: value });
                }}
                onBlur={(e) => {
                  if (isDesktop) {
                    const value = e.target.value || "0";
                    updateURL({ ...localFilters, minPrice: value });
                  }
                }}
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  const value = e.target.value || "100000";
                  onFilterChange({ maxPrice: value });
                }}
                onBlur={(e) => {
                  if (isDesktop) {
                    const value = e.target.value || "100000";
                    updateURL({ ...localFilters, maxPrice: value });
                  }
                }}
                min="0"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Minimum Rating</label>
            <select
              value={rating}
              onChange={(e) => onFilterChange({ rating: e.target.value })}
            >
              <option value="0">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Availability</label>
            <select
              value={availability}
              onChange={(e) => onFilterChange({ availability: e.target.value })}
            >
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <div className="filter-actions">
            {!isDesktop && (
              <button className="apply-filters-btn" onClick={onApplyFilters}>
                Apply Filters
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function ProductsGrid({ products }) {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
        Previous
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
          }
          return (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </button>
    </div>
  );
}

function NoResultsState({ onClearFilters, hasActiveFilters }) {
  return (
    <div className="no-results-state">
      <div className="no-results-icon">
        <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="60" stroke="#8b5cf6" strokeWidth="10" fill="none" opacity="0.5" />
          <path
            d="M150 150 L180 180"
            stroke="#8b5cf6"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
      <h2>No products found</h2>
      <p>We couldn't find any products matching your criteria.</p>
      {hasActiveFilters && (
        <button className="clear-filters-action-btn" onClick={onClearFilters}>
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default Products;
