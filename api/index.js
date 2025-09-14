import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./configs/db.js";
import { connectCloudinary } from "./configs/cloudinary.js";

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
  "https://greencart-pbnjdyp86-jignesh-naiks-projects.vercel.app",
  "https://greencart-nkuj9fc96-jignesh-naiks-projects.vercel.app",
  "https://greencart-edj759srf-jignesh-naiks-projects.vercel.app",
  "https://greencart-6flbdbwqy-jignesh-naiks-projects.vercel.app",
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

      // Check if the origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        console.log("🔍 CORS DEBUG: Origin allowed:", origin);
        return callback(null, true);
      }

      // Check if it's a Vercel domain
      if (hostname.includes("vercel.app")) {
        console.log("🔍 CORS DEBUG: Vercel domain allowed:", origin);
        return callback(null, true);
      }

      console.log("🔍 CORS DEBUG: Origin not allowed:", origin);
      return callback(new Error("Not allowed by CORS"));
    } catch (error) {
      console.log("🔍 CORS DEBUG: Error parsing origin:", error.message);
      return callback(new Error("Invalid origin"));
    }
  },
  credentials: false, // Set to false to match frontend configuration
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Initialize database and cloudinary connections
let dbConnected = false;
let cloudinaryConnected = false;

const initializeConnections = async () => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
      console.log("✅ Database connected successfully");
    }
    if (!cloudinaryConnected) {
      await connectCloudinary();
      cloudinaryConnected = true;
      console.log("✅ Cloudinary connected successfully");
    }
  } catch (error) {
    console.error("❌ Connection error:", error.message);
  }
};

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await initializeConnections();
    res.status(200).json({
      status: "success",
      message: "Server is running",
      timestamp: new Date().toISOString(),
      database: dbConnected ? "connected" : "disconnected",
      cloudinary: cloudinaryConnected ? "connected" : "disconnected"
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
});

// Basic product list endpoint (simplified)
app.get("/api/product/list", async (req, res) => {
  try {
    await initializeConnections();
    
    // Sample products for demonstration
    const sampleProducts = [
      {
        _id: "1",
        name: "Fresh Organic Tomatoes",
        price: 2.99,
        originalPrice: 3.99,
        image: "https://images.unsplash.com/photo-1546470429-70c9b4a7de98?w=300&h=300&fit=crop",
        category: "Organic veggies",
        rating: 4.5,
        reviews: 120,
        inStock: true,
        description: "Fresh, organic tomatoes perfect for salads and cooking"
      },
      {
        _id: "2",
        name: "Sweet Red Apples",
        price: 1.99,
        originalPrice: 2.49,
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
        category: "Fresh Fruits",
        rating: 4.8,
        reviews: 95,
        inStock: true,
        description: "Crisp and sweet red apples, perfect for snacking"
      },
      {
        _id: "3",
        name: "Fresh Carrots",
        price: 1.49,
        originalPrice: 1.99,
        image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop",
        category: "Organic veggies",
        rating: 4.3,
        reviews: 87,
        inStock: true,
        description: "Fresh, crunchy carrots rich in vitamins"
      },
      {
        _id: "4",
        name: "Banana Bunch",
        price: 2.49,
        originalPrice: 2.99,
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop",
        category: "Fresh Fruits",
        rating: 4.6,
        reviews: 156,
        inStock: true,
        description: "Ripe bananas perfect for breakfast or smoothies"
      },
      {
        _id: "5",
        name: "Fresh Spinach",
        price: 1.99,
        originalPrice: 2.49,
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop",
        category: "Organic veggies",
        rating: 4.4,
        reviews: 73,
        inStock: true,
        description: "Fresh, leafy spinach packed with nutrients"
      },
      {
        _id: "6",
        name: "Orange Juice",
        price: 3.99,
        originalPrice: 4.99,
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop",
        category: "Cold Drinks",
        rating: 4.2,
        reviews: 45,
        inStock: true,
        description: "Freshly squeezed orange juice, no added sugar"
      }
    ];
    
    res.status(200).json({
      status: "success",
      data: sampleProducts,
      message: "Products loaded successfully"
    });
  } catch (error) {
    console.error("Product list error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
      error: error.message
    });
  }
});

// Basic user auth endpoint (simplified)
app.get("/api/user/is-auth", async (req, res) => {
  try {
    await initializeConnections();
    
    // Check for token in Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : req.cookies.token;
    
    if (!token) {
      return res.status(200).json({
        success: true,
        isAuth: false,
        user: null,
        message: "No token provided"
      });
    }
    
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      res.status(200).json({
        success: true,
        isAuth: true,
        user: {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email
        },
        message: "User authenticated"
      });
    } catch (jwtError) {
      res.status(200).json({
        success: true,
        isAuth: false,
        user: null,
        message: "Invalid token"
      });
    }
  } catch (error) {
    console.error("User auth error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to check authentication",
      error: error.message
    });
  }
});

// Basic seller auth endpoint (simplified)
app.get("/api/seller/is-auth", async (req, res) => {
  try {
    await initializeConnections();
    
    // For now, return not authenticated
    res.status(200).json({
      status: "success",
      data: {
        isAuth: false,
        seller: null
      },
      message: "Seller auth endpoint working"
    });
  } catch (error) {
    console.error("Seller auth error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to check seller authentication",
      error: error.message
    });
  }
});

// User login endpoint
app.post("/api/user/login", async (req, res) => {
  try {
    await initializeConnections();
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required"
      });
    }
    
    // Mock authentication - in real app, validate against database
    // For demo purposes, accept any email/password combination
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        userId: 'demo-user-123', 
        email: email,
        name: email.split('@')[0] // Use email prefix as name
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: 'demo-user-123',
        name: email.split('@')[0],
        email: email
      },
      token: token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process login",
      error: error.message
    });
  }
});

// User register endpoint
app.post("/api/user/register", async (req, res) => {
  try {
    await initializeConnections();
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email and password are required"
      });
    }
    
    // Mock registration - in real app, create user in database
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        userId: 'demo-user-123', 
        email: email,
        name: name
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: { 
        id: 'demo-user-123',
        name: name,
        email: email 
      },
      token: token
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process registration",
      error: error.message
    });
  }
});

// User logout endpoint
app.get("/api/user/logout", async (req, res) => {
  try {
    await initializeConnections();
    
    // For now, return a mock response
    res.status(200).json({
      status: "success",
      data: {
        message: "Logout endpoint working"
      }
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process logout",
      error: error.message
    });
  }
});

// Catch-all handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
  });
});

// Export the app for Vercel
export default app;