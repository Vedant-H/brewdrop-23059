import mongoose from 'mongoose';

const CoffeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  featured: { type: Boolean, default: false }
});

export default mongoose.model('Coffee', CoffeeSchema);