import express from 'express';
import { passwordResest, passwordResetRequest } from '../controllers/passwordResetController.js';

const router = express.Router();

router.post('/forgot-password', passwordResetRequest);
router.post('/reset', passwordResest);


export default router;