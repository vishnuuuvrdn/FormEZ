const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("==================================================");
    console.error("CRITICAL ERROR: MongoDB Connection Failed!");
    console.error("Error details:", error.message);
    console.error("Stopping server process now...");
    console.error("==================================================");
    process.exit(1);
  }
};

module.exports = connectDB;
