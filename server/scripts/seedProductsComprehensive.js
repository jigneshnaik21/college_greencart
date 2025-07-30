import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import connectDB from "../configs/db.js";
import Product from "../models/Product.js";
import { productsData } from "../data/productsData.js";
import { additionalProductsData } from "../data/additionalProducts.js";
import { grainsProductsData } from "../data/grainsProducts.js";

// Load environment variables
config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Additional product data for other categories
const additionalProducts = [
  // DAIRY PRODUCTS (25 products)
  {
    name: "Amul Milk 1L",
    category: "Dairy",
    price: 60,
    offerPrice: 55,
    description: ["Pure and fresh", "Rich in calcium", "Ideal for tea, coffee, and desserts"],
    inStock: true
  },
  {
    name: "Fresh Paneer 200g",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    description: ["Soft and fresh", "Rich in protein", "Ideal for curries and snacks"],
    inStock: true
  },
  {
    name: "Cheddar Cheese 200g",
    category: "Dairy",
    price: 140,
    offerPrice: 130,
    description: ["Creamy and delicious", "Perfect for pizzas and sandwiches", "Rich in calcium"],
    inStock: true
  },
  {
    name: "Fresh Eggs 12 pcs",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    description: ["Farm fresh", "Rich in protein", "Ideal for breakfast and baking"],
    inStock: true
  },
  {
    name: "Greek Yogurt 500g",
    category: "Dairy",
    price: 120,
    offerPrice: 110,
    description: ["Creamy and thick", "High in protein", "Perfect for smoothies"],
    inStock: true
  },
  {
    name: "Butter 250g",
    category: "Dairy",
    price: 80,
    offerPrice: 75,
    description: ["Rich and creamy", "Perfect for cooking", "Natural flavor"],
    inStock: true
  },
  {
    name: "Cream 200ml",
    category: "Dairy",
    price: 60,
    offerPrice: 55,
    description: ["Rich and thick", "Perfect for desserts", "Whipping cream"],
    inStock: true
  },
  {
    name: "Cottage Cheese 200g",
    category: "Dairy",
    price: 70,
    offerPrice: 65,
    description: ["Fresh and soft", "High in protein", "Perfect for salads"],
    inStock: true
  },
  {
    name: "Mozzarella Cheese 200g",
    category: "Dairy",
    price: 150,
    offerPrice: 140,
    description: ["Mild and stretchy", "Perfect for pizzas", "Melts beautifully"],
    inStock: true
  },
  {
    name: "Cream Cheese 200g",
    category: "Dairy",
    price: 100,
    offerPrice: 90,
    description: ["Smooth and creamy", "Perfect for spreads", "Rich flavor"],
    inStock: true
  },
  {
    name: "Sour Cream 200g",
    category: "Dairy",
    price: 80,
    offerPrice: 75,
    description: ["Tangy and creamy", "Perfect for dips", "Rich texture"],
    inStock: true
  },
  {
    name: "Condensed Milk 400g",
    category: "Dairy",
    price: 70,
    offerPrice: 65,
    description: ["Sweet and thick", "Perfect for desserts", "Long shelf life"],
    inStock: true
  },
  {
    name: "Evaporated Milk 400g",
    category: "Dairy",
    price: 60,
    offerPrice: 55,
    description: ["Rich and creamy", "Perfect for cooking", "Concentrated flavor"],
    inStock: true
  },
  {
    name: "Whipping Cream 200ml",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    description: ["Light and fluffy", "Perfect for desserts", "Easy to whip"],
    inStock: true
  },
  {
    name: "Ricotta Cheese 200g",
    category: "Dairy",
    price: 110,
    offerPrice: 100,
    description: ["Smooth and mild", "Perfect for lasagna", "Italian favorite"],
    inStock: true
  },
  {
    name: "Feta Cheese 200g",
    category: "Dairy",
    price: 160,
    offerPrice: 150,
    description: ["Salty and crumbly", "Perfect for salads", "Mediterranean flavor"],
    inStock: true
  },
  {
    name: "Parmesan Cheese 100g",
    category: "Dairy",
    price: 200,
    offerPrice: 190,
    description: ["Sharp and nutty", "Perfect for pasta", "Aged flavor"],
    inStock: true
  },
  {
    name: "Blue Cheese 100g",
    category: "Dairy",
    price: 180,
    offerPrice: 170,
    description: ["Strong and tangy", "Perfect for salads", "Bold flavor"],
    inStock: true
  },
  {
    name: "Goat Cheese 150g",
    category: "Dairy",
    price: 140,
    offerPrice: 130,
    description: ["Creamy and tangy", "Perfect for spreads", "Unique flavor"],
    inStock: true
  },
  {
    name: "Brie Cheese 200g",
    category: "Dairy",
    price: 220,
    offerPrice: 210,
    description: ["Soft and creamy", "Perfect for appetizers", "French classic"],
    inStock: true
  },
  {
    name: "Gouda Cheese 200g",
    category: "Dairy",
    price: 160,
    offerPrice: 150,
    description: ["Smooth and mild", "Perfect for sandwiches", "Dutch favorite"],
    inStock: true
  },
  {
    name: "Swiss Cheese 200g",
    category: "Dairy",
    price: 170,
    offerPrice: 160,
    description: ["Nutty and firm", "Perfect for sandwiches", "Holey texture"],
    inStock: true
  },
  {
    name: "Provolone Cheese 200g",
    category: "Dairy",
    price: 140,
    offerPrice: 130,
    description: ["Semi-soft and mild", "Perfect for sandwiches", "Italian favorite"],
    inStock: true
  },
  {
    name: "Havarti Cheese 200g",
    category: "Dairy",
    price: 150,
    offerPrice: 140,
    description: ["Creamy and smooth", "Perfect for melting", "Danish favorite"],
    inStock: true
  },
  {
    name: "Colby Cheese 200g",
    category: "Dairy",
    price: 130,
    offerPrice: 120,
    description: ["Mild and creamy", "Perfect for snacking", "American classic"],
    inStock: true
  },

  // COLD DRINKS (25 products)
  {
    name: "Coca-Cola 1.5L",
    category: "Drinks",
    price: 80,
    offerPrice: 75,
    description: ["Refreshing and fizzy", "Perfect for parties", "Best served chilled"],
    inStock: true
  },
  {
    name: "Pepsi 1.5L",
    category: "Drinks",
    price: 78,
    offerPrice: 73,
    description: ["Chilled and refreshing", "Perfect for celebrations", "Best served cold"],
    inStock: true
  },
  {
    name: "Sprite 1.5L",
    category: "Drinks",
    price: 79,
    offerPrice: 74,
    description: ["Refreshing citrus taste", "Perfect for hot days", "Best served chilled"],
    inStock: true
  },
  {
    name: "Fanta 1.5L",
    category: "Drinks",
    price: 77,
    offerPrice: 72,
    description: ["Sweet and fizzy", "Great for parties", "Best served cold"],
    inStock: true
  },
  {
    name: "7UP 1.5L",
    category: "Drinks",
    price: 76,
    offerPrice: 71,
    description: ["Crisp and clear", "Perfect for mixing", "Best served cold"],
    inStock: true
  },
  {
    name: "Mountain Dew 1.5L",
    category: "Drinks",
    price: 82,
    offerPrice: 77,
    description: ["Bold and citrusy", "Perfect for gaming", "Best served cold"],
    inStock: true
  },
  {
    name: "Mirinda 1.5L",
    category: "Drinks",
    price: 75,
    offerPrice: 70,
    description: ["Orange flavored", "Perfect for kids", "Best served cold"],
    inStock: true
  },
  {
    name: "Thumbs Up 1.5L",
    category: "Drinks",
    price: 78,
    offerPrice: 73,
    description: ["Strong cola taste", "Perfect for adults", "Best served cold"],
    inStock: true
  },
  {
    name: "Limca 1.5L",
    category: "Drinks",
    price: 74,
    offerPrice: 69,
    description: ["Lemon lime flavor", "Perfect for refreshment", "Best served cold"],
    inStock: true
  },
  {
    name: "Slice 1.5L",
    category: "Drinks",
    price: 76,
    offerPrice: 71,
    description: ["Mango flavored", "Perfect for summer", "Best served cold"],
    inStock: true
  },
  {
    name: "Maaza 1.5L",
    category: "Drinks",
    price: 75,
    offerPrice: 70,
    description: ["Mango flavored", "Perfect for kids", "Best served cold"],
    inStock: true
  },
  {
    name: "Appy Fizz 1.5L",
    category: "Drinks",
    price: 80,
    offerPrice: 75,
    description: ["Apple flavored", "Perfect for parties", "Best served cold"],
    inStock: true
  },
  {
    name: "Frooti 1.5L",
    category: "Drinks",
    price: 78,
    offerPrice: 73,
    description: ["Mango flavored", "Perfect for kids", "Best served cold"],
    inStock: true
  },
  {
    name: "Tropicana 1L",
    category: "Drinks",
    price: 120,
    offerPrice: 110,
    description: ["Pure orange juice", "Perfect for breakfast", "Best served cold"],
    inStock: true
  },
  {
    name: "Real Juice 1L",
    category: "Drinks",
    price: 110,
    offerPrice: 100,
    description: ["Mixed fruit juice", "Perfect for health", "Best served cold"],
    inStock: true
  },
  {
    name: "B Natural 1L",
    category: "Drinks",
    price: 100,
    offerPrice: 90,
    description: ["Natural fruit juice", "Perfect for kids", "Best served cold"],
    inStock: true
  },
  {
    name: "Paper Boat 250ml",
    category: "Drinks",
    price: 30,
    offerPrice: 28,
    description: ["Traditional flavors", "Perfect for nostalgia", "Best served cold"],
    inStock: true
  },
  {
    name: "Red Bull 250ml",
    category: "Drinks",
    price: 120,
    offerPrice: 110,
    description: ["Energy drink", "Perfect for energy", "Best served cold"],
    inStock: true
  },
  {
    name: "Monster Energy 250ml",
    category: "Drinks",
    price: 130,
    offerPrice: 120,
    description: ["High energy", "Perfect for gaming", "Best served cold"],
    inStock: true
  },
  {
    name: "Gatorade 500ml",
    category: "Drinks",
    price: 60,
    offerPrice: 55,
    description: ["Sports drink", "Perfect for athletes", "Best served cold"],
    inStock: true
  },
  {
    name: "Powerade 500ml",
    category: "Drinks",
    price: 65,
    offerPrice: 60,
    description: ["Electrolyte drink", "Perfect for sports", "Best served cold"],
    inStock: true
  },
  {
    name: "Coconut Water 500ml",
    category: "Drinks",
    price: 40,
    offerPrice: 35,
    description: ["Natural electrolyte", "Perfect for hydration", "Best served cold"],
    inStock: true
  },
  {
    name: "Lemonade 1L",
    category: "Drinks",
    price: 80,
    offerPrice: 75,
    description: ["Fresh and tangy", "Perfect for summer", "Best served cold"],
    inStock: true
  },
  {
    name: "Iced Tea 1L",
    category: "Drinks",
    price: 70,
    offerPrice: 65,
    description: ["Refreshing tea", "Perfect for afternoon", "Best served cold"],
    inStock: true
  },
  {
    name: "Coffee 250ml",
    category: "Drinks",
    price: 50,
    offerPrice: 45,
    description: ["Strong coffee", "Perfect for mornings", "Best served hot"],
    inStock: true
  }
];

// Combine all products
const allProducts = [...productsData, ...additionalProducts, ...additionalProductsData, ...grainsProductsData];

async function seedProducts() {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Create products with placeholder images
    for (const product of allProducts) {
      try {
        // Use placeholder images for now
        const imageUrls = [
          `https://via.placeholder.com/400x400/4CAF50/FFFFFF?text=${encodeURIComponent(product.name)}`,
          `https://via.placeholder.com/400x400/2196F3/FFFFFF?text=${encodeURIComponent(product.name)}`,
          `https://via.placeholder.com/400x400/FF9800/FFFFFF?text=${encodeURIComponent(product.name)}`
        ];
        
        await Product.create({
          ...product,
          image: imageUrls,
        });

        console.log(`Added product: ${product.name} (${product.category})`);
      } catch (error) {
        console.error(`Error adding product ${product.name}: ${error.message}`);
      }
    }

    console.log(`\n✅ Successfully added ${allProducts.length} products!`);
    console.log(`📊 Product distribution:`);
    
    const categoryCount = {};
    allProducts.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });
    
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedProducts(); 