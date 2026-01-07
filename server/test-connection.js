require("dotenv").config();
const mongoose = require("mongoose");

console.log("=== MongoDB Connection Test ===");
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("Mongoose version:", mongoose.version);
console.log("\nAttempting connection...\n");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    console.log("Connection state:", mongoose.connection.readyState);
    console.log("Database name:", mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed!");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("\nFull error:", err);
    process.exit(1);
  });

// Add timeout
setTimeout(() => {
  console.log("\n⏰ Connection attempt timed out after 10 seconds");
  process.exit(1);
}, 10000);
