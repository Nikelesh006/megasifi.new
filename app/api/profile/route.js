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

    // Return only profile-related fields
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

    return NextResponse.json({ success: true, profile: profileData });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
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

    const profileData = await request.json();

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update profile fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          birthDate: profileData.birthDate,
          gender: profileData.gender,
          bio: profileData.bio,
        },
      },
      { new: true, runValidators: true }
    );

    // Return updated profile data
    const responseProfile = {
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || "",
      address: updatedUser.address || "",
      birthDate: updatedUser.birthDate || "",
      gender: updatedUser.gender || "",
      bio: updatedUser.bio || "",
      imageUrl: updatedUser.imageUrl
    };

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully",
      profile: responseProfile 
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
