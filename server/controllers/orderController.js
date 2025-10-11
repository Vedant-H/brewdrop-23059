import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  const { userId, items, total } = req.body;
  try {
    const order = new Order({
      userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
      approved: false
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ approved: false });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const approveOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { approved: true, status: 'approved' },
      { new: true }
    );
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};