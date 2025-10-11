import express from 'express';
const router = express.Router();
import { getCoffees, createCoffee } from '../controllers/coffeeController.js';

router.get('/', getCoffees);
router.post('/', createCoffee);

export default router;