export function errorHandler(err, req, res) {
    console.error(err);

    const status = err.status || 500;

    // Si tu as une API JSON quelque part
    if (req.accepts("json") && !req.accepts("html")) {
        return res.status(status).json({
            message: status === 500 ? "Erreur serveur" : err.message,
        });
    }

    return res.status(status).render("error", {
        title: status === 500 ? "Erreur serveur" : "Erreur",
        status,
        message: status === 500 ? "Une erreur interne est survenue." : err.message,
    });
}
