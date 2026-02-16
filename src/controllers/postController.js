import { blogService } from '../services/blogService.js';

export const postController = {
    renderCreate(req, res) {
        const [error] = req.flash('error'); // string ou undefined
        res.render('create', { title: 'Nouveau Post', error });
    },

    async store(req, res, next) {
        try {
            const { title, body } = req.body;

            // Validation manuelle des champs requis
            if (!title || title.trim() === '' || !body || body.trim() === '') {
                req.flash('error', 'Le titre et le contenu sont obligatoires.');
                return res.redirect('/posts/new');
            }

            const imageFile = req.files?.image;
            await blogService.createPost(
                { title, body, userid: req.session.userId },
                imageFile
            );

            req.flash('success', 'Article créé avec succès !');
            res.redirect('/');
        } catch (error) {
            // Gère les erreurs de validation du schéma Mongoose
            if (error.name === 'ValidationError') {
                req.flash('error', Object.values(error.errors).map(e => e.message).join(', '));
                return res.redirect('/posts/new');
            }
            next(error);
        }
    },

    async show(req, res, next) {
        try {
            const blogpost = await blogService.getPostById(req.params.id);
            if (!blogpost) {
                return res.status(404).render('error', { message: 'Post non trouvé', error: { status: 404 }, title: '404' });
            }
            // Assurez-vous que `loggedIn` est passé à la vue `post.ejs`
            res.render('post', { blogpost, title: blogpost.title, loggedIn: res.locals.loggedIn });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).render('error', { message: 'ID invalide', error: { status: 400 }, title: 'Erreur ID' });
            }
            next(error);
        }
    },

    async renderEdit(req, res, next) {
        try {
            const blogpost = await blogService.getPostById(req.params.id);
            if (!blogpost) {
                return res.status(404).render('error', { message: 'Post non trouvé pour édition', error: { status: 404 }, title: '404' });
            }
            // Passe les messages flash d'erreur à la vue, utile si la validation de l'update échoue
            res.render('create', { blogpost, title: 'Modifier l\'article', error: req.flash('error') });
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(400).render('error', { message: 'ID invalide', error: { status: 400 }, title: 'Erreur ID' });
            }
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { title, body } = req.body;

            // Validation manuelle des champs requis
            if (!title || title.trim() === '' || !body || body.trim() === '') {
                req.flash('error', 'Le titre et le contenu sont obligatoires.');
                return res.redirect(`/posts/edit/${req.params.id}`); // Redirige vers la page d'édition
            }

            const imageFile = req.files?.image;
            await blogService.updatePost(req.params.id, req.body, imageFile);

            req.flash('success', 'Article mis à jour avec succès !');
            res.redirect(`/posts/${req.params.id}`);
        } catch (error) {
            if (error.name === 'ValidationError') {
                req.flash('error', Object.values(error.errors).map(e => e.message).join(', '));
                return res.redirect(`/posts/edit/${req.params.id}`); // Redirige vers la page d'édition
            }
            if (error.message === 'Post introuvable') {
                return res.status(404).render('error', { message: 'Post non trouvé pour la mise à jour', error: { status: 404 }, title: '404' });
            }
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            await blogService.deletePost(req.params.id);
            req.flash('success', 'Article supprimé avec succès !');
            res.redirect('/');
        } catch (error) {
            if (error.message === 'Post introuvable') {
                return res.status(404).render('error', { message: 'Post non trouvé pour la suppression', error: { status: 404 }, title: '404' });
            }
            next(error);
        }
    }
};