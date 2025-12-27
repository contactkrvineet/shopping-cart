import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Header.css";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <Link to="/" className="logo">
            <h1>🎨 Crafty Girls</h1>
          </Link>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="header-btn">
                  <FaUser /> {user?.name}
                </Link>
                {user?.isAdmin && (
                  <Link to="/admin" className="header-btn admin-btn">
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="header-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-btn">
                  <FaUser /> Login
                </Link>
                <Link to="/register" className="header-btn">
                  Register
                </Link>
              </>
            )}
            <Link to="/cart" className="cart-btn">
              <FaShoppingCart />
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=art-supplies">Art & Craft</Link>
            <Link to="/products?category=fashion">Fashion</Link>
            <Link to="/products?category=chocolates">Chocolates</Link>
          </nav>
          <div className="offer-banner">
            🎁 Use code <strong>AKSHARA9</strong> for 10% off!
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
