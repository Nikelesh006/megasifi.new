import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
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