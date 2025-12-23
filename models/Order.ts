import mongoose, { Schema, Document, models } from 'mongoose';

export interface IOrder extends Document {
  userId?: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'failed';
  paymentGateway: 'razorpay';
  paymentInfo?: any;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String },
    items: { type: Schema.Types.Mixed, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentGateway: { type: String, default: 'razorpay' },
    paymentInfo: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
