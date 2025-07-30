import { config } from "dotenv";
import connectDB from "./configs/db.js";
import Product from "./models/Product.js";

config();

async function testDatabase() {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Testing product count...");
    const count = await Product.countDocuments();
    console.log(`Total products in database: ${count}`);

    if (count > 0) {
      console.log("Sample products:");
      const products = await Product.find().limit(3);
      products.forEach((product) => {
        console.log(`- ${product.name} (${product.category})`);
      });
    } else {
      console.log("No products found in database");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

testDatabase();
