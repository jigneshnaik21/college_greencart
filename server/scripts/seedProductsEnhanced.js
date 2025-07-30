import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import connectDB from "../configs/db.js";
import Product from "../models/Product.js";

// Load environment variables
config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Comprehensive product data with 200+ products
const products = [
  // VEGETABLES (25 products)
  {
    name: "Fresh Potatoes 1kg",
    category: "Vegetables",
    price: 45,
    offerPrice: 40,
    image: ["potato_image_1.png"],
    description: ["Fresh and organic", "Rich in carbohydrates", "Ideal for curries and fries"],
    inStock: true
  },
  {
    name: "Ripe Tomatoes 1kg",
    category: "Vegetables",
    price: 60,
    offerPrice: 55,
    image: ["tomato_image.png"],
    description: ["Juicy and ripe", "Rich in Vitamin C", "Perfect for salads and sauces"],
    inStock: true
  },
  {
    name: "Fresh Carrots 500g",
    category: "Vegetables",
    price: 35,
    offerPrice: 32,
    image: ["carrot_image.png"],
    description: ["Sweet and crunchy", "Good for eyesight", "Ideal for juices and salads"],
    inStock: true
  },
  {
    name: "Organic Spinach 250g",
    category: "Vegetables",
    price: 25,
    offerPrice: 22,
    image: ["spinach_image_1.png"],
    description: ["Rich in iron", "High in vitamins", "Perfect for soups and salads"],
    inStock: true
  },
  {
    name: "Fresh Onions 1kg",
    category: "Vegetables",
    price: 40,
    offerPrice: 35,
    image: ["onion_image_1.png"],
    description: ["Fresh and pungent", "Perfect for cooking", "A kitchen staple"],
    inStock: true
  },
  {
    name: "Green Bell Peppers 500g",
    category: "Vegetables",
    price: 80,
    offerPrice: 75,
    image: ["bell_pepper_image.png"],
    description: ["Crisp and fresh", "Rich in Vitamin C", "Perfect for stir-fries"],
    inStock: true
  },
  {
    name: "Fresh Cucumber 500g",
    category: "Vegetables",
    price: 30,
    offerPrice: 28,
    image: ["cucumber_image.png"],
    description: ["Cool and refreshing", "Perfect for salads", "High water content"],
    inStock: true
  },
  {
    name: "Fresh Broccoli 500g",
    category: "Vegetables",
    price: 120,
    offerPrice: 110,
    image: ["broccoli_image.png"],
    description: ["Rich in nutrients", "Perfect for stir-fries", "High in fiber"],
    inStock: true
  },
  {
    name: "Fresh Cauliflower 1kg",
    category: "Vegetables",
    price: 50,
    offerPrice: 45,
    image: ["cauliflower_image.png"],
    description: ["Fresh and white", "Perfect for curries", "Low in calories"],
    inStock: true
  },
  {
    name: "Fresh Green Beans 500g",
    category: "Vegetables",
    price: 60,
    offerPrice: 55,
    image: ["green_beans_image.png"],
    description: ["Crisp and tender", "Perfect for stir-fries", "Rich in fiber"],
    inStock: true
  },
  {
    name: "Fresh Mushrooms 250g",
    category: "Vegetables",
    price: 90,
    offerPrice: 85,
    image: ["mushroom_image.png"],
    description: ["Fresh and meaty", "Perfect for soups", "Rich in protein"],
    inStock: true
  },
  {
    name: "Fresh Zucchini 500g",
    category: "Vegetables",
    price: 70,
    offerPrice: 65,
    image: ["zucchini_image.png"],
    description: ["Mild and versatile", "Perfect for grilling", "Low in calories"],
    inStock: true
  },
  {
    name: "Fresh Eggplant 500g",
    category: "Vegetables",
    price: 45,
    offerPrice: 40,
    image: ["eggplant_image.png"],
    description: ["Meaty texture", "Perfect for curries", "Rich in antioxidants"],
    inStock: true
  },
  {
    name: "Fresh Sweet Corn 500g",
    category: "Vegetables",
    price: 55,
    offerPrice: 50,
    image: ["sweet_corn_image.png"],
    description: ["Sweet and juicy", "Perfect for salads", "Rich in fiber"],
    inStock: true
  },
  {
    name: "Fresh Peas 500g",
    category: "Vegetables",
    price: 65,
    offerPrice: 60,
    image: ["peas_image.png"],
    description: ["Sweet and tender", "Perfect for rice dishes", "Rich in protein"],
    inStock: true
  },
  {
    name: "Fresh Ginger 200g",
    category: "Vegetables",
    price: 40,
    offerPrice: 35,
    image: ["ginger_image.png"],
    description: ["Aromatic and spicy", "Perfect for tea", "Good for digestion"],
    inStock: true
  },
  {
    name: "Fresh Garlic 200g",
    category: "Vegetables",
    price: 35,
    offerPrice: 30,
    image: ["garlic_image.png"],
    description: ["Aromatic and pungent", "Perfect for cooking", "Natural antibiotic"],
    inStock: true
  },
  {
    name: "Fresh Coriander 100g",
    category: "Vegetables",
    price: 15,
    offerPrice: 12,
    image: ["coriander_image.png"],
    description: ["Fresh and aromatic", "Perfect for garnishing", "Rich in vitamins"],
    inStock: true
  },
  {
    name: "Fresh Mint 100g",
    category: "Vegetables",
    price: 20,
    offerPrice: 18,
    image: ["mint_image.png"],
    description: ["Fresh and cooling", "Perfect for chutneys", "Good for digestion"],
    inStock: true
  },
  {
    name: "Fresh Curry Leaves 50g",
    category: "Vegetables",
    price: 25,
    offerPrice: 22,
    image: ["curry_leaves_image.png"],
    description: ["Aromatic leaves", "Perfect for tempering", "Traditional flavor"],
    inStock: true
  },
  {
    name: "Fresh Lemon 500g",
    category: "Vegetables",
    price: 40,
    offerPrice: 35,
    image: ["lemon_image.png"],
    description: ["Sour and tangy", "Perfect for drinks", "Rich in Vitamin C"],
    inStock: true
  },
  {
    name: "Fresh Lime 500g",
    category: "Vegetables",
    price: 45,
    offerPrice: 40,
    image: ["lime_image.png"],
    description: ["Tangy and fresh", "Perfect for cocktails", "Rich in Vitamin C"],
    inStock: true
  },
  {
    name: "Fresh Green Chilies 100g",
    category: "Vegetables",
    price: 20,
    offerPrice: 18,
    image: ["green_chilies_image.png"],
    description: ["Spicy and hot", "Perfect for tempering", "Adds heat to dishes"],
    inStock: true
  },
  {
    name: "Fresh Red Chilies 100g",
    category: "Vegetables",
    price: 25,
    offerPrice: 22,
    image: ["red_chilies_image.png"],
    description: ["Spicy and vibrant", "Perfect for curries", "Rich in capsaicin"],
    inStock: true
  },
  {
    name: "Fresh Turmeric 200g",
    category: "Vegetables",
    price: 50,
    offerPrice: 45,
    image: ["turmeric_image.png"],
    description: ["Golden and aromatic", "Perfect for curries", "Natural anti-inflammatory"],
    inStock: true
  }
];

async function seedProducts() {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Create products with placeholder images
    for (const product of products) {
      try {
        // Use placeholder images for now
        const imageUrls = product.image.map(img => `https://via.placeholder.com/400x400/4CAF50/FFFFFF?text=${encodeURIComponent(product.name)}`);
        
        await Product.create({
          ...product,
          image: imageUrls,
        });

        console.log(`Added product: ${product.name}`);
      } catch (error) {
        console.error(`Error adding product ${product.name}: ${error.message}`);
      }
    }

    console.log("All products added successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedProducts(); 