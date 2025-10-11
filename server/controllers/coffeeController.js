import Coffee from '../models/Coffee.js';

export const getCoffees = async (req, res) => {
  try {
    const coffees = await Coffee.find();
    res.json(coffees);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const createCoffee = async (req, res) => {
  const { name, description, price, rating, image, category, featured } = req.body;
  try {
    const coffee = new Coffee({
      name,
      description,
      price,
      rating,
      image,
      category,
      featured
    });
    await coffee.save();
    res.status(201).json(coffee);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};