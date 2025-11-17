import { getAuth } from "@clerk/nextjs/dist/types/server";
import { v2 as cloudinary} from "cloudinary";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectDB } from "@/config/db";
import authSeller from "@/lib/authSeller";


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
        const description=formData.get("description");;
        const price=formData.get("price");
        const category=formData.get("category");
        const offerPrice=formData.grt("offerPrice");

        const files=formData.getAll("image");

        if(!files ||files.length===0){

            return NextResponse.json({success:false, message:'no files uploaded'})
        }
        const result=await Promise.all(
            files.map(async(file)=>{
                const arrayBuffer=await file.arrayBuffer()
                const buffer=new Buffer.from(arrayBuffer)

                return new Promise((resolve,reject)=>{
                    const stream =cloudinary.uploader.upload_large_stream(
                        {resource_type :"auto"},
                        (err,result)=>{
                            if(err){
                                reject(err)
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
            name,
            description,
            price:Number(price),
            category,
            offerPrice:Number(offerPrice),
            image,
            date:Date.now()
        })

        return NextResponse.json({success:true,message:"Product added successfully"})

    }catch(error){

           return NextResponse.json({success:false, message:error.message})
    }
}