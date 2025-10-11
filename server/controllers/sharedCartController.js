import SharedCart from '../models/SharedCart.js';
import crypto from 'crypto';

const makeCode = (len = 8) =>
  crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len).toUpperCase();

export const saveSharedCart = async (req, res) => {
  try {
    const { encoded } = req.body;
    if (!encoded) return res.status(400).json({ message: 'Missing encoded cart data' });

    // generate a short code and ensure uniqueness
    let code = makeCode(8);
    let existing = await SharedCart.findOne({ code });
    let attempts = 0;
    while (existing && attempts < 5) {
      code = makeCode(8);
      existing = await SharedCart.findOne({ code });
      attempts++;
    }

    const doc = new SharedCart({ code, encoded });
    await doc.save();

    return res.json({ code });
  } catch (err) {
    console.error('saveSharedCart error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSharedCart = async (req, res) => {
  try {
    const { code } = req.params;
    const doc = await SharedCart.findOne({ code: code.toUpperCase() });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    return res.json({ encoded: doc.encoded });
  } catch (err) {
    console.error('getSharedCart error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
