export function validatePost(req, res, next) {
    const { title, body } = req.body;
    if (!title || !body) {
        req.flash('error', 'Titre et contenu obligatoires');
        return res.redirect('/posts/new');
    }
    next();
}
