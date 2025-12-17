import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    sellerId: { type: String, required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: String, required: false },
        color: { type: String, required: true },
        image: { type: String, required: false },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
    status: { type: String, required: true, default: "order placed" },
    date: { type: Number, required: true },
  },
  { minimize: false }
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export { Order };
export default Order;