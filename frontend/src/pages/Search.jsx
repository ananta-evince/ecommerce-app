import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import "./Search.css";

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [query, products, sortBy, selectedCategory, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    filtered = filtered.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

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
        break;
    }

    setFilteredProducts(filtered);
  };

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="search-page">
      <Navbar />
      <div className="search-container">
        <div className="search-header">
          <h1>Search Results</h1>
          {query && (
            <p className="search-query">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for "{query}"
            </p>
          )}
        </div>

        <div className="search-filters">
          <div className="filter-item">
            <label>Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="filter-item">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
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
            <h2>No products found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Search;

