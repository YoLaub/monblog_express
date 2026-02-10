import express from 'express';
import { pageController } from '../controllers/pageController.js';

const router = express.Router();

router.get('/', pageController.renderHome);
router.get('/index', (req, res) => res.redirect('/'));
router.get('/about', pageController.renderAbout);
router.get('/contact', pageController.renderContact);

export default router;