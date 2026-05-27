require("dotenv").config();

const mongoose = require("mongoose");
const path = require("path");

const connectDB = require("../config/db");
const Document = require("../models/Document");

const documents = require("../data/documents.json");

const seedData = async () => {
    try {
        await connectDB();

        console.log("Connected to MongoDB");

        await Document.deleteMany();

        console.log("Old documents removed");

        await Document.insertMany(documents);

        console.log("Seed data inserted successfully");

        process.exit();
    } catch (error) {
        console.error("Seed Error:", error.message);

        process.exit(1);
    }
};

seedData();