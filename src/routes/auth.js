import express from 'express';
import { authController } from '../controllers/authController.js';
import { redirectIfAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/login', redirectIfAuthenticated, authController.renderLogin);
router.post('/login', redirectIfAuthenticated, authController.login);
router.get('/logout', authController.logout);

export default router;