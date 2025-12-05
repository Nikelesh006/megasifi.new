import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";

export const runtime = "nodejs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request){
    try{

        const{userId}=getAuth(request)

        const isSeller=await authSeller(userId)

        if(!isSeller){
            return NextResponse.json({success:false,message:"Unauthorized"})
        }

        const formData=await request.formData()

        const name=formData.get("name");
        const description=formData.get("description");
        const price=formData.get("price");
        const category=formData.get("category");
        const subCategory=formData.get("subCategory");
        const offerPrice=formData.get("offerPrice");
        const sellerId=formData.get("sellerId");
        const colorOptionsStr = formData.get("colorOptions");

        if (!sellerId || sellerId.trim() === '') {
            return NextResponse.json({success:false, message:'Seller ID is required'})
        }

        let colorOptions;
        try {
            colorOptions = JSON.parse(colorOptionsStr);
        } catch (error) {
            return NextResponse.json({success:false, message:'Invalid color options format'})
        }

        if (!Array.isArray(colorOptions) || !colorOptions.length) {
            return NextResponse.json({success:false, message:'At least one colour is required'})
        }

        const VALID_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

        const normalizedColors = colorOptions.map((opt) => {
            if (!opt.color || !Array.isArray(opt.sizes) || !opt.sizes.length) {
                throw new Error('Each colour must have at least one size');
            }
            const cleanSizes = [...new Set(opt.sizes)].filter((s) =>
                VALID_SIZES.includes(s)
            );
            if (!cleanSizes.length) throw new Error('Invalid sizes');
            return {
                color: opt.color.toLowerCase(),
                sizes: cleanSizes.map((s) => ({ size: s, stock: 0 })),
                images: opt.images || [],
            };
        });

        const files=formData.getAll("image");
        const validFiles = (files || []).filter(
            (file) => file && typeof file.arrayBuffer === 'function'
        );

        if(!validFiles || validFiles.length===0){

            return NextResponse.json({success:false, message:'no valid files uploaded'})
        }
        const result=await Promise.all(
            validFiles.map(async(file)=>{
                const arrayBuffer=await file.arrayBuffer()
                const buffer=Buffer.from(arrayBuffer)

                return new Promise((resolve,reject)=>{
                    const stream =cloudinary.uploader.upload_stream(
                        {resource_type :"auto"},
                        (error,result)=>{
                            if(error){
                                reject(error)
                            }
                            else{
                               resolve(result)
                            }
                        }
                    )

                    stream.end(buffer)
                })
            })
        )

        const image= result.map(result=>result.secure_url)

        await connectDB()
        const newProduct= await Product.create({
            userId,
            sellerId,
            name,
            description,
            price:Number(price),
            category,
            subCategory,
            offerPrice:Number(offerPrice),
            image,
            date:Date.now(),
            colorOptions: normalizedColors,
        })

        return NextResponse.json({success:true,message:"Product added successfully"})

    }catch(error){

           return NextResponse.json({success:false, message:error.message})
    }
}