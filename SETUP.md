# Crafty Girls - Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one:
  - Local MongoDB - [Download here](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (Free Cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)

## Installation Steps

### 1. Install Dependencies

Open a terminal in the project root directory and run:

```bash
npm run install-all
```

This will install dependencies for:

- Root package (for running both client and server)
- Client (React frontend)
- Server (Node.js backend)

### 2. Configure MongoDB

#### Option A: Using Local MongoDB

1. Start MongoDB on your machine:

   ```bash
   # On macOS (if installed via Homebrew)
   brew services start mongodb-community

   # On Windows, MongoDB usually starts automatically
   # Or run: mongod
   ```

2. The default connection string in `.env` file is already configured for local MongoDB

#### Option B: Using MongoDB Atlas (Free Cloud Database)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with username and password
4. Get your connection string (should look like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/crafty-girls?retryWrites=true&w=majority
   ```
5. Update `server/.env` file with your connection string:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   ```

### 3. Environment Variables

The `server/.env` file has been created with default values. You can modify:

- `JWT_SECRET`: Change to a secure random string in production
- `MONGODB_URI`: Update if using MongoDB Atlas
- `PORT`: Default is 5001 (changed from 5000 to avoid conflicts with macOS AirPlay Receiver)

### 4. Run the Application

#### Development Mode (Runs both client and server)

```bash
npm run dev
```

This will start:

- **Backend API** on http://localhost:5001
- **Frontend** on http://localhost:3000

#### Run Separately (Optional)

**Backend only:**

```bash
npm run server
```

**Frontend only:**

```bash
npm run client
```

## Creating Your First Admin Account

Since this is a new installation, you'll need to manually create an admin account:

1. Start the application
2. Go to http://localhost:3000/register
3. Create an account with your details
4. After registration, you need to manually set this user as admin in MongoDB:

   **Using MongoDB Compass or MongoDB Shell:**

   ```javascript
   // Connect to your database
   use crafty-girls

   // Find your user by email and update isAdmin field
   db.users.updateOne(
     { email: "your_email@example.com" },
     { $set: { isAdmin: true } }
   )
   ```

5. Log out and log back in
6. You should now see "Admin Panel" in the header

## Initial Setup - Add Categories and Products

1. Login as admin
2. Go to **Admin Panel** from the header
3. Click on **Add Category** tab
4. Add categories like:

   - Art & Craft Supplies 🎨
   - Fashion 👔
   - Shoes 👟
   - Chocolates 🍫
   - Designer Wear ✨

5. Click on **Add Product** tab
6. Add products with:
   - Name, description, price
   - Category selection
   - Stock quantity
   - SKU (optional)
   - Images (provide image URLs)
   - Sizes (comma separated, e.g., S, M, L, XL)
   - Colors (comma separated, e.g., Red, Blue, Green)
   - Mark as customizable or best seller if needed

## Testing the Offer Code

The offer code **AKSHARA9** gives 10% discount. Test it during checkout!

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**

- Ensure MongoDB is running locally, OR
- Check your MongoDB Atlas connection string is correct
- Ensure your IP is whitelisted in MongoDB Atlas (Network Access)

### Port Already in Use

**Error:** `Port 3000 is already in use` or `Port 5000 is already in use`

**Solution:**

- Kill the process using that port:

  ```bash
  # On macOS/Linux
  lsof -ti:3000 | xargs kill
  lsof -ti:5000 | xargs kill

  # On Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### React Not Starting

**Error:** `react-scripts: command not found`

**Solution:**

```bash
cd client
npm install
cd ..
```

### Cannot Login After Registration

**Solution:**

- Check that MongoDB is running
- Check server console for errors
- Verify `.env` file configuration

## Project Structure

```
crafty-girls/
├── client/              # React frontend
│   ├── public/
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # Auth and Cart context
│       ├── pages/       # All page components
│       └── App.js
│
├── server/              # Node.js backend
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   └── server.js        # Entry point
│
└── package.json         # Root package file
```

## Features Checklist

✅ User Authentication (Register/Login)
✅ Product Browsing with Categories
✅ Search Functionality
✅ Product Details with Customization
✅ Shopping Cart
✅ Checkout Process
✅ Multiple Payment Methods (UI)
✅ Order Management
✅ Offer Code Support (AKSHARA9)
✅ Admin Panel for Product Management
✅ Responsive Design

## Next Steps

1. Add actual payment gateway integration (Stripe, PayPal)
2. Add email notifications for orders
3. Implement order tracking
4. Add product reviews and ratings
5. Add image upload functionality
6. Deploy to production (Heroku, Vercel, etc.)

## Support

For issues or questions, refer to:

- MongoDB docs: https://docs.mongodb.com/
- React docs: https://react.dev/
- Express docs: https://expressjs.com/

Enjoy building with Crafty Girls! 🎨
