import express from 'express';
import { postController } from '../controllers/postController.js';
import { authMiddleware } from "../middleware/auth.js";
import { validateImage } from "../middleware/upload.js";
// import {validatePost} from "../middleware/post.js"; // Suppression de l'importation

const router = express.Router();

router.get('/new', authMiddleware, postController.renderCreate);
// validatePost supprimé
router.post('/store', authMiddleware, validateImage, postController.store);
router.get('/:id', postController.show);
router.get('/edit/:id', authMiddleware, postController.renderEdit);
// validatePost supprimé
router.post('/edit/:id', authMiddleware, validateImage, postController.update);
router.post('/delete/:id', authMiddleware, postController.delete);

export default router;