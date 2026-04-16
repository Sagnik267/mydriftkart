const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const connectDB = require("./db");
const Product = require("./models/Product");

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const agentRoutes = require("./routes/agentRoutes");
const publicShopRoutes = require("./routes/publicShopRoutes");
const storeRoutes = require("./routes/storeRoutes");

// ✅ Auth Middleware
const { protect, protectAdmin, protectShopkeeper, protectAgent } = require("./middleware/auth");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// Global Logger
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", protect, protectAdmin, adminRoutes);
app.use("/api/shop", protect, protectShopkeeper, shopRoutes);
app.use("/api/shops", protect, publicShopRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/agent", protect, protectAgent, agentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/user", userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// Note: Removed the old test app.get("/products") since it's now handled by productRoutes



const http = require("http");
const { Server } = require("socket.io");
const setupTrackerSocket = require("./sockets/trackerSocket");

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for dev
    methods: ["GET", "POST"]
  }
});

setupTrackerSocket(io);

// ✅ Start server
server.listen(5000, () => {
  console.log("Server running on port 5000 with WebSockets");
});