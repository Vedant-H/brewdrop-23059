import mongoose from 'mongoose';

const SharedCartSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  encoded: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // Optional expiry in milliseconds from creation
  expiresAt: { type: Date },
});

export default mongoose.model('SharedCart', SharedCartSchema);
