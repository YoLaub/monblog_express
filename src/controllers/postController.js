import { blogService } from '../services/blogService.js';

export const postController = {
    renderCreate(req, res) {
        res.render('create', { title: 'Nouveau Post' });
    },

    async store(req, res, next) {
        try {
            const { title, body } = req.body;

            if (!title || !body) {
                return res.status(400).render('create', {
                    error: 'Le titre et le contenu sont obligatoires',
                    title: 'Nouveau Post'
                });
            }

            const imageFile = req.files?.image;
            await blogService.createPost({ title, body }, imageFile);

            res.redirect('/');
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).render('create', {
                    error: Object.values(error.errors).map(e => e.message).join(', '),
                    title: 'Nouveau Post'
                });
            }
            next(error);
        }
    },

    async show(req, res, next) {
        try {
            const blogpost = await blogService.getPostById(req.params.id);
            if (!blogpost) return res.status(404).render('error', { message: 'Post non trouvé', error: { status: 404 } });

            res.render('post', { blogpost, title: blogpost.title });
        } catch (error) {
            if (error.name === 'CastError') return res.status(400).render('error', { message: 'ID invalide', error: { status: 400 } });
            next(error);
        }
    },

    async renderEdit(req, res, next) {
        try {
            const blogpost = await blogService.getPostById(req.params.id);
            res.render('create', { blogpost, title: 'Modifier l\'article' }); // On réutilise create.ejs
        } catch (error) { next(error); }
    },

    async update(req, res, next) {
        try {
            const imageFile = req.files?.image;
            await blogService.updatePost(req.params.id, req.body, imageFile);
            res.redirect(`/posts/${req.params.id}`);
        } catch (error) { next(error); }
    },

    async delete(req, res, next) {
        try {
            await blogService.deletePost(req.params.id);
            res.redirect('/');
        } catch (error) { next(error); }
    }
};