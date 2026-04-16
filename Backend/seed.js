const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load env
require('dotenv').config({ path: __dirname + '/.env' });

const User = require('./models/User');
const Shop = require('./models/Shop');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Cart = require('./models/Cart');

// Connect Database
mongoose.connect(process.env.MONGO_URI, {
  family: 4 // Force IPv4
}).then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error(err));

const hashPassword = async (pass) => {
  return await bcrypt.hash(pass, 10);
};

// Utilities
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomBoolean = (chance = 0.5) => Math.random() < chance;

const CATEGORIES = ["Helmets", "Tyres", "Engine Parts", "Accessories", "Kart Frames", "Safety Gear", "Tools", "Apparel"];
const SECTIONS = {
  "Helmets": ["Full Face Karting", "Visor Tear-offs", "Aerodynamic Helmet", "Kids Helmet", "Carbon Fiber", "Rally Cross Helmet"],
  "Tyres": ["Slick Tyres Set", "Rain Tyres", "All-Terrain Grooved", "Soft Compound Rubber", "Hard Compound Setup", "Go-Kart Hub Assembly"],
  "Engine Parts": ["High Flow Intake", "Ignition Coil", "Performance Carburetor", "Exhaust Muffler 4-Stroke", "Clutch Assembly", "Piston Ring Set"],
  "Accessories": ["Steering Wheel", "Mirror Kit", "Telemetry Dash", "Action Camera Mount", "Racing Pedals", "Chain Lube Spray"],
  "Kart Frames": ["Chassis Welding Kit", "Aero Bumper", "Rear Axle 40mm", "Seat Brackets", "Side Pods", "Floor Pan Carbon"],
  "Safety Gear": ["Neck Brace", "Rib Protector", "Racing Gloves", "Fire Retardant Suit", "Racing Shoes", "Nomex Balaclava"],
  "Tools": ["Tyre Bead Breaker", "Torque Wrench", "Chain Breaker", "Spark Plug Puller", "Laser Alignment Tool", "Air Pressure Guage"],
  "Apparel": ["Team T-Shirt", "Sponsor Cap", "Pit Crew Jacket", "Karting Backpack", "Visor Cleaner Towel", "Hoodie Racing Edition"]
};

