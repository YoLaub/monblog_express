export const validateImage = (req, res, next) => {
    // Si aucun fichier n'est envoyé, on continue (l'image est optionnelle dans le modèle)
    if (!req.files || Object.keys(req.files).length === 0||!req.files.image) {
        return next();
    }


    const image = req.files.image;
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(image.mimetype)) {
        return res.status(400).render('create', {
            error: 'Format d\'image invalide. Seuls JPG, PNG et WEBP sont acceptés.',
            title: 'Nouveau Post'
        });
    }

    next();
};