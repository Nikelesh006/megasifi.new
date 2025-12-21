import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/config/db";

export async function GET(request){
  try{
    await connectDB()

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();

    const filter = {};

    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: regex },
        { brand: regex },
        { category: regex },
        { subCategory: regex },
        { _id: q.match(/^[0-9a-fA-F]{24}$/) ? q : undefined }, // optional id match
      ].filter(Boolean);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({success:true,data:products})

  }catch(error){
    return NextResponse.json({success:false,message:error.message})
  }
}