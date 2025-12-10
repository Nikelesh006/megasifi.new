import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import fs from 'fs';
import path from 'path';

const VALID_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Handle FormData (for file uploads)
    const formData = await request.formData();
    
    // Extract fields from FormData
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const sellerId = formData.get("sellerId");
    const colorOptionsStr = formData.get("colorOptions");
    
    console.log("Form data received:", { name, description, category, subCategory, price, offerPrice, sellerId, colorOptionsStr });
    
    // Validate required fields
    if (!name || !description || !category || !subCategory || !price || !offerPrice || !sellerId) {
      console.log("Missing required fields:", { name, description, category, subCategory, price, offerPrice, sellerId });
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    
    let colorOptions;
    try {
      colorOptions = JSON.parse(colorOptionsStr);
      console.log("Parsed colorOptions:", colorOptions);
    } catch (error) {
      console.log("Failed to parse colorOptions:", error);
      return NextResponse.json({ success: false, message: "Invalid colorOptions format" }, { status: 400 });
    }
    
    if (!Array.isArray(colorOptions) || colorOptions.length === 0) {
      console.log("Invalid colorOptions array:", colorOptions);
      return NextResponse.json({ success: false, message: "At least one color option is required" }, { status: 400 });
    }
    
    // Normalize color options with optional sizes (same logic as create API)
    console.log("PUT API - Received colorOptions:", colorOptions);
    
    let normalizedColors;
    try {
      normalizedColors = colorOptions.map((opt) => {
        if (!opt.color) {
          throw new Error('Colour is required');
        }

        const rawSizes = Array.isArray(opt.sizes) ? opt.sizes : [];
        const cleanSizes = [...new Set(rawSizes)].filter((s) =>
          VALID_SIZES.includes(s)
        );

        console.log(`Processing color ${opt.color}: rawSizes=`, rawSizes, "cleanSizes=", cleanSizes);

        return {
          color: opt.color.toLowerCase(),
          sizes: cleanSizes.map((s) => ({ size: s, stock: 0 })), // may be []
          images: opt.images || [],
        };
      });
    } catch (error) {
      console.log("Error normalizing colors:", error);
      return NextResponse.json({ success: false, message: "Error processing color options: " + error.message }, { status: 400 });
    }
    
    console.log("PUT API - Normalized colors:", normalizedColors);
    
    const update = {
      name,
      description,
      sellerId,
      category,
      subCategory,
      price: Number(price),
      offerPrice: Number(offerPrice),
      colorOptions: normalizedColors,
      date: Date.now(),
    };
    
    // Handle images if provided
    const images = formData.getAll("image");
    const existingImages = formData.get("existingImages");
    
    // First, preserve existing images if provided
    if (existingImages) {
      try {
        const parsedExistingImages = JSON.parse(existingImages);
        update.image = parsedExistingImages.filter(Boolean); // Keep existing images
      } catch (error) {
        console.log("Failed to parse existing images:", error);
      }
    }
    
    // Handle new image uploads
    if (images && images.length > 0) {
      const newImageUrls = [];
      
      for (const image of images) {
        if (image && image.size > 0) {
          try {
            // Create unique filename
            const timestamp = Date.now();
            const filename = `${timestamp}-${image.name}`;
            const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
            
            // Convert file to buffer and save
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            // Ensure uploads directory exists
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            // Save file
            fs.writeFileSync(uploadPath, buffer);
            
            // Add to image URLs
            newImageUrls.push(`/uploads/${filename}`);
            console.log("Image uploaded successfully:", filename);
            
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        }
      }
      
      // Combine existing and new images
      if (newImageUrls.length > 0) {
        update.image = [...(update.image || []), ...newImageUrls];
      }
    }
    
    const product = await Product.findByIdAndUpdate(
      id, 
      update, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Product updated successfully", 
      product 
    });
    
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update product: " + error.message 
    }, { status: 500 });
  }
}
