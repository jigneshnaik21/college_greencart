import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "../server/db.js";
import { connectCloudinary } from "../server/cloudinary.js";
import userRoute from "../server/routes/userRoute.js";
import sellerRoute from "../server/routes/sellerRoute.js";
import productRoute from "../server/routes/productRoute.js";
import cartRoute from "../server/routes/cartRoute.js";
import addressRoute from "../server/routes/addressRoute.js";
import orderRoute from "../server/routes/orderRoute.js";

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Get the hostname from the origin
    try {
      const hostname = new URL(origin).hostname;
      console.log('Request origin:', origin, 'hostname:', hostname);

      // Allow localhost and vercel.app domains
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    } catch (error) {
      console.error('Error parsing origin:', error);
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
      console.log('Connecting to MongoDB...');
      await connectDB();
      console.log('Connected to MongoDB');

      console.log('Connecting to Cloudinary...');
      await connectCloudinary();
      console.log('Connected to Cloudinary');

      isConnected = true;
      console.log('All services connected successfully');
    }
  } catch (error) {
    console.error('Error connecting to services:', error);
    isConnected = false;
    throw error;
  }
};

// Health check endpoint (no auth required)
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
        cloudinary: isConnected
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });

  // Send error response
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      type: err.name,
      status: err.status || 500,
      path: req.url,
      timestamp: new Date().toISOString()
    }
  });
});

// Wrap route handlers with error handling
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error('Route error:', {
      route: req.path,
      method: req.method,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    next(error);
  }
};

// Routes with connection check and error handling
const routeHandler = (route) => asyncHandler(async (req, res, next) => {
  try {
    await connectServices();
    await route(req, res, next);
  } catch (error) {
    console.error('Route handler error:', {
      route: req.path,
      method: req.method,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    next(error);
  }
});

// API routes
app.use("/api/user", routeHandler(userRoute));
app.use("/api/seller", routeHandler(sellerRoute));
app.use("/api/product", routeHandler(productRoute));
app.use("/api/cart", routeHandler(cartRoute));
app.use("/api/address", routeHandler(addressRoute));
app.use("/api/order", routeHandler(orderRoute));

export default app;