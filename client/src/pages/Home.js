import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get("/api/products?bestSellers=true&limit=8"),
        axios.get("/api/categories"),
      ]);

      setBestSellers(productsRes.data.products);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Map category slugs to icons
  const categoryIcons = {
    bags: "👜",
    accessories: "💍",
    "home-decor": "🏠",
    "health-beauty": "💄",
    handmade: "🎨",
    toys: "🧸",
    "baby-care": "👶",
    sports: "⚽",
  };

  // Get icon for category, default to generic icon
  const getCategoryIcon = (category) => {
    return categoryIcons[category.slug] || "🛍️";
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Crafty Girls! 🎨</h1>
          <p>Your one-stop shop for art, craft supplies, fashion, and more!</p>

          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <FaSearch /> Search
            </button>
          </form>

          <div className="offer-highlight">
            <span className="offer-icon">🎁</span>
            <span>
              Use code <strong>AKSHARA10</strong> for 100% OFF your order! 🔥
            </span>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Top Categories</h2>
          {loading ? (
            <div className="loading">Loading categories...</div>
          ) : categories.length > 0 ? (
            <div className="categories-grid">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="category-card"
                >
                  <span className="category-icon">
                    {getCategoryIcon(category)}
                  </span>
                  <h3>{category.name}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="no-categories">No categories available yet.</p>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section best-sellers">
        <div className="container">
          <h2 className="section-title">🌟 Best Selling Products</h2>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : bestSellers.length > 0 ? (
            <div className="products-grid">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="no-products">No best sellers available yet.</p>
          )}
          <div className="text-center">
            <Link to="/products" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">🚚</span>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping</p>
            </div>
            <div className="feature">
              <span className="feature-icon">💳</span>
              <h3>Secure Payment</h3>
              <p>Multiple payment options</p>
            </div>
            <div className="feature">
              <span className="feature-icon">✨</span>
              <h3>Quality Products</h3>
              <p>Carefully curated items</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎨</span>
              <h3>Customization</h3>
              <p>Personalize your products</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
