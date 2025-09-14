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

// CORS Configuration - Allow all Vercel domains and specific origins
const allowedOrigins = [
  "https://greencartfrontend-zeta.vercel.app",
  "https://greencartfrontend-git-clean-main-jignesh-naiks-projects.vercel.app",
  "https://client-b6m8phwr8-jignesh-naiks-projects.vercel.app",
  "https://client-nins504a7-jignesh-naiks-projects.vercel.app",
  "https://client-lc55izmae-jignesh-naiks-projects.vercel.app",
  "https://client-1yftisowa-jignesh-naiks-projects.vercel.app",
  "https://client-bzlk0y5l1-jignesh-naiks-projects.vercel.app",
  "https://client-5qn7fdxo8-jignesh-naiks-projects.vercel.app",
  "https://client-bqfsfffc2-jignesh-naiks-projects.vercel.app",
  "https://server-a3wb74u4l-jignesh-naiks-projects.vercel.app",
  // Add the current frontend URL from the error logs
  "https://greencart-e4ir18b3o-jignesh-naiks-projects.vercel.app",
  // Add localhost for development
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Log the origin for debugging
    console.log("🔍 CORS DEBUG: Request origin:", origin);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log("🔍 CORS DEBUG: No origin, allowing");
      return callback(null, true);
    }

    // Get the hostname from the origin
    try {
      const hostname = new URL(origin).hostname;
      console.log("Request origin:", origin, "hostname:", hostname);

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        console.log("🔍 CORS DEBUG: Origin in allowed list, allowing");
        return callback(null, true);
      }

      // Allow localhost and vercel.app domains
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".vercel.app")
      ) {
        console.log("🔍 CORS DEBUG: Vercel app or localhost, allowing");
        callback(null, true);
      } else {
        console.log("🔍 CORS DEBUG: Origin not allowed:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    } catch (error) {
      console.error("Error parsing origin:", error);
      callback(null, true); // Allow in case of parsing error
    }
  },
  credentials: false, // Changed to false to match frontend configuration
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Enhanced CORS preflight handling
app.options("*", (req, res) => {
  console.log("🔍 CORS DEBUG: Preflight request received");
  console.log("🔍 CORS DEBUG: Origin:", req.headers.origin);
  console.log(
    "🔍 CORS DEBUG: Method:",
    req.headers["access-control-request-method"]
  );
  console.log(
    "🔍 CORS DEBUG: Headers:",
    req.headers["access-control-request-headers"]
  );

  // Set CORS headers
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );
  res.header("Access-Control-Max-Age", "86400");
  res.header("Access-Control-Allow-Credentials", "false");

  res.status(204).end();
});

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log("🔍 REQUEST DEBUG:", {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    userAgent: req.headers["user-agent"],
    timestamp: new Date().toISOString(),
  });

  // Ensure CORS headers are always set for debugging
  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "false");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    );
  }

  next();
});

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
    corsConfig: {
      credentials: corsOptions.credentials,
      methods: corsOptions.methods,
      allowedHeaders: corsOptions.allowedHeaders,
    },
  });
});

// Enhanced CORS debugging endpoint
app.get("/api/cors-debug", (req, res) => {
  const requestInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: {
      origin: req.headers.origin,
      "user-agent": req.headers["user-agent"],
      "access-control-request-method":
        req.headers["access-control-request-method"],
      "access-control-request-headers":
        req.headers["access-control-request-headers"],
    },
    cors: {
      allowedOrigins,
      currentOrigin: req.headers.origin,
      isOriginAllowed: allowedOrigins.includes(req.headers.origin),
      isVercelApp: req.headers.origin?.includes(".vercel.app"),
    },
  };

  console.log("🔍 CORS DEBUG ENDPOINT:", requestInfo);

  res.json(requestInfo);
});

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

// API routes
app.use("/api/user", routeHandler(userRoute));
app.use("/api/seller", routeHandler(sellerRoute));
app.use("/api/product", routeHandler(productRoute));
app.use("/api/cart", routeHandler(cartRoute));
app.use("/api/address", routeHandler(addressRoute));
app.use("/api/order", routeHandler(orderRoute));

export default app;
