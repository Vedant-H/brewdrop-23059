import express from 'express';
import { saveSharedCart, getSharedCart } from '../controllers/sharedCartController.js';

const router = express.Router();

router.post('/', saveSharedCart);
router.get('/:code', getSharedCart);

export default router;
