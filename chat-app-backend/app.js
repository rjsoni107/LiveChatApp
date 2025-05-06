const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const { MONGO_SERVER, DB_NAME, FRONTEND_URL } = process.env;

// Middleware
app.use(cors({ origin: FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Chat server running");
});

// MongoDB Connection
mongoose.connect(`${MONGO_SERVER}${DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log("MongoDB connection error:", err));

module.exports = app;