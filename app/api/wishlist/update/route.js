import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from "@/config/db";

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const { wishlist } = await request.json(); // array of productId strings

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.wishlist = Array.isArray(wishlist) ? wishlist : [];
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Wishlist updated successfully",
      user,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
