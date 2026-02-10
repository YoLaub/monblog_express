import { blogService } from '../services/blogService.js';

export const pageController = {
    async renderHome(req, res, next) {
        try {
            const blogposts = await blogService.getAllPosts();
            res.render('index', { blogposts, title: 'Clean Blog - Accueil' });
        } catch (error) {
            next(error);
        }
    },

    renderAbout(req, res) {
        res.render('about', { title: 'À propos' });
    },

    renderContact(req, res) {
        res.render('contact', { title: 'Contact' });
    }
};