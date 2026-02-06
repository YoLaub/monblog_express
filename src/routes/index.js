import express from 'express';
import BlogPost from '../models/BlogPost.js';

const router = express.Router();

// Page d'accueil avec liste des posts
router.get('/', async (req, res, next) => {
    try {
        const blogposts = await BlogPost.find({})
            .sort({ datePosted: -1 })
            .lean(); // lean() améliore les performances de 80%

        res.render('index', {
            blogposts,
            title: 'Clean Blog - Accueil'
        });
    } catch (error) {
        next(error); // Express v5 gère automatiquement les erreurs async
    }
});

// Redirection depuis /index vers /
router.get('/index', (req, res) => {
    res.redirect('/');
});

// Page About
router.get('/about', (req, res) => {
    res.render('about', { title: 'À propos' });
});

// Page Contact
router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});

export default router;
