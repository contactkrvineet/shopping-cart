import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders/my-orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">My Account</h1>

        <div className="profile-layout">
          {/* User Info */}
          <div className="profile-card">
            <h2>Profile Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <p>{user?.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{user?.phone || "Not provided"}</p>
              </div>
              <div className="info-item">
                <label>Age</label>
                <p>{user?.age || "Not provided"}</p>
              </div>
            </div>

            {user?.address && (
              <>
                <h3>Shipping Address</h3>
                <div className="address-display">
                  <p>{user.address.street}</p>
                  <p>
                    {user.address.city}, {user.address.state}
                  </p>
                  <p>
                    {user.address.country} - {user.address.zipCode}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Orders */}
          <div className="orders-section">
            <h2>My Orders</h2>
            {loading ? (
              <div className="loading">Loading orders...</div>
            ) : orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => (
                  <Link
                    key={order._id}
                    to={`/order/${order._id}`}
                    className="order-card"
                  >
                    <div className="order-card-header">
                      <div>
                        <h3>Order #{order.orderNumber}</h3>
                        <p className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`status-badge ${order.orderStatus}`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="order-summary">
                      <p>{order.items.length} item(s)</p>
                      <p className="order-total">${order.total.toFixed(2)}</p>
                    </div>

                    <div className="order-items-preview">
                      {order.items.slice(0, 3).map((item, index) => (
                        <span key={index} className="item-preview">
                          {item.name}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="more-items">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-orders">
                <p>You haven't placed any orders yet.</p>
                <Link to="/products" className="btn-primary">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
