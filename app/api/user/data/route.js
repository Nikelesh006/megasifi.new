import connectDB from "@/config/db";
import User from "@/models/user";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    console.log("Clerk userId from getAuth:", userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }   

    await connectDB();
    let user = await User.findById(userId);

    if (!user) {
      let clerkUser = null;

      try {
        if (typeof clerkClient?.users?.getUser === "function") {
          clerkUser = await clerkClient.users.getUser(userId);
        }
      } catch (clerkError) {
        console.warn("Failed to fetch user from Clerk", clerkError?.message || clerkError);
      }

      const fallbackEmail =
        clerkUser?.emailAddresses?.[0]?.emailAddress ||
        (clerkUser?.username ? `${clerkUser.username}@placeholder.local` : `${userId}@placeholder.local`);

      const fallbackImage =
        clerkUser?.imageUrl ||
        "https://via.placeholder.com/100x100.png?text=User";

      user = await User.create({
        _id: clerkUser?.id || userId,
        name:
          `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() ||
          clerkUser?.username ||
          clerkUser?.emailAddresses?.[0]?.emailAddress ||
          "User",
        email: fallbackEmail,
        imageUrl: fallbackImage,
        cartItems: {}
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}