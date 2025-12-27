import React from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
        {product.isBestSeller && (
          <span className="badge best-seller">Best Seller</span>
        )}
        {product.stock === 0 && (
          <span className="badge out-of-stock">Out of Stock</span>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.category && (
          <p className="product-category">{product.category.name}</p>
        )}
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          {product.rating > 0 && (
            <span className="product-rating">
              ⭐ {product.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
