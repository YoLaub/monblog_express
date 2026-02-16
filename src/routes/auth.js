import express from 'express';
import { authController } from '../controllers/authController.js';
import { redirectIfAuthenticated } from '../middleware/auth.js';
import { forgotPasswordController } from "../controllers/ForgotPasswordController.js";

const router = express.Router();

router.get("/forgot-password", redirectIfAuthenticated, forgotPasswordController.renderForgotPassword);
router.post("/forgot-password", redirectIfAuthenticated, forgotPasswordController.forgotPassword);

router.get("/reset-password/:token", redirectIfAuthenticated, forgotPasswordController.renderReset);
router.post("/reset-password/:token", redirectIfAuthenticated, forgotPasswordController.reset);

router.get('/login', redirectIfAuthenticated, authController.renderLogin);
router.post('/login', redirectIfAuthenticated, authController.login);
router.get('/logout', authController.logout);
router.get('/register', authController.renderRegister);
router.post('/register', authController.register);

export default router;