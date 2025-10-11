import express from 'express';
const router = express.Router();
import { createOrder, getOrdersByUser, getPendingOrders, approveOrder } from '../controllers/orderController.js';

router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);
router.get('/pending', getPendingOrders);
router.put('/approve/:orderId', approveOrder);

export default router;