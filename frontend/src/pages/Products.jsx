import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import "./Products.css";

function Products() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, selectedBrand, priceRange, minRating, availability, sortBy]);

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

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    filtered = filtered.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    if (minRating > 0) {
      filtered = filtered.filter((product) => (product.rating || 0) >= minRating);
    }

    if (availability === "in-stock") {
      filtered = filtered.filter((product) => product.stock > 0);
    } else if (availability === "out-of-stock") {
      filtered = filtered.filter((product) => product.stock === 0);
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
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];
  const brands = ["all", ...new Set(products.map((p) => p.brand).filter(Boolean))];

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const categoryName = selectedCategory === "all" ? "All Products" : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  return (
    <div className="products-page">
      <Navbar />
      <div className="products-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{categoryName}</span>
        </div>

        <div className="products-header">
          <h1>{categoryName}</h1>
          <p>Discover our amazing collection of fashion products</p>
        </div>

        <div className="products-layout">
          <aside className="filters-sidebar">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <label>Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Brand</label>
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand.charAt(0).toUpperCase() + brand.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
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

            <div className="filter-group">
              <label>Rating</label>
              <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={3}>3+ Stars</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Availability</label>
              <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
                <option value="all">All</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            <button className="clear-filters" onClick={() => {
              setSelectedCategory("all");
              setSelectedBrand("all");
              setPriceRange({ min: 0, max: 100000 });
              setMinRating(0);
              setAvailability("all");
            }}>
              Clear All Filters
            </button>
          </aside>

          <main className="products-main">
            <div className="products-toolbar">
              <p className="results-count">
                Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="empty-state">
                <h2>No products found</h2>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
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

export default Products;

