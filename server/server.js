const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/crafty-girls"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Root route - Welcome message
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Crafty Girls E-Commerce API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      authentication: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
      },
      products: {
        getAll: "GET /api/products",
        getById: "GET /api/products/:id",
        create: "POST /api/products (Admin only)",
        update: "PUT /api/products/:id (Admin only)",
        delete: "DELETE /api/products/:id (Admin only)",
      },
      categories: {
        getAll: "GET /api/categories",
        create: "POST /api/categories (Admin only)",
      },
      orders: {
        create: "POST /api/orders (Authenticated)",
        getMyOrders: "GET /api/orders/my-orders (Authenticated)",
        getById: "GET /api/orders/:id (Authenticated)",
      },
      users: {
        getProfile: "GET /api/users/profile (Authenticated)",
        updateProfile: "PUT /api/users/profile (Authenticated)",
      },
      health: "GET /api/health",
    },
    documentation: "https://github.com/contactkrvineet/shopping-cart",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Crafty Girls API is running" });
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

// 404 handler - must be after all other routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: "Visit / for list of available endpoints",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
