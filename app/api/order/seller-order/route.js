import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });
    }

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    await connectDB();

    const sellerProducts = await Product.find({ userId }).select("_id");
    const productIds = sellerProducts.map((product) => product._id);

    if (productIds.length === 0) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("items.product")
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}