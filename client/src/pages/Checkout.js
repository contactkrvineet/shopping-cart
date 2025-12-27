import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Checkout.css";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "India",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Brazil",
  "Mexico",
  "Other",
];

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    country: user?.address?.country || "",
    zipCode: user?.address?.zipCode || "",
    phone: user?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [offerCode, setOfferCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const applyOfferCode = () => {
    if (offerCode.toUpperCase() === "AKSHARA10") {
      const discountAmount = getCartTotal(); // 100% off
      setDiscount(discountAmount);
      setError("");
    } else if (offerCode.toUpperCase() === "AKSHARA9") {
      const discountAmount = getCartTotal() * 0.1;
      setDiscount(discountAmount);
      setError("");
    } else if (offerCode) {
      setError("Invalid offer code");
      setDiscount(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          customization: item.customization,
        })),
        shippingAddress: formData,
        paymentMethod,
        offerCode: offerCode.toUpperCase(),
        discount,
        subtotal: getCartTotal(),
        total: getCartTotal() - discount,
      };

      const response = await axios.post("/api/orders", orderData);

      clearCart();
      navigate(`/order/${response.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const total = subtotal - discount;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="checkout-layout">
          <div className="checkout-main">
            {/* Shipping Address */}
            <div className="checkout-section">
              <h2>Shipping Address</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                {[
                  { value: "credit-card", label: "Credit Card", icon: "💳" },
                  { value: "debit-card", label: "Debit Card", icon: "💳" },
                  { value: "net-banking", label: "Net Banking", icon: "🏦" },
                  { value: "cash", label: "Cash on Delivery", icon: "💵" },
                ].map((method) => (
                  <label key={method.value} className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="payment-label">
                      <span className="payment-icon">{method.icon}</span>
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-sidebar">
            <div className="order-summary-box">
              <h2>Order Summary</h2>

              <div className="summary-items">
                {cartItems.map((item, index) => (
                  <div key={index} className="summary-item">
                    <span className="summary-item-name">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="summary-item-price">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Offer Code */}
              <div className="offer-code-section">
                <label>Offer Code</label>
                <div className="offer-input-group">
                  <input
                    type="text"
                    value={offerCode}
                    onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                    placeholder="Enter AKSHARA9"
                    className="input-field"
                  />
                  <button
                    type="button"
                    onClick={applyOfferCode}
                    className="apply-btn"
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <p className="discount-applied">
                    ✓ Discount applied: -${discount.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary place-order-btn"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
