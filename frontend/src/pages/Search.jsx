import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../api/api";
import { useToast } from "../components/ToastContainer";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton";
import "./Search.css";

function Search() {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const minPrice = searchParams.get("minPrice") || "0";
  const maxPrice = searchParams.get("maxPrice") || "100000";
  const sort = searchParams.get("sort") || "popular";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      filterAndSortProducts();
    }
  }, [query, products, category, minPrice, maxPrice, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast("Failed to load search results. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "all" || value === "0" || value === "" || value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.toLowerCase().includes(query.toLowerCase()) ||
          product.brand?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    const min = parseInt(minPrice, 10);
    const max = parseInt(maxPrice, 10);
    filtered = filtered.filter(
      (product) => product.price >= min && product.price <= max
    );

    switch (sort) {
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

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

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
    const newParams = new URLSearchParams();
    if (query) {
      newParams.set("q", query);
    }
    setSearchParams(newParams);
  };

  const hasActiveFilters = category !== "all" || minPrice !== "0" || maxPrice !== "100000";

  return (
    <div className="search-page">
      <Navbar />
      
      <div className="search-container">
        <SearchPageHeader 
          query={query} 
          resultCount={filteredProducts.length}
        />
        
        <FiltersSortBar
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sort={sort}
          categories={categories}
          onFilterChange={updateURL}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : filteredProducts.length === 0 ? (
          <NoResultsState query={query} onClearFilters={clearFilters} hasActiveFilters={hasActiveFilters} />
        ) : (
          <>
            <SearchResultsGrid products={paginatedProducts} />
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

function SearchPageHeader({ query, resultCount }) {
  return (
    <div className="search-page-header">
      <div className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Search</span>
        {query && (
          <>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">"{query}"</span>
          </>
        )}
      </div>
      <div className="header-content">
        <div className="header-text">
          <h1>Search Results</h1>
          {query ? (
            <p className="result-count">
              {resultCount} {resultCount === 1 ? "result" : "results"} for "<strong>{query}</strong>"
            </p>
          ) : (
            <p className="result-count">Enter a search query to find products</p>
          )}
        </div>
      </div>
    </div>
  );
}

function FiltersSortBar({ category, minPrice, maxPrice, sort, categories, onFilterChange, onClearFilters, hasActiveFilters }) {
  return (
    <div className="filters-sort-bar">
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
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
          <label htmlFor="price-range">Price Range (₹)</label>
          <div className="price-inputs">
            <input
              id="price-range"
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onFilterChange({ minPrice: e.target.value || "0" })}
              min="0"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value || "100000" })}
              min="0"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={onClearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="sort-section">
        <label htmlFor="sort-select">Sort By:</label>
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
        >
          <option value="popular">Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}

function SearchResultsGrid({ products }) {
  return (
    <div className="search-results-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function NoResultsState({ query, onClearFilters, hasActiveFilters }) {
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
      {query ? (
        <p>We couldn't find any products matching "<strong>{query}</strong>"</p>
      ) : (
        <p>Try searching for products using the search bar</p>
      )}
      {hasActiveFilters && (
        <button className="clear-filters-action-btn" onClick={onClearFilters}>
          Clear All Filters
        </button>
      )}
      <div className="suggestions">
        <p>Suggestions:</p>
        <ul>
          <li>Check your spelling</li>
          <li>Try different keywords</li>
          <li>Use more general terms</li>
          <li>Remove filters to see more results</li>
        </ul>
      </div>
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

export default Search;
