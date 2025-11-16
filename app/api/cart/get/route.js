import { getAuth } from "@clerk/nextjs/dist/types/server"
import { NextResponse } from "next/server"
import { connectDB } from "mongoose";
import User from "@/models/user";
import { NextResponse } from "next/server";


export async function GET(request){
    try{
        
        const{ userId }= getAuth(request)

        await connectDB()

        const user=await User.findById(userId)

        const { cartItems}=user
        return NextResponse.json({success:true,data:cartItems})

    }catch(error){
        return NextResponse.json({success:false,message:error.message})
    }
}