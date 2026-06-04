const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const documentRoutes = require("./routes/documentRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: "https://formez.pages.dev",
  credentials : true  
}));
app.use(express.json());

app.use("/api/documents", documentRoutes);
app.use("/api/auth", authRoutes);

app.get("/api", (req, res) => {
  res.send("FormEZ Backend API is running successfully");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
