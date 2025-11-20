import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/config/db";

export async function GET(request) {
  try {
    await connectDB();

    // Get products with category "Women" or similar women's categories
    const womenCategories = ["Women", "women", "Female", "female", "Women's", "women's"];
    const products = await Product.find({
      category: { $in: womenCategories }
    });

    return NextResponse.json({ 
      success: true, 
      products: products,
      count: products.length
    });

  } catch (error) {
    console.error("Error fetching women's products:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch women's products" 
    });
  }
}
