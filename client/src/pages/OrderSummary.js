import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import "./OrderSummary.css";

const OrderSummary = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="container">
        <div className="error">Order not found</div>
      </div>
    );
  }

  return (
    <div className="order-summary-page">
      <div className="container">
        <div className="success-banner">
          <FaCheckCircle className="success-icon" />
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your purchase. Your order has been received.</p>
        </div>

        <div className="order-details-card">
          <div className="order-header">
            <div>
              <h2>Order #{order.orderNumber}</h2>
              <p className="order-date">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="order-status">
              <span className={`status-badge ${order.orderStatus}`}>
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-info">
                    <h4>{item.name}</h4>
                    {item.size && <p>Size: {item.size}</p>}
                    {item.color && <p>Color: {item.color}</p>}
                    {item.customization && (
                      <p className="customization-text">
                        Customization: {item.customization}
                      </p>
                    )}
                  </div>
                  <div className="order-item-price">
                    <p>Qty: {item.quantity}</p>
                    <p className="price">${item.price.toFixed(2)}</p>
                    <p className="total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="order-section">
            <h3>Shipping Address</h3>
            <div className="address-box">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p>
                {order.shippingAddress.country} -{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment & Pricing */}
          <div className="order-section">
            <h3>Payment Information</h3>
            <div className="payment-info">
              <div className="info-row">
                <span>Payment Method:</span>
                <span className="method-badge">{order.paymentMethod}</span>
              </div>
              <div className="info-row">
                <span>Payment Status:</span>
                <span className={`status-badge ${order.paymentStatus}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="total-row discount">
                <span>Discount ({order.offerCode})</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="divider"></div>
            <div className="total-row final">
              <span>Total Paid</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="order-actions">
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
            <Link to="/profile" className="btn-secondary">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
