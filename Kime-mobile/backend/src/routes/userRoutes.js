import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
} from '../controllers/userController.js';
import { authMiddleware, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', registerUser);
router.post('/login',    loginUser);

// Rutas protegidas
router.get('/profile',   authMiddleware, getProfile);
router.put('/profile',   authMiddleware, updateProfile);

// Ejemplo de ruta solo para admins:
// router.delete('/:id', authMiddleware, authorizeRoles('owner'), deleteUser);

export default router;
