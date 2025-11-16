
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/config/db";


export async function GET(request){

  try{
    await connectDB()

        const products=await Product.find({userId})

        return NextResponse.json({success:true,data:products})

    }catch(error){
        return NextResponse.json({success:false,message:error.message})
    }
}