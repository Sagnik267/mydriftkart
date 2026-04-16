require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Store = require("./models/Store");
const Inventory = require("./models/Inventory");

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI not found in .env");
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected for Seeding...");

    // 1. Clear database collections related to quick-commerce
    await Category.deleteMany();
    await Product.deleteMany();
    await Store.deleteMany();
    await Inventory.deleteMany();
    console.log("Cleared existing Category, Product, Store, and Inventory data...");

    // 2. Create Categories
    const categoryData = [
      { name: 'Fruits & Vegetables', slug: 'fruits-vegetables', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400' },
      { name: 'Dairy & Eggs', slug: 'dairy-eggs', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400' },
      { name: 'Snacks', slug: 'snacks', imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400' },
      { name: 'Beverages', slug: 'beverages', imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
      { name: 'Bakery', slug: 'bakery', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
      { name: 'Personal Care', slug: 'personal-care', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400' },
      { name: 'Household', slug: 'household', imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400' },
      { name: 'Frozen Foods', slug: 'frozen-foods', imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400' },
    ];

    const categories = await Category.insertMany(categoryData);
    console.log(`Inserted ${categories.length} categories.`);
    
    // Map category names to ObjectIds
    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.name] = cat._id;
    });

    // 3. Create Products (at least 40)
    const productData = [
      // Fruits & Vegetables
      { name: 'Potato', price: 30, mrp: 35, unit: '1 kg', inStock: true, quantity: 100, category: catMap['Fruits & Vegetables'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg', tags: ['vegetable'] },
      { name: 'Tomato', price: 40, mrp: 50, unit: '500 g', inStock: true, quantity: 80, category: catMap['Fruits & Vegetables'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg', tags: ['vegetable'] },
      { name: 'Banana', price: 45, mrp: 55, unit: '1 dozen', inStock: true, quantity: 60, category: catMap['Fruits & Vegetables'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Chocolate-Chip-Cookies-%284723700ida6%29.jpg', tags: ['fruit'] },
      { name: 'Onion', price: 35, mrp: 40, unit: '1 kg', inStock: true, quantity: 90, category: catMap['Fruits & Vegetables'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Onions.jpg', tags: ['vegetable'] },
      { name: 'Spinach', price: 20, mrp: 25, unit: '250 g', inStock: true, quantity: 50, category: catMap['Fruits & Vegetables'], imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', tags: ['vegetable'] },

      // Dairy & Eggs
      { name: 'Amul Butter', price: 55, mrp: 60, unit: '100 g', inStock: true, quantity: 70, category: catMap['Dairy & Eggs'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Amul_butter.jpg', tags: ['dairy'] },
      { name: 'Amul Milk', price: 28, mrp: 30, unit: '500 ml', inStock: true, quantity: 100, category: catMap['Dairy & Eggs'], imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', tags: ['dairy'] },
      { name: 'Eggs', price: 90, mrp: 100, unit: '12 pcs', inStock: true, quantity: 60, category: catMap['Dairy & Eggs'], imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', tags: ['eggs'] },

      // Snacks
      { name: 'Parle-G Gold', price: 10, mrp: 12, unit: '100 g', inStock: true, quantity: 200, category: catMap['Snacks'], imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Parle-g-biscuit.jpg', tags: ['biscuit'] },
      { name: "Lay's Classic Salted", price: 20, mrp: 20, unit: '26 g', inStock: true, quantity: 150, category: catMap['Snacks'], imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400', tags: ['chips'] },
      { name: 'Kurkure Masala Munch', price: 20, mrp: 20, unit: '90 g', inStock: true, quantity: 120, category: catMap['Snacks'], imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400', tags: ['chips'] },
      { name: 'Haldiram Bhujia', price: 50, mrp: 55, unit: '200 g', inStock: true, quantity: 80, category: catMap['Snacks'], imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', tags: ['namkeen'] },

      // Beverages
      { name: 'Red Bull Energy Drink', price: 125, mrp: 130, unit: '250 ml', inStock: true, quantity: 50, category: catMap['Beverages'], imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400', tags: ['energy'] },
      { name: 'Coca Cola', price: 45, mrp: 50, unit: '750 ml', inStock: true, quantity: 80, category: catMap['Beverages'], imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', tags: ['soda'] },
      { name: 'Tata Tea Gold', price: 140, mrp: 155, unit: '250 g', inStock: true, quantity: 60, category: catMap['Beverages'], imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', tags: ['tea'] },

      // Bakery
      { name: 'Bread', price: 35, mrp: 40, unit: '400 g', inStock: true, quantity: 40, category: catMap['Bakery'], imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', tags: ['bread'] },
      { name: 'Cream Rolls', price: 25, mrp: 30, unit: '6 pcs', inStock: true, quantity: 30, category: catMap['Bakery'], imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', tags: ['pastry'] },
      { name: 'Rusk', price: 30, mrp: 35, unit: '200 g', inStock: true, quantity: 60, category: catMap['Bakery'], imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', tags: ['rusk'] },

      // Personal Care
      { name: 'Dove Soap', price: 55, mrp: 60, unit: '100 g', inStock: true, quantity: 80, category: catMap['Personal Care'], imageUrl: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400', tags: ['soap'] },
      { name: 'Head & Shoulders Shampoo', price: 180, mrp: 199, unit: '180 ml', inStock: true, quantity: 50, category: catMap['Personal Care'], imageUrl: 'https://images.unsplash.com/photo-1585232352617-f6f6e0e89b95?w=400', tags: ['shampoo'] },

      // Household
      { name: 'Surf Excel Easy Wash', price: 120, mrp: 135, unit: '500 g', inStock: true, quantity: 70, category: catMap['Household'], imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400', tags: ['detergent'] },
      { name: 'Vim Dishwash Bar', price: 35, mrp: 40, unit: '200 g', inStock: true, quantity: 90, category: catMap['Household'], imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400', tags: ['dishwash'] },

      // Frozen Foods
      { name: 'McCain Frozen Fries', price: 150, mrp: 175, unit: '420 g', inStock: true, quantity: 40, category: catMap['Frozen Foods'], imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', tags: ['frozen'] },
      { name: 'Amul Ice Cream Vanilla', price: 90, mrp: 100, unit: '500 ml', inStock: true, quantity: 30, category: catMap['Frozen Foods'], imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400', tags: ['icecream'] }
    ];

    const products = await Product.insertMany(productData);
    console.log(`Inserted ${products.length} products.`);

    // 4. Create Stores
    const storeData = [
      {
        name: "DriftKart Main HUB",
        address: "Master Canteen, Bhubaneswar, Odisha",
        city: "Bhubaneswar",
        pincode: "751001",
        location: {
          type: "Point",
          coordinates: [85.8245, 20.2961] // [lng, lat]
        },
        isOpen: true,
        categories: categories.map(c => c._id) // Carry all categories
      },
      {
        name: "DriftKart Patia",
        address: "KIIT Square, Patia, Bhubaneswar, Odisha",
        city: "Bhubaneswar",
        pincode: "751024",
        location: {
          type: "Point",
          coordinates: [85.8198, 20.3552] // [lng, lat]
        },
        isOpen: true,
        categories: categories.map(c => c._id)
      },
      {
        name: "DriftKart Saheed Nagar",
        address: "Bhawani Mall Area, Saheed Nagar, Bhubaneswar",
        city: "Bhubaneswar",
        pincode: "751007",
        location: {
          type: "Point",
          coordinates: [85.8408, 20.2800] // [lng, lat]
        },
        isOpen: true,
        categories: categories.map(c => c._id)
      }
    ];

    const stores = await Store.insertMany(storeData);
    console.log(`Inserted ${stores.length} stores.`);

    // 5. Create Inventory
    // Map every product to every store with some random stock
    const inventoryData = [];
    for (const store of stores) {
      for (const product of products) {
        // Random stock between 10 to 100
        const randomStock = Math.floor(Math.random() * 90) + 10;
        
        // Random slight variation in price or keep same as base Product price
        const priceVariation = (Math.random() * 10 - 5); // -5 to +5
        const storePrice = Math.max(10, Math.round(product.price + priceVariation));

        inventoryData.push({
          store: store._id,
          product: product._id,
          stock: randomStock,
          price: storePrice
        });
      }
    }

    await Inventory.insertMany(inventoryData);
    console.log(`Inserted ${inventoryData.length} inventory records.`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
