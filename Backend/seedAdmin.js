require("dotenv").config({ path: __dirname + '/.env' });
const mongoose = require("mongoose");
const User = require("./models/User");

// Import connection script or just connect directly
const connectDB = require("./db");

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@driftkart.com" });

    if (adminExists) {
      console.log("Admin user already exists");
      process.exit();
    }

    const adminUser = new User({
      name: "Admin User",
      email: "admin@driftkart.com",
      password: "Admin@123", // Will be hashed by pre-save hook in User model
      role: 'admin',
    });

    await adminUser.save();
    console.log("Admin user successfully created: admin@driftkart.com");
    process.exit();
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    if (error.errors) console.error(error.errors);
    process.exit(1);
  }
};

seedAdmin();
