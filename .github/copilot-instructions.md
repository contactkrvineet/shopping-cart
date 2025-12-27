# Crafty Girls E-Commerce - AI Agent Instructions

## Project Architecture

This is a full-stack MERN e-commerce platform with clear client-server separation:

- **Frontend**: React SPA ([client/](client/)) using Context API for state management
- **Backend**: Express REST API ([server/](server/)) with MongoDB via Mongoose
- **Monorepo**: Root manages both with `npm run dev` (runs concurrently)

## Critical Setup & Workflows

### Development Commands

```bash
npm run install-all    # Install all dependencies (root, client, server)
npm run dev            # Start both client (port 3000) and server (port 5000/5001)
npm run client         # Client only
npm run server         # Server only (nodemon for hot reload)
```

**Port Configuration**: Client proxy is set to `http://localhost:5001` in [client/package.json](client/package.json), but server defaults to port 5000. Verify `process.env.PORT` or update proxy to match actual server port.

### Database Seeding

The [server/seed.js](server/seed.js) script is the standard way to initialize the database:

```bash
cd server && node seed.js
```

Creates admin user (admin@craftygirls.com / admin123), sample categories, and products. See [DATABASE_GUIDE.md](DATABASE_GUIDE.md) for manual MongoDB operations.

### Environment Setup

Server requires `.env` in [server/](server/) directory:

```
MONGODB_URI=mongodb://localhost:27017/crafty-girls
JWT_SECRET=your_secret_key
PORT=5000
```

## Key Patterns & Conventions

### Authentication Flow

- JWT tokens stored in `localStorage` on client
- [client/src/context/AuthContext.js](client/src/context/AuthContext.js) manages auth state and sets axios default header: `Authorization: Bearer <token>`
- Protected routes use [PrivateRoute.js](client/src/components/PrivateRoute.js) wrapper
- Server middleware: `auth` for users, `adminAuth` for admin-only routes (see [server/middleware/auth.js](server/middleware/auth.js))

### Cart Management

- Cart state in [CartContext.js](client/src/context/CartContext.js), persisted to localStorage
- Cart items include product variants (size, color) and optional customization
- Uniqueness: Cart items with same product but different size/color are separate entries

### Offer Code System

Two hardcoded offer codes in checkout flow ([client/src/pages/Checkout.js](client/src/pages/Checkout.js)):

- `AKSHARA9`: 10% discount
- `AKSHARA10`: 100% discount (free)
  Backend validates and applies discount in [server/routes/orders.js](server/routes/orders.js)

### Product Schema Specifics

Products ([server/models/Product.js](server/models/Product.js)) have:

- **subcategory** enum: `kids`, `mens`, `womens`, `school-girls`, `college-girls`, `all`
- **category** as ObjectId reference to Category collection
- Arrays for `sizes`, `colors`, `images`
- Text search enabled on products (see product routes filtering)

### Route Structure

API routes follow `/api/<resource>` pattern:

- `/api/auth` - Login/register
- `/api/products` - Product CRUD, filtering (category, subcategory, search, bestSellers)
- `/api/categories` - Category management
- `/api/orders` - Order creation, user order history
- `/api/users` - User profile management

Admin routes use `adminAuth` middleware for authorization (e.g., POST/PUT/DELETE products).

## Testing Strategy

**Current State**: No test suites configured

- Client: `react-scripts test --passWithNoTests` (placeholder)
- Server: `echo "Warning: No tests specified" && exit 0`

When adding tests, follow patterns for React Testing Library (client) and Jest/Supertest (server API).

## Docker Deployment

[docker-compose.yml](docker-compose.yml) orchestrates three services:

1. **mongodb**: Local MongoDB container
2. **server**: Backend API (uses root [Dockerfile](Dockerfile))
3. **client**: Nginx-served React build

Production server connects to `mongodb://mongodb:27017/crafty-girls` (Docker network). Client served via Nginx on port 80 (exposed as 3000).

## Common Gotchas

1. **Port Mismatch**: Client proxy expects 5001, server defaults to 5000
2. **Admin Access**: Use seed script to create admin; setting `isAdmin: true` manually requires direct DB access
3. **Auth Headers**: Client must include token in axios requests; AuthContext auto-sets default header
4. **Order Numbers**: Auto-generated in Order model via pre-save hook (see [server/models/Order.js](server/models/Order.js))
5. **CORS**: Server enables CORS for all origins (production should restrict)

## File Organization

- **Contexts**: [client/src/context/](client/src/context/) - AuthContext, CartContext
- **Pages**: [client/src/pages/](client/src/pages/) - Route components (Home, Checkout, AdminPanel, etc.)
- **Models**: [server/models/](server/models/) - Mongoose schemas (User, Product, Order, Category)
- **Routes**: [server/routes/](server/routes/) - Express route handlers
- **Middleware**: [server/middleware/auth.js](server/middleware/auth.js) - JWT verification

## Making Changes

- **Adding Products**: Use admin panel at `/admin` or seed script, not manual DB inserts
- **New Routes**: Follow existing pattern in [server/server.js](server/server.js) and create route file in [server/routes/](server/routes/)
- **Protected Features**: Wrap routes with `<PrivateRoute>` on client, use `auth`/`adminAuth` middleware on server
- **State Management**: Extend AuthContext or CartContext for global state; use local state for component-specific data
