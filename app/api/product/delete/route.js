import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product id is required" });
    }

    await connectDB();

    const deletedProduct = await Product.findOneAndDelete({ _id: productId, userId });

    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
