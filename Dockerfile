# Multi-stage Dockerfile for Crafty Girls E-commerce

# Stage 1: Build client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Setup server
FROM node:18-alpine AS server-setup
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Stage 3: Production
FROM node:18-alpine
WORKDIR /app

# Copy server files
COPY --from=server-setup /app/server ./server

# Copy built client
COPY --from=client-build /app/client/build ./client/build

# Install serve to serve client build
RUN npm install -g concurrently

WORKDIR /app/server

# Expose ports
EXPOSE 5000
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
