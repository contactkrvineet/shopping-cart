# Database Management Guide

## Quick Setup - Seed Database with Admin & Products

The easiest way to set up admin user and sample products:

```bash
cd server
node seed.js
```

This will create:
- ✅ Admin user (email: admin@craftygirls.com, password: admin123)
- ✅ Sample categories (Bags, Accessories, Home Decor)
- ✅ 5 sample products

## Manual MongoDB Operations

### 1. Make an Existing User Admin

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use crafty-girls

# Find user by email
db.users.findOne({ email: "user@example.com" })

# Update user to admin
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isAdmin: true } }
)

# Verify
db.users.findOne({ email: "user@example.com" }, { email: 1, isAdmin: 1, name: 1 })
```

### 2. View All Users

```bash
mongosh
use crafty-girls
db.users.find({}, { email: 1, name: 1, isAdmin: 1 }).pretty()
```

### 3. Create Admin User Directly

```bash
mongosh
use crafty-girls

db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere", // You need to hash this!
  phone: "1234567890",
  isAdmin: true,
  createdAt: new Date()
})
```

**⚠️ Note:** The password needs to be hashed with bcrypt. It's easier to use the registration endpoint or seed script.

### 4. Add Categories

```bash
mongosh
use crafty-girls

db.categories.insertMany([
  {
    name: "Bags",
    slug: "bags",
    description: "Stylish bags collection",
    createdAt: new Date()
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Beautiful accessories",
    createdAt: new Date()
  }
])
```

### 5. Add Products

```bash
mongosh
use crafty-girls

# First get a category ID
var categoryId = db.categories.findOne({ slug: "bags" })._id

# Add a product
db.products.insertOne({
  name: "Sample Bag",
  description: "A beautiful handcrafted bag",
  price: 599,
  category: categoryId,
  subcategory: "womens",
  sku: "BAG-001",
  images: ["https://example.com/image.jpg"],
  stock: 50,
  isBestSeller: true,
  isAvailable: true,
  colors: ["Red", "Blue"],
  sizes: ["Medium", "Large"],
  createdAt: new Date()
})
```

### 6. View All Products

```bash
mongosh
use crafty-girls
db.products.find({}, { name: 1, sku: 1, price: 1, stock: 1 }).pretty()
```

### 7. Delete All Data (Reset Database)

```bash
mongosh
use crafty-girls

# Be careful! This deletes all data
db.users.deleteMany({})
db.products.deleteMany({})
db.categories.deleteMany({})
db.orders.deleteMany({})
```

## Troubleshooting Login Issues

### Issue: Users Can't Login

**Possible causes:**

1. **Password not hashed correctly**
   - Solution: Use the registration endpoint or seed script to create users

2. **Server not running**
   ```bash
   cd server
   npm start
   ```

3. **MongoDB not connected**
   - Check if MongoDB is running: `mongosh`
   - Check server logs for connection errors

4. **JWT_SECRET not configured**
   - Create `.env` file in server folder:
   ```
   MONGODB_URI=mongodb://localhost:27017/crafty-girls
   JWT_SECRET=your-secret-key-here-change-this
   PORT=5000
   ```

5. **CORS issues**
   - The server already has CORS enabled, but check browser console

### Check Server Health

```bash
# Test if server is running
curl http://localhost:5000/api/health

# Should return: {"status":"OK","message":"Crafty Girls API is running"}
```

### Test Login with curl

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@craftygirls.com","password":"admin123"}'
```

## Product Schema Reference

When adding products, include these fields:

```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: ObjectId (required) - reference to Category,
  subcategory: String - one of: "kids", "mens", "womens", "school-girls", "college-girls", "all",
  sku: String (required, unique),
  images: [String] - array of image URLs,
  stock: Number (default: 0),
  isBestSeller: Boolean (default: false),
  isAvailable: Boolean (default: true),
  colors: [String] - available colors,
  sizes: [String] - available sizes
}
```

## User Schema Reference

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, min 6 chars, will be hashed),
  phone: String (required),
  age: Number,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  isAdmin: Boolean (default: false)
}
```
