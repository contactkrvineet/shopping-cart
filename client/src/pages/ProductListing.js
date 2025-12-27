import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "./ProductListing.css";

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  const selectedSubcategory = searchParams.get("subcategory") || "";

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, selectedSubcategory, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (searchQuery) params.append("search", searchQuery);
      if (selectedSubcategory)
        params.append("subcategory", selectedSubcategory);
      params.append("page", currentPage);

      const response = await axios.get(`/api/products?${params.toString()}`);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    params.delete("page");
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleSubcategoryChange = (subcategory) => {
    const params = new URLSearchParams(searchParams);
    if (subcategory) {
      params.set("subcategory", subcategory);
    } else {
      params.delete("subcategory");
    }
    params.delete("page");
    setSearchParams(params);
    setCurrentPage(1);
  };

  const subcategories = [
    { value: "", label: "All" },
    { value: "kids", label: "Kids" },
    { value: "mens", label: "Mens" },
    { value: "womens", label: "Womens" },
    { value: "school-girls", label: "School Girls" },
    { value: "college-girls", label: "College Girls" },
  ];

  return (
    <div className="product-listing">
      <div className="container">
        <div className="listing-layout">
          {/* Left Sidebar - Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={!selectedCategory}
                    onChange={() => handleCategoryChange("")}
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((category) => (
                  <label key={category._id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category._id}
                      onChange={() => handleCategoryChange(category._id)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>For</h3>
              <div className="filter-options">
                {subcategories.map((sub) => (
                  <label key={sub.value} className="filter-option">
                    <input
                      type="radio"
                      name="subcategory"
                      checked={selectedSubcategory === sub.value}
                      onChange={() => handleSubcategoryChange(sub.value)}
                    />
                    <span>{sub.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Products */}
          <main className="products-main">
            <div className="products-header">
              <h2>
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : selectedCategory
                  ? "Products"
                  : "All Products"}
              </h2>
              <p className="products-count">{products.length} products found</p>
            </div>

            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
