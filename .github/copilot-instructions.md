```markdown
# Crafty Girls — AI Agent Instructions (concise)

## Purpose

Quick reference for AI agents editing or extending this MERN monorepo: front-end React SPA in `client/`, backend Express API in `server/`, and optional Docker compose for local infra.

## Quick start commands

- **Install all deps:** `npm run install-all`
- **Dev (client + server):** `npm run dev` (client -> 3000, server -> 5001 by default in `.env`)
- **Server only:** `npm run server`
- **Client only:** `npm run client`v

## Environment & MongoDB

- `.env` lives in `server/`; common keys: `MONGODB_URI`, `JWT_SECRET`, `PORT` (project uses `5001` in docs to avoid macOS conflicts).
- macOS local Mongo start: `brew services start mongodb-community` (see `SETUP.md`).
- Seed DB: `cd server && node seed.js` creates an admin and sample data (admin email shown in seed file).

## Key files to inspect or edit

- `server/server.js` — app entry, route mounting and CORS
- `server/routes/*.js` — API endpoints (auth, products, categories, orders, users)
- `server/middleware/auth.js` — `auth` and `adminAuth` guards
- `server/models/Product.js` — product schema (note `subcategory` enum and arrays for `sizes`, `colors`)
- `server/models/Order.js` — order numbering pre-save hook
- `server/seed.js` — DB seed / admin user
- `client/src/context/AuthContext.js` — auth state and axios header helper
- `client/src/context/CartContext.js` — cart persistence and item uniqueness rules
- `client/src/components/PrivateRoute.js` — route protection
- `client/src/pages/Checkout.js` — client-side offer codes (`AKSHARA9`, `AKSHARA10`) and checkout flow

## Project-specific conventions (do not assume defaults)

- Offer codes are hardcoded in the frontend and validated on the backend (`AKSHARA9` = 10%, `AKSHARA10` = free). See `client/src/pages/Checkout.js` and `server/routes/orders.js`.
- Cart items are unique by product + variant (size/color). Do not collapse different-variant items.
- Auth tokens stored in `localStorage`; modifying AuthContext must preserve axios default header behavior.

## Common edits & debugging tips

- If client cannot reach API, confirm `client/package.json` `proxy` matches `server/.env:PORT`.
- Common port conflict workaround: `lsof -ti:3000 | xargs kill` or `lsof -ti:5001 | xargs kill`.
- To add admin-only APIs, use `adminAuth` middleware in `server/middleware/auth.js`.

## Docker & deployment notes

- `docker-compose.yml` includes `mongodb`, `server`, and `client` services; production server uses `mongodb://mongodb:27017/crafty-girls`.

## Where to run tests

- No automated test suite exists. Follow patterns in React Testing Library / Jest for client and Jest/Supertest for server if you add tests.

---

If anything here is unclear or missing, tell me which area you want expanded (setup, routes, auth, checkout), and I will iterate.
```
