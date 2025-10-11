import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      email,
      name,
      password: hashedPassword,
      createdAt: new Date(),
      isAdmin: email === 'admin@gmail.com'
    });
    await user.save();
    res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const logout = (req, res) => {
  res.json({ msg: 'Logged out' });
};