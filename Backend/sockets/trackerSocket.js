const jwt = require("jsonwebtoken");
const User = require("../models/User");

const setupTrackerSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select('-password');
      if (!socket.user) return next(new Error("User not found"));
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.user.role} (${socket.user.name})`);

    // Customer joins a room to track their specific order
    socket.on("joinOrderRoom", (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`[Socket] User ${socket.user.name} tracking order_${orderId}`);
    });

    // Shopkeeper joins a room to track their fleet
    socket.on("joinShopTracker", () => {
      if (socket.user.role === 'shopkeeper') {
        socket.join(`shop_${socket.user.shopId || socket.user._id}`);
        console.log(`[Socket] Shopkeeper tracking their fleet`);
      }
    });

    // Admin joins global tracking
    socket.on("joinAdminTracker", () => {
      if (socket.user.role === 'admin') {
        socket.join("admin_tracker");
        console.log(`[Socket] Admin tracking all fleets`);
      }
    });

    // Delivery agent broadcasts their location
    socket.on("agentLocationUpdate", async (data) => {
      const { lat, lng, orderId, shopId } = data;
      
      if (socket.user.role === 'agent') {
        // Save to DB optionally (rate limit this to avoid DB stress in real-world)
        // Here we just broadcast to the relevant rooms directly
        const locationData = {
          lat, lng, 
          agentId: socket.user._id, 
          agentName: socket.user.name,
          orderId,
          timestamp: new Date()
        };

        // Emit to the customer waiting for this order
        if (orderId) io.to(`order_${orderId}`).emit("locationUpdate", locationData);

        // Emit to the shopkeeper
        if (shopId) io.to(`shop_${shopId}`).emit("locationUpdate", locationData);

        // Emit to global admins
        io.to("admin_tracker").emit("locationUpdate", locationData);
        
        // Update user state in DB occasionally
        process.nextTick(async () => {
          await User.findByIdAndUpdate(socket.user._id, { currentLocation: { lat, lng, timestamp: new Date() }});
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = setupTrackerSocket;
