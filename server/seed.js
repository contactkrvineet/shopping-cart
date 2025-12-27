const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/crafty-girls"
    );
    console.log("✅ Connected to MongoDB");

    // Create Admin User
    console.log("\n📝 Creating admin user...");
    const adminEmail = "admin@craftygirls.com";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists");
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log("✅ Updated existing user to admin");
    } else {
      const admin = new User({
        name: "Admin User",
        email: adminEmail,
        password: "admin123", // Change this!
        phone: "1234567890",
        isAdmin: true,
      });
      await admin.save();
      console.log("✅ Admin user created successfully");
      console.log(`   Email: ${adminEmail}`);
      console.log("   Password: admin123 (Please change after first login!)");
    }

    // Create Categories
    console.log("\n📁 Creating categories...");
    const categories = [
      {
        name: "Bags",
        slug: "bags",
        description: "Stylish and functional bags for every occasion",
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Beautiful accessories to complement your style",
      },
      {
        name: "Home Decor",
        slug: "home-decor",
        description: "Handcrafted items to beautify your home",
      },
      {
        name: "Health and Beauty",
        slug: "health-beauty",
        description: "Natural and organic health and beauty products",
      },
      {
        name: "Handmade",
        slug: "handmade",
        description: "Unique handmade crafts and artisan products",
      },
      {
        name: "Toys",
        slug: "toys",
        description: "Fun and educational toys for all ages",
      },
      {
        name: "Baby Care",
        slug: "baby-care",
        description: "Essential products for baby care and comfort",
      },
      {
        name: "Sports",
        slug: "sports",
        description: "Sports equipment and accessories for active lifestyles",
      },
    ];

    const createdCategories = [];
    for (const cat of categories) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (existing) {
        createdCategories.push(existing);
        console.log(`   ✓ Category "${cat.name}" already exists`);
      } else {
        const category = await Category.create(cat);
        createdCategories.push(category);
        console.log(`   ✓ Created category "${cat.name}"`);
      }
    }

    // Create Sample Products
    console.log("\n🛍️  Creating sample products...");
    const products = [
      {
        name: "Floral Canvas Tote Bag",
        description:
          "Beautiful handcrafted tote bag with vibrant floral patterns. Perfect for daily use, shopping, or beach trips.",
        price: 499,
        category: createdCategories[0]._id,
        subcategory: "womens",
        sku: "BAG-TOTE-001",
        images: [
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
        ],
        stock: 50,
        isBestSeller: true,
        colors: ["Red", "Blue", "Green", "Yellow"],
        sizes: ["One Size"],
      },
      {
        name: "Leather Crossbody Bag",
        description:
          "Elegant crossbody bag made from premium quality leather. Features adjustable strap and multiple compartments.",
        price: 899,
        category: createdCategories[0]._id,
        subcategory: "womens",
        sku: "BAG-CROSS-002",
        images: [
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
        ],
        stock: 30,
        isBestSeller: true,
        colors: ["Brown", "Black", "Tan"],
        sizes: ["S", "M"],
      },
      {
        name: "School Backpack",
        description:
          "Durable and spacious backpack perfect for school. Multiple pockets and padded laptop compartment.",
        price: 699,
        category: createdCategories[0]._id,
        subcategory: "school-girls",
        sku: "BAG-BACK-003",
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        ],
        stock: 100,
        isBestSeller: false,
        colors: ["Pink", "Purple", "Blue", "Black"],
        sizes: ["One Size"],
      },
      {
        name: "Beaded Bracelet Set",
        description:
          "Handmade beaded bracelets set of 3. Perfect for stacking and mixing with other accessories.",
        price: 299,
        category: createdCategories[1]._id,
        subcategory: "all",
        sku: "ACC-BRAC-001",
        images: [
          "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500",
          "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500",
        ],
        stock: 75,
        isBestSeller: true,
        colors: ["Multi-color"],
        sizes: ["One Size"],
      },
      {
        name: "Decorative Wall Hanging",
        description:
          "Beautiful macrame wall hanging to add bohemian charm to your space. Handcrafted with premium cotton.",
        price: 799,
        category: createdCategories[2]._id,
        subcategory: "all",
        sku: "HOME-WALL-001",
        images: [
          "https://images.unsplash.com/photo-1563089145-599997674d42?w=500",
          "https://images.unsplash.com/photo-1563089145-599997674d42?w=500",
        ],
        stock: 25,
        isBestSeller: false,
        colors: ["Cream", "White", "Beige"],
        sizes: ["M", "L"],
      },
    ];

    for (const prod of products) {
      const existing = await Product.findOne({ sku: prod.sku });
      if (existing) {
        console.log(`   ✓ Product "${prod.name}" already exists`);
      } else {
        await Product.create(prod);
        console.log(`   ✓ Created product "${prod.name}"`);
      }
    }

    console.log("\n✅ Database seeded successfully!");
    console.log("\n🔑 Login credentials:");
    console.log("   Email: admin@craftygirls.com");
    console.log("   Password: admin123");
    console.log(
      "\n⚠️  IMPORTANT: Please change the admin password after first login!"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
