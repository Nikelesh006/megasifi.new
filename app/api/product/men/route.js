import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/config/db";

export async function GET(request) {
  try {
    await connectDB();

    // Get products with category "Men" or similar men's categories
    const menCategories = ["Men", "men", "Male", "male", "Men's", "men's"];
    const products = await Product.find({
      category: { $in: menCategories }
    });

    return NextResponse.json({ 
      success: true, 
      products: products,
      count: products.length
    });

  } catch (error) {
    console.error("Error fetching men's products:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch men's products" 
    });
  }
}
