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
  origin: "https://drowsiness-detection-web.vercel.app/", // Allow only your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Allow cookies & authentication headers
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://drowsiness-detection-web.vercel.app/");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


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
