const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { auth } = require("../middleware/auth");

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, offerCode } = req.body;

    // Calculate subtotal
    let subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Apply offer code
    let discount = 0;
    if (offerCode === "AKSHARA9") {
      discount = subtotal * 0.1; // 10% discount
    }

    const total = subtotal - discount;

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      offerCode,
      discount,
      subtotal,
      total,
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name images")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
