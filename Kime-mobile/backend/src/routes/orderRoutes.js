import express from 'express';
import { getAllOrders, createOrder, updateOrderStatus, getOrderById } from '../controllers/orderController.js'; 
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';

 const router = express.Router();

router.get('/', getAllOrders, authMiddleware, authorizeRoles('owner'));
router.post('/', createOrder);
router.put('/:id', updateOrderStatus);
router.get('/:id', getOrderById); 

 export default router;
