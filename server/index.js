import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Stripe from 'stripe';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import coffeeRoutes from './routes/coffeeRoutes.js';
import sharedCartRoutes from './routes/sharedCartRoutes.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const STRIPE_API_KEY1 = process.env.STRIPE_API_KEY;

const stripe = new Stripe(STRIPE_API_KEY1);
const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017/brewdrop';

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coffee', coffeeRoutes);
app.use('/api/shared-cart', sharedCartRoutes);


app.post('/create-checkout-session', async (req, res) => {
  const { orderId, userId, items, total, address, phone } = req.body;

  if (!orderId || !userId || !items || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const line_items = items.map(it => ({
      price_data: {
        currency: 'inr',
        product_data: { name: it.name },
        unit_amount: Math.round(it.price * 100),
      },
      quantity: it.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success?orderId=${orderId}`,
      cancel_url: 'http://localhost:3000/cancel',
      metadata: { orderId, userId },
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
