import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRoute from "./routes/userRoute.js";
import sellerRoute from "./routes/sellerRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import addressRoute from "./routes/addressRoute.js";
import orderRoute from "./routes/orderRoute.js";

// Import models to ensure they are registered
import "./models/User.js";
import "./models/Product.js";
import "./models/Order.js";
import "./models/Address.js";

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration - explicit frontend origins, Authorization header allowed
const allowedOrigins = [
  "https://greencartfrontend-zeta.vercel.app",
  "https://greencartfrontend-git-clean-main-jignesh-naiks-projects.vercel.app",
  "https://client-b6m8phwr8-jignesh-naiks-projects.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    try {
      const hostname = new URL(origin).hostname;
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (hostname.endsWith(".vercel.app")) return callback(null, true);
      // Allow localhost during dev
      if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) return callback(null, true);
      return callback(null, false);
    } catch (e) {
      return callback(null, false);
    }
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  optionsSuccessStatus: 204,
  preflightContinue: false,
  maxAge: 86400,
};

// Apply CORS before other middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Remove permissive fallback CORS headers and cookie-centric settings

// Parse cookies (kept for non-auth features)
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());

// Database connection state
let isConnected = false;

// Connect to services (database and Cloudinary)
const connectServices = async () => {
  try {
    if (!isConnected) {
      console.log("Connecting to MongoDB...");
      await connectDB();
      console.log("Connected to MongoDB");

      console.log("Connecting to Cloudinary...");
      await connectCloudinary();
      console.log("Connected to Cloudinary");

      isConnected = true;
      console.log("All services connected successfully");
    }
  } catch (error) {
    console.error("Error connecting to services:", error);
    isConnected = false;
    console.log("Services connection failed, but continuing...");
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      type: err.name,
      status: err.status || 500,
      path: req.url,
      timestamp: new Date().toISOString(),
    },
  });
});

// Wrap route handlers with error handling
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error("Route error:", {
      route: req.path,
      method: req.method,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    next(error);
  }
};

// Routes with connection check and error handling
const routeHandler = (route) =>
  asyncHandler(async (req, res, next) => {
    try {
      await connectServices();
      await route(req, res, next);
    } catch (error) {
      console.error("Route handler error:", {
        route: req.path,
        method: req.method,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      next(error);
    }
  });

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await connectServices();
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      dbConnected: isConnected,
      services: {
        mongodb: isConnected,
        cloudinary: isConnected,
      },
      cors: {
        origins: allowedOrigins,
        nodeEnv: process.env.NODE_ENV,
        requestOrigin: req.headers.origin,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error.message,
      dbConnected: isConnected,
    });
  }
});

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  res.json({
    message: "CORS is working!",
    timestamp: new Date().toISOString(),
    requestOrigin: req.headers.origin,
    allowedOrigins,
  });
});

// API routes
app.use("/api/user", routeHandler(userRoute));
app.use("/api/seller", routeHandler(sellerRoute));
app.use("/api/product", routeHandler(productRoute));
app.use("/api/cart", routeHandler(cartRoute));
app.use("/api/address", routeHandler(addressRoute));
app.use("/api/order", routeHandler(orderRoute));

// Direct test endpoint
app.get("/api/test/products", async (req, res) => {
  try {
    await connectServices();
    const Product = (await import("./models/Product.js")).default;
    const products = await Product.find({});
    res.json({ success: true, data: products });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.json({ success: false, message: error.message });
  }
});

// Start server only in development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
export default app;
