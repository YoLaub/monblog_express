import express from 'express';
import { postController } from '../controllers/postController.js';
import { authMiddleware } from "../middleware/auth.js";
import { validateImage } from "../middleware/upload.js"; // Importation

const router = express.Router();

router.get('/new', authMiddleware, postController.renderCreate);
// Injection du middleware de validation d'image ici
router.post('/store', authMiddleware, validateImage, postController.store);
router.get('/:id', postController.show);

router.post('/edit/:id', authMiddleware, validateImage, postController.update);
router.post('/delete/:id', authMiddleware, postController.delete);

export default router;