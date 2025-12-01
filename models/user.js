import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk userId
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    cartItems: { type: Object, default: {} },
    wishlist: { type: [String], default: [] }, // <-- NEW
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    birthDate: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "" },
    bio: { type: String, default: "" },
  },
  { minimize: false }
);

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
