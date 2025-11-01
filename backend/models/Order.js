import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  address: { type: String },
  items: [OrderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending','Preparing','Out for Delivery','Delivered','Cancelled'] }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);