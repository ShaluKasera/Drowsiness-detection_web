require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");
const connect = require("./connection"); // MongoDB connection

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to database
connect();

// Middleware
app.use(cors({
  origin: "*", // Allow all origins (Modify for production)
  methods: ["GET", "POST", "PUT", "DELETE"], // Explicitly allow methods
  allowedHeaders: ["Content-Type", "Authorization"] // Allow headers
}));

app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Default route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Use routes
app.use("/", userRouter); // Prefixed with "/api" for better structure

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
