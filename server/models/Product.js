const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: String,
    enum: ["kids", "mens", "womens", "school-girls", "college-girls", "all"],
    default: "all",
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  images: [
    {
      type: String,
    },
  ],
  sizes: [
    {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "One Size"],
    },
  ],
  colors: [
    {
      type: String,
    },
  ],
  customizable: {
    type: Boolean,
    default: false,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for search
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
