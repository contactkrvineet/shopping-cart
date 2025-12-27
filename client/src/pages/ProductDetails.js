import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [customization, setCustomization] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);

      // Set default selections
      if (response.data.sizes?.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      if (response.data.colors?.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setMessage("Please select a size");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      setMessage("Please select a color");
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor, customization);
    setMessage("Product added to cart!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate("/cart"), 500);
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="container">
        <div className="error">Product not found</div>
      </div>
    );
  }

  return (
    <div className="product-details">
      <div className="container">
        {message && <div className="success">{message}</div>}

        <div className="product-layout">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                <div className="no-image-large">No Image Available</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-details">
            <h1 className="product-title">{product.name}</h1>

            {product.category && (
              <p className="product-category-detail">
                Category: <strong>{product.category.name}</strong>
              </p>
            )}

            {product.sku && <p className="product-sku">SKU: {product.sku}</p>}

            <div className="product-rating-detail">
              {product.rating > 0 ? (
                <>
                  <FaStar className="star-icon" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="reviews-count">
                    ({product.reviews?.length || 0} reviews)
                  </span>
                </>
              ) : (
                <span>No ratings yet</span>
              )}
            </div>

            <div className="product-price-detail">
              ${product.price.toFixed(2)}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-option">
                <h4>Size</h4>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${
                        selectedSize === size ? "active" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-option">
                <h4>Color</h4>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${
                        selectedColor === color ? "active" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                      style={{ background: color.toLowerCase() }}
                    >
                      {selectedColor === color && "✓"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization */}
            {product.customizable && (
              <div className="product-option">
                <h4>Customize Your Product</h4>
                <textarea
                  className="customization-input"
                  placeholder="Enter your customization text here..."
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  rows="3"
                />
              </div>
            )}

            {/* Quantity */}
            <div className="product-option">
              <h4>Quantity</h4>
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <p className="stock-info">
                {product.stock > 0 ? (
                  <span className="in-stock">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                onClick={handleAddToCart}
                className="btn-primary"
                disabled={product.stock === 0}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="btn-secondary"
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
