const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const connectDB = async () => {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`Connecting to MongoDB (Attempt ${attempt}/${maxRetries})...`);
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected Successfully");
      break;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt >= maxRetries) {
        console.error("==================================================");
        console.error("CRITICAL ERROR: MongoDB Connection Failed after maximum retries!");
        console.error("Error details:", error.message);
        console.error("Stopping server process now...");
        console.error("==================================================");
        process.exit(1);
      }
      console.log("Waiting 1 second before retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  try {
    const adminEmail = "vishnuvardhan9376@gmail.com";
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      console.log(`Seeding default admin user (${adminEmail})...`);
      await Admin.create({
        email: adminEmail,
        password: "68xphr28Hz"
      });
      console.log("Admin user seeded successfully.");
    }
  } catch (error) {
    console.error("==================================================");
    console.error("CRITICAL ERROR: Admin Seeding Failed!");
    console.error("Error details:", error.message);
    console.error("Stopping server process now...");
    console.error("==================================================");
    process.exit(1);
  }
};

module.exports = connectDB;
