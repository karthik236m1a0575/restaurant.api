import express from 'express';
import Order from '../models/Order.js';
import Item from '../models/Item.js';
const router = express.Router();

// Place order
router.post('/', async (req, res) => {
  const { customerName, customerPhone, address, items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain items' });
  }
  // calculate total and embed item snapshot
  let total = 0;
  const itemsSnapshot = [];
  for (const it of items) {
    const dbItem = await Item.findById(it.item);
    if (!dbItem) return res.status(400).json({ message: 'Item not found: ' + it.item });
    const qty = Number(it.qty) || 1;
    total += dbItem.price * qty;
    itemsSnapshot.push({ item: dbItem._id, name: dbItem.name, price: dbItem.price, qty });
  }
  const order = new Order({ customerName, customerPhone, address, items: itemsSnapshot, totalPrice: total });
  const saved = await order.save();
  res.status(201).json(saved);
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

// Get single order
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// Update order status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

export default router;