// Seed Script
const importData = async () => {
  try {
    console.log('Clearing database...');
    await User.deleteMany();
    await Shop.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Cart.deleteMany();

    console.log('Starting population...');

    // 1. ADMIN
    const admin = await User.create({
      name: 'DriftKart Admin',
      email: 'admin@driftkart.com',
      password: 'Admin@123',
      role: 'admin',
    });

    // 2. SHOPKEEPERS (5)
    const shopNames = ["AutoParts Hub", "Speed Garage", "Drift Accessories", "Kart Kingdom", "Turbo Traders"];
    let shopkeepers = [];
    let shops = [];

    for (let i = 0; i < 5; i++) {
      const sk = await User.create({
        name: shopNames[i] + ' Owner',
        email: `shop${i + 1}@driftkart.com`,
        password: 'Shop@1234',
        role: 'shopkeeper',
        phone: `987654321${i}`
      });
      shopkeepers.push(sk);

      const shop = await Shop.create({
        user: sk._id,
        name: shopNames[i],
        description: `Premium supplier for all your karting needs at ${shopNames[i]}.`,
        rating: randomInt(3, 5),
        logo: 'https://placehold.co/150x150/ff4500/fff?text=' + shopNames[i].substring(0,2)
      });
      shops.push(shop);
    }

    // 3. USERS (10)
    const userNames = ["Aarav Patel", "Riya Sharma", "Vihaan Singh", "Ananya Gupta", "Aryan Kumar", "Diya Reddy", "Kabir Joshi", "Ishita Verma", "Arjun Nair", "Neha Das"];
    let users = [];

    for (let i = 0; i < 10; i++) {
      const usr = await User.create({
        name: userNames[i],
        email: `user${i + 1}@driftkart.com`,
        password: 'User@1234',
        role: 'user',
        phone: `910000000${i}`,
        address: {
          street: `${randomInt(1, 99)}, Industrial Phase ${randomInt(1,5)}`,
          city: randomItem(["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad", "Kolkata"]),
          state: "State",
          pincode: `40000${i}`
        }
      });
      users.push(usr);
    }

    // 4. DELIVERY AGENTS (2)
    const agentNames = ["Raju Deliveries", "Vikram Logistics"];
    let agents = [];
    for (let i = 0; i < 2; i++) {
      const ag = await User.create({
        name: agentNames[i],
        email: `agent${i + 1}@driftkart.com`,
        password: 'Agent@123',
        role: 'agent',
        phone: `999888777${i}`,
        agentStatus: 'offline'
      });
      agents.push(ag);
    }
    console.log('Created 2 Delivery Agents');

    // 5. PRODUCTS (50) - Spread across 8 categories (at least 6 each)
    let products = [];
    let featuredCount = 0;
    let discountCount = 0;

    for (const [category, itemNames] of Object.entries(SECTIONS)) {
      for (let i = 0; i < itemNames.length; i++) {
        let price = randomInt(199, 49000);
        let originalPrice = null;

        if (discountCount < 8 && randomBoolean(0.3)) {
          originalPrice = price + randomInt(500, 5000);
          discountCount++;
        }

        let isFeatured = false;
        if (featuredCount < 10 && randomBoolean(0.2)) {
          isFeatured = true;
          featuredCount++;
        }

        const product = await Product.create({
          name: itemNames[i] + ` ${randomItem(['Pro', 'Max', 'Edition', 'Kit', 'X'])}`,
          description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. This high-end ${itemNames[i]} ensures maximum performance on the track. Manufactured with premium materials. Available in stock now!`,
          price,
          originalPrice,
          category,
          stock: randomInt(10, 200),
          images: [`https://placehold.co/600x400/13131a/eee?text=${encodeURIComponent(itemNames[i])}`],
          shopkeeper: randomItem(shops)._id,
          featured: isFeatured,
          tags: ["karting", randomItem(["racing", "tuning", "safety", "upgrade"])]
        });
        products.push(product);
      }
    }
    // ensure quotas
    while (featuredCount < 10) { products[randomInt(0, products.length-1)].featured = true; await products[randomInt(0, products.length-1)].save(); featuredCount++; }
    while (discountCount < 8) { let p = products[randomInt(0, products.length-1)]; p.originalPrice = p.price + 1000; await p.save(); discountCount++; }

    // 5. ORDERS (30)
    let orders = [];
    const statuses = ["pending", "confirmed", "picked_up", "on_the_way", "delivered", "cancelled"];
    
    for (let i = 0; i < 30; i++) {
      const numItems = randomInt(1, 3);
      const items = [];
      let totalAmount = 0;

      for(let j=0; j<numItems; j++) {
        const prod = randomItem(products);
        const qty = randomInt(1, 3);
        items.push({
          product: prod._id,
          quantity: qty,
          price: prod.price
        });
        totalAmount += prod.price * qty;
      }

      const orderUser = randomItem(users);
      const isPaid = (i < 20); // exactly 20 paid online
      const status = isPaid ? randomItem(statuses) : randomItem(["pending", "confirmed", "cancelled"]);
      
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - randomInt(1, 90));

      const order = await Order.create({
        user: orderUser._id,
        items,
        totalAmount,
        shippingAddress: orderUser.address,
        status,
        paymentMethod: isPaid ? 'Razorpay' : 'COD',
        isPaid,
        paidAt: isPaid ? orderDate : null,
        paymentId: isPaid ? `pay_demo_${randomInt(10000, 99999)}` : null,
        razorpayOrderId: isPaid ? `order_demo_${randomInt(10000, 99999)}` : null,
        createdAt: orderDate,
      });
      orders.push(order);
    }

    // 6. REVIEWS (60)
    for (let i = 0; i < 60; i++) {
      const revDate = new Date();
      revDate.setDate(revDate.getDate() - randomInt(1, 180));
      
      await Review.create({
        user: randomItem(users)._id,
        product: randomItem(products)._id,
        rating: randomInt(1, 5),
        comment: randomItem([
          "Absolutely perfect for my kart setup. Huge improvement in laps.",
          "Good quality but shipping took a while.",
          "Value for money. Definitely buying from this shop again.",
          "Broke after 2 laps, would not recommend for pro racing.",
          "Looks exactly like the picture, fits perfectly."
        ]),
        createdAt: revDate
      });
    }

    // 7. CARTS (5 active carts)
    for (let i = 0; i < 5; i++) {
      const numItems = randomInt(2, 4);
      const items = [];
      for(let j=0; j<numItems; j++) {
        items.push({
          product: randomItem(products)._id,
          quantity: randomInt(1, 2)
        });
      }
      await Cart.create({
        user: users[i]._id,
        items
      });
    }

    console.log('--- SEEDING SUCCESSFUL ---');
    console.log(`Created 1 Admin`);
    console.log(`Created 5 Shopkeepers & Shops`);
    console.log(`Created 10 Users`);
    console.log(`Created ${products.length} Products`);
    console.log(`Created 30 Orders`);
    console.log(`Created 60 Reviews`);
    console.log(`Created 5 Carts`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
