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

async function fileToBuffer(file) {
  // prefer arrayBuffer if available (Edge / some runtimes)
  if (file && typeof file.arrayBuffer === "function") {
    const ab = await file.arrayBuffer();
    return Buffer.from(ab);
  }

  // Node/next route handler: use stream() if provided
  if (file && typeof file.stream === "function") {
    const stream = file.stream();
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  // fallback: if file is a string/URL, fetch it
  if (typeof file === "string") {
    const res = await fetch(file);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  }

  throw new Error("Unsupported file input: cannot convert to buffer");
}

export async function POST(request){
    try{
        // ensure DB is connected before any model/auth checks
        await connectDB();

        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const formData = await request.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const price = formData.get("price");
        const category = formData.get("category");
        const offerPrice = formData.get("offerPrice");

        const files = formData.getAll("image");

        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: "No files uploaded" }, { status: 400 });
        }

        const result = await Promise.all(
            files.map(async (file) => {
                const buffer = await fileToBuffer(file);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(buffer);
                });
            })
        );

        const image = result.map(r => r.secure_url);

        const newProduct = await Product.create({
            userId,
            name,
            description,
            price: Number(price) || 0,
            category,
            offerPrice: Number(offerPrice) || 0,
            image,
            date: Date.now()
        });

        return NextResponse.json({ success: true, message: "Product added successfully", product: newProduct }, { status: 201 });

    }catch(error){
        return NextResponse.json({ success: false, message: error?.message || "Server error" }, { status: 500 });
    }
}