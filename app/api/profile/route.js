import connectDB from "@/config/db";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

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

    const profileData = {
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      birthDate: user.birthDate || "",
      gender: user.gender || "",
      bio: user.bio || "",
      imageUrl: user.imageUrl
    };

    return NextResponse.json({ success: true, user: profileData });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, phone, address, birthDate, gender, bio } = await request.json();

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update user profile fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (birthDate !== undefined) updateData.birthDate = birthDate;
    if (gender !== undefined) updateData.gender = gender;
    if (bio !== undefined) updateData.bio = bio;

    await User.findByIdAndUpdate(userId, updateData);

    // Fetch updated user data
    const updatedUser = await User.findById(userId);
    const profileData = {
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || "",
      address: updatedUser.address || "",
      birthDate: updatedUser.birthDate || "",
      gender: updatedUser.gender || "",
      bio: updatedUser.bio || "",
      imageUrl: updatedUser.imageUrl
    };

    return NextResponse.json({ success: true, user: profileData });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
