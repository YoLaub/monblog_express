import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import BlogPost from '../models/BlogPost.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Page de création d'un nouveau post
router.get('/new', (req, res) => {
    res.render('create', { title: 'Nouveau Post' });
});

// Création d'un post (avec validation améliorée)
router.post('/store', async (req, res, next) => {
    try {
        const { title, body } = req.body;

        // Validation des champs
        if (!title || !body) {
            return res.status(400).render('create', {
                error: 'Le titre et le contenu sont obligatoires',
                title: 'Nouveau Post'
            });
        }

        // Gestion de l'image
        let imagePath = '/assets/img/home-bg.jpg'; // Image par défaut

        if (req.files && req.files.image) {
            const image = req.files.image;

            // Validation du type de fichier
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(image.mimetype)) {
                return res.status(400).render('create', {
                    error: 'Format d\'image non supporté. Utilisez JPG, PNG ou WEBP',
                    title: 'Nouveau Post'
                });
            }

            // Renommer le fichier pour éviter les conflits
            const timestamp = Date.now();
            const fileName = `${timestamp}-${image.name}`;
            const uploadPath = path.join(__dirname, '../../public/assets/img', fileName);

            // Déplacer le fichier
            await image.mv(uploadPath);
            imagePath = `/assets/img/${fileName}`;
        }

        // Créer le post
        const blogpost = await BlogPost.create({
            title,
            body,
            image: imagePath
        });

        console.log('✅ Post créé:', blogpost.title);
        res.redirect('/');

    } catch (error) {
        if (error.name === 'ValidationError') {
            // Erreur de validation Mongoose
            return res.status(400).render('create', {
                error: Object.values(error.errors).map(e => e.message).join(', '),
                title: 'Nouveau Post'
            });
        }
        next(error);
    }
});

// Afficher un post spécifique
router.get('/:id', async (req, res, next) => {
    try {
        const blogpost = await BlogPost.findById(req.params.id);

        if (!blogpost) {
            return res.status(404).render('error', {
                message: 'Post non trouvé',
                error: { status: 404 }
            });
        }

        res.render('post', {
            blogpost,
            title: blogpost.title
        });
    } catch (error) {
        if (error.name === 'CastError') {
            // ID invalide
            return res.status(400).render('error', {
                message: 'ID de post invalide',
                error: { status: 400 }
            });
        }
        next(error);
    }
});

export default router;
