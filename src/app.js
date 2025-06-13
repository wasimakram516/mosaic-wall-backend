const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const wallConfigRoutes = require("./routes/wallConfig");
const displayMediaRoutes = require("./routes/displayMediaRoutes");
const errorHandler = require("./middlewares/errorHandler");
const seedAdmin = require("./seeder/adminSeeder");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://mosaicwall.whitewall.om"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  })
);
app.use(express.json());
app.use(cookieParser());

// Database Connection & Admin Seeder
const initializeApp = async () => {
  try {
    await connectDB();
    await seedAdmin();
  } catch (error) {
    console.error("❌ Error initializing app:", error);
  }
};

initializeApp();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/wall-configs", wallConfigRoutes);
app.use("/api/display-media", displayMediaRoutes);

// Health Check
app.get("/", (req, res) => {
  console.log("📡 Timeline Server is running...");
  res.status(200).send("📡 Timeline Server is running...");
});

// Error Handler
app.use(errorHandler);

module.exports = app;
