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

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Get the hostname from the origin
    try {
      const hostname = new URL(origin).hostname;
      console.log("Request origin:", origin, "hostname:", hostname);

      // Get allowed origins from environment variable
      const allowedOrigins = process.env.CORS_ORIGINS 
        ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
        : [];

      // Allow localhost, vercel.app domains, and custom domains
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".vercel.app") ||
        allowedOrigins.includes(origin) ||
        // Add your custom domain here if you have one
        hostname === "your-custom-domain.com"
      ) {
        callback(null, true);
      } else {
        // For production, you might want to be more restrictive
        if (process.env.NODE_ENV === "production") {
          console.log("CORS blocked origin:", origin);
          callback(new Error("Not allowed by CORS"));
        } else {
          callback(null, true); // Allow in development
        }
      }
    } catch (error) {
      console.error("Error parsing origin:", error);
      callback(null, true); // Allow in case of parsing error
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Parse cookies
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
    throw error;
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

  // Send error response
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
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
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
