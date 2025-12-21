import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/config/db";

export async function GET(request){
  try{
    await connectDB()

    const { searchParams } = new URL(request.url);
    const rawQ = (searchParams.get('q') || '').trim();

    const filter = {};

    if (rawQ) {
      const q = rawQ.toLowerCase();
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const orConditions = [
        { name: regex },
        { brand: regex },
        { category: regex },
        { subCategory: regex },
        { _id: rawQ.match(/^[0-9a-fA-F]{24}$/) ? rawQ : undefined },
      ].filter(Boolean);
      
      if (orConditions.length > 0) {
        filter.$or = orConditions;
      }
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({success:true,data:products})

  }catch(error){
    console.error('Product list API error', error);
    return NextResponse.json({success:false,message:error.message})
  }
}