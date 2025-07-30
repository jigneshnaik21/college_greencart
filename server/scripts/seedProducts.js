import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import connectDB from "../configs/db.js";
import Product from "../models/Product.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Load environment variables
config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product data
const products = [
  // Vegetables
  {
    name: "Potato 500g",
    category: "Vegetables",
    price: 25,
    offerPrice: 20,
    image: [
      "potato_image_1.png",
      "potato_image_2.png",
      "potato_image_3.png",
      "potato_image_4.png",
    ],
    description: [
      "Fresh and organic",
      "Rich in carbohydrates",
      "Ideal for curries and fries",
    ],
  },
  {
    name: "Tomato 1 kg",
    category: "Vegetables",
    price: 40,
    offerPrice: 35,
    image: ["tomato_image.png"],
    description: [
      "Juicy and ripe",
      "Rich in Vitamin C",
      "Perfect for salads and sauces",
      "Farm fresh quality",
    ],
  },
  {
    name: "Carrot 500g",
    category: "Vegetables",
    price: 30,
    offerPrice: 28,
    image: ["carrot_image.png"],
    description: [
      "Sweet and crunchy",
      "Good for eyesight",
      "Ideal for juices and salads",
    ],
  },
  {
    name: "Spinach 500g",
    category: "Vegetables",
    price: 18,
    offerPrice: 15,
    image: ["spinach_image_1.png"],
    description: [
      "Rich in iron",
      "High in vitamins",
      "Perfect for soups and salads",
    ],
  },
  {
    name: "Onion 500g",
    category: "Vegetables",
    price: 22,
    offerPrice: 19,
    image: ["onion_image_1.png"],
    description: [
      "Fresh and pungent",
      "Perfect for cooking",
      "A kitchen staple",
    ],
  },
  // Fruits
  {
    name: "Apple 1 kg",
    category: "Fruits",
    price: 120,
    offerPrice: 110,
    image: ["apple_image.png"],
    description: [
      "Crisp and juicy",
      "Rich in fiber",
      "Boosts immunity",
      "Perfect for snacking and desserts",
      "Organic and farm fresh",
    ],
  },
  {
    name: "Orange 1 kg",
    category: "Fruits",
    price: 80,
    offerPrice: 75,
    image: ["orange_image.png"],
    description: [
      "Juicy and sweet",
      "Rich in Vitamin C",
      "Perfect for juices and salads",
    ],
  },
  {
    name: "Banana 1 kg",
    category: "Fruits",
    price: 50,
    offerPrice: 45,
    image: ["banana_image_1.png"],
    description: [
      "Sweet and ripe",
      "High in potassium",
      "Great for smoothies and snacking",
    ],
  },
  {
    name: "Mango 1 kg",
    category: "Fruits",
    price: 150,
    offerPrice: 140,
    image: ["mango_image_1.png"],
    description: [
      "Sweet and flavorful",
      "Perfect for smoothies and desserts",
      "Rich in Vitamin A",
    ],
  },
  {
    name: "Grapes 500g",
    category: "Fruits",
    price: 70,
    offerPrice: 65,
    image: ["grapes_image_1.png"],
    description: [
      "Fresh and juicy",
      "Rich in antioxidants",
      "Perfect for snacking and fruit salads",
    ],
  },
  // Add more products for each category...

  // Dairy Products
  {
    name: "Amul Milk 1L",
    category: "Dairy",
    price: 60,
    offerPrice: 55,
    image: ["amul_milk_image.png"],
    description: [
      "Pure and fresh",
      "Rich in calcium",
      "Ideal for tea, coffee, and desserts",
      "Trusted brand quality",
    ],
  },
  {
    name: "Paneer 200g",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["paneer_image.png"],
    description: [
      "Soft and fresh",
      "Rich in protein",
      "Ideal for curries and snacks",
    ],
  },
  {
    name: "Cheese 200g",
    category: "Dairy",
    price: 140,
    offerPrice: 130,
    image: ["cheese_image.png"],
    description: [
      "Creamy and delicious",
      "Perfect for pizzas and sandwiches",
      "Rich in calcium",
    ],
  },
  {
    name: "Eggs 12 pcs",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["eggs_image.png"],
    description: [
      "Farm fresh",
      "Rich in protein",
      "Ideal for breakfast and baking",
    ],
  },

  // Cold Drinks
  {
    name: "Coca-Cola 1.5L",
    category: "Drinks",
    price: 80,
    offerPrice: 75,
    image: ["coca_cola_image.png"],
    description: [
      "Refreshing and fizzy",
      "Perfect for parties",
      "Best served chilled",
    ],
  },
  {
    name: "Pepsi 1.5L",
    category: "Drinks",
    price: 78,
    offerPrice: 73,
    image: ["pepsi_image.png"],
    description: [
      "Chilled and refreshing",
      "Perfect for celebrations",
      "Best served cold",
    ],
  },
  {
    name: "Sprite 1.5L",
    category: "Drinks",
    price: 79,
    offerPrice: 74,
    image: ["sprite_image_1.png"],
    description: [
      "Refreshing citrus taste",
      "Perfect for hot days",
      "Best served chilled",
    ],
  },
  {
    name: "Fanta 1.5L",
    category: "Drinks",
    price: 77,
    offerPrice: 72,
    image: ["fanta_image_1.png"],
    description: ["Sweet and fizzy", "Great for parties", "Best served cold"],
  },

  // Instant Food
  {
    name: "Maggi Noodles 280g",
    category: "Instant",
    price: 55,
    offerPrice: 50,
    image: ["maggi_image.png"],
    description: ["Ready in 2 minutes", "Perfect quick meal", "Kids favorite"],
  },
  {
    name: "Top Ramen 270g",
    category: "Instant",
    price: 45,
    offerPrice: 40,
    image: ["top_ramen_image.png"],
    description: ["Quick and easy", "Spicy and flavorful", "Student's choice"],
  },
  {
    name: "Knorr Soup 70g",
    category: "Instant",
    price: 35,
    offerPrice: 30,
    image: ["knorr_soup_image.png"],
    description: [
      "Ready-to-cook",
      "Healthy and tasty",
      "Perfect for cold weather",
    ],
  },
  {
    name: "Yippee Noodles 260g",
    category: "Instant",
    price: 50,
    offerPrice: 45,
    image: ["yippee_image.png"],
    description: ["Quick to prepare", "Tasty and filling", "Great for snacks"],
  },

  // Bakery Products
  {
    name: "Brown Bread 400g",
    category: "Bakery",
    price: 40,
    offerPrice: 35,
    image: ["brown_bread_image.png"],
    description: ["Fresh daily", "Whole wheat", "High in fiber"],
  },
  {
    name: "Butter Croissant 100g",
    category: "Bakery",
    price: 50,
    offerPrice: 45,
    image: ["butter_croissant_image.png"],
    description: ["Flaky and buttery", "Freshly baked", "Perfect breakfast"],
  },
  {
    name: "Chocolate Cake 500g",
    category: "Bakery",
    price: 350,
    offerPrice: 325,
    image: ["chocolate_cake_image.png"],
    description: [
      "Rich and moist",
      "Premium cocoa",
      "Perfect for celebrations",
    ],
  },
  {
    name: "Vanilla Muffins 6pcs",
    category: "Bakery",
    price: 100,
    offerPrice: 90,
    image: ["vanilla_muffins_image.png"],
    description: ["Soft and fluffy", "Real vanilla", "Great with coffee"],
  },

  // Grains & Cereals
  {
    name: "Basmati Rice 5kg",
    category: "Grains",
    price: 550,
    offerPrice: 520,
    image: ["basmati_rice_image.png"],
    description: ["Premium quality", "Long grain", "Aromatic"],
  },
  {
    name: "Wheat Flour 5kg",
    category: "Grains",
    price: 250,
    offerPrice: 230,
    image: ["wheat_flour_image.png"],
    description: ["Stone ground", "100% whole wheat", "Perfect for rotis"],
  },
  {
    name: "Quinoa 500g",
    category: "Grains",
    price: 450,
    offerPrice: 420,
    image: ["quinoa_image.png"],
    description: ["Organic", "High protein", "Gluten-free"],
  },
  {
    name: "Brown Rice 1kg",
    category: "Grains",
    price: 120,
    offerPrice: 110,
    image: ["brown_rice_image.png"],
    description: ["Whole grain", "High fiber", "Nutritious choice"],
  },
];

async function uploadImageToCloudinary(imageName) {
  try {
    const imagePath = path.join(
      __dirname,
      "../../client/src/assets/",
      imageName
    );
    const result = await cloudinary.uploader.upload(imagePath, {
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading image ${imageName}: ${error.message}`);
    return null;
  }
}

async function seedProducts() {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Process each product
    for (const product of products) {
      try {
        // Upload images to Cloudinary
        const imageUrls = await Promise.all(
          product.image.map((img) => uploadImageToCloudinary(img))
        );

        // Filter out any failed uploads
        const validImageUrls = imageUrls.filter((url) => url !== null);

        if (validImageUrls.length === 0) {
          console.error(
            `Skipping product ${product.name} due to failed image uploads`
          );
          continue;
        }

        // Create product with Cloudinary URLs
        await Product.create({
          ...product,
          image: validImageUrls,
          inStock: true,
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
