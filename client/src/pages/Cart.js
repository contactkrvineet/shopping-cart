import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import "./Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <h2>Your Cart is Empty</h2>
            <p>Add some amazing products to your cart!</p>
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-image">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img src={item.product.images[0]} alt={item.product.name} />
                  ) : (
                    <div className="no-image-cart">No Image</div>
                  )}
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.product.name}</h3>
                  {item.size && (
                    <p className="item-variant">Size: {item.size}</p>
                  )}
                  {item.color && (
                    <p className="item-variant">Color: {item.color}</p>
                  )}
                  {item.customization && (
                    <p className="item-customization">
                      Customization: {item.customization}
                    </p>
                  )}
                  <p className="item-price">${item.product.price.toFixed(2)}</p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product._id,
                        item.size,
                        item.color,
                        item.quantity - 1
                      )
                    }
                    className="qty-btn"
                  >
                    <FaMinus />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product._id,
                        item.size,
                        item.color,
                        item.quantity + 1
                      )
                    }
                    className="qty-btn"
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="item-total">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() =>
                    removeFromCart(item.product._id, item.size, item.color)
                  }
                  className="item-remove"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-primary checkout-btn"
            >
              Proceed to Checkout
            </button>

            <button onClick={clearCart} className="btn-secondary clear-btn">
              Clear Cart
            </button>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
