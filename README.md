# Crafty Girls E-Commerce Website

A modern full-stack e-commerce platform for art, craft supplies, fashion, and more.

## 🏗️ Project Architecture

This is a **monorepo** containing two separate applications:

### 📱 Client (Frontend)

**Location:** `client/` folder  
**Technology:** React Single Page Application (SPA)  
**Port:** http://localhost:3000

**What it does:**

- Displays the user interface (product pages, cart, checkout)
- Handles user interactions (adding to cart, filtering products)
- Manages authentication state (login/signup)
- Communicates with the backend API to fetch/send data
- Uses React Context API for state management (Auth & Cart)

### 🖥️ Server (Backend)

**Location:** `server/` folder  
**Technology:** Node.js + Express REST API  
**Port:** http://localhost:5000

**What it does:**

- Provides REST API endpoints for products, orders, users, authentication
- Connects to MongoDB database to store/retrieve data
- Handles user authentication with JWT tokens
- Validates and processes orders, applies discount codes
- Protects admin routes (only admins can add/edit products)

### 🗄️ Database

**Technology:** MongoDB (local or cloud)  
**What it stores:**

- User accounts (with encrypted passwords)
- Products (with categories, prices, images, variants)
- Orders (with items, shipping address, payment info)
- Categories

---

## ✨ Features

- 🏠 Homepage with search and best sellers
- 🗂️ Product categories and filtering
- 🛍️ Product listing and detail pages
- 🛒 Shopping cart functionality
- 💳 Checkout with multiple payment options
- 👤 User authentication (Login/Signup)
- 🎫 Offer code support (AKSHARA9, AKSHARA10)
- 👨‍💼 Admin panel for product management
- 📱 Responsive design

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one option:
  - Local MongoDB - [Download here](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (Free Cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)

### Installation Steps

#### 1️⃣ Install All Dependencies

This project has 3 sets of dependencies (root, client, server):

```bash
npm run install-all
```

Or install them separately:

```bash
# Root dependencies (concurrently package)
npm install

# Client dependencies (React, axios, etc.)
cd client && npm install

# Server dependencies (Express, mongoose, etc.)
cd server && npm install
```

###🎫 Offer Codes

Use these offer codes at checkout:

- **AKSHARA9** - Get 10% off your order
- **AKSHARA10** - Get 100% off (free order)

## 👨‍💼 Admin Panel

1. Login with admin credentials (created via seed script):

   - Email: `admin@craftygirls.com`
   - Password: `admin123`

2. Access the admin panel at: http://localhost:3000/admin

3. From here you can:
   - Add new products
   - Edit existing products
   - Manage categories
   - View all products

---

## 📁 Project Structure

```
crafty-girls/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable React components (Header, ProductCard, etc.)
│   │   ├── context/       # State management (AuthContext, CartContext)
│   │   ├── pages/         # Page components (Home, Checkout, AdminPanel, etc.)
│   │   ├── App.js         # Main app component with routes
│   │   └── index.js       # App entry point
│   └── package.json       # Client dependencies
│
├── server/                # Backend Node.js/Express application
│   ├── models/           # MongoDB schemas (User, Product, Order, Category)
│   ├── routes/           # API route handlers (auth, products, orders, etc.)
│   ├── middleware/       # Auth middleware (JWT verification)
│   ├── server.js         # Server entry point
│   ├── seed.js           # Database seeding script
│   └── package.json      # Server dependencies
│
├── package.json          # Root package.json (runs both client & server)
└── README.md            # This file
```

---

## 🔧 Troubleshooting

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community
```

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Can't Login as Admin

```bash
# Re-run the seed script to create admin user
cd server
node seed.js
```

### Client Can't Connect to Server

- Make sure both client and server are running
- Check that server is running on port 5000
- Client proxy is set to `http://localhost:5001` in `client/package.json` - you may need to update this to `5000`

---

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products

- `GET /api/products` - Get all products (supports filters: category, subcategory, search, bestSellers)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders

- `POST /api/orders` - Create new order (Authenticated)
- `GET /api/orders/my-orders` - Get user's orders (Authenticated)
- `GET /api/orders/:id` - Get single order (Authenticated)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)

### Users

- `GET /api/users/profile` - Get user profile (Authenticated)
- `PUT /api/users/profile` - Update user profile (Authenticated)

---

## 📝 License

MIT

# Windows - MongoDB usually starts automatically

# Or manually run: mongod

````

**If using MongoDB Atlas:**
- Get your connection string from Atlas dashboard
- It looks like: `mongodb+srv://username:password@cluster.mongodb.net/crafty-girls`

#### 3️⃣ Set Up Environment Variables

Create a `.env` file in the `server/` folder:

```bash
cd server
touch .env
````

Add these variables to `server/.env`:

```
MONGODB_URI=mongodb://localhost:27017/crafty-girls
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

**Note:** Change `MONGODB_URI` to your Atlas connection string if using cloud database.

#### 4️⃣ Seed the Database (Optional but Recommended)

Create admin user and sample products:

```bash
cd server
node seed.js
```

This creates:

- ✅ Admin user (email: `admin@craftygirls.com`, password: `admin123`)
- ✅ Sample categories
- ✅ Sample products

---

## 🎯 Running the Application

### Option 1: Run Both Client & Server Together (Recommended)

```bash
npm run dev
```

This starts:

- **Backend server** on http://localhost:5000
- **Frontend app** on http://localhost:3000

Your browser should automatically open to http://localhost:3000

### Option 2: Run Client & Server Separately

**Terminal 1 - Start the Backend Server:**

```bash
cd server
npm run dev
```

✅ Wait for: `🚀 Server running on port 5000` and `✅ MongoDB Connected`

**Terminal 2 - Start the Frontend Client:**

```bash
cd client
npm start
```

✅ Wait for: `webpack compiled successfully`

### Other Useful Commands

```bash
# Start server only
npm run server

# Start client only
npm run client

# Build client for production
cd client && npm run build
```

---

## 🌐 Accessing Your Application

- **Frontend (User Interface):** http://localhost:3000
- **Backend (API):** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Default Offer Code

Use **AKSHARA9** for special discounts!

## Admin Panel

Access the admin panel at `/admin` to add and manage products.
