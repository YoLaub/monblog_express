import express from "express";
const router = express.Router();

router.use((req, res) => {
    res.status(404).render("notFound", { title: "404 - Page introuvable" });
});

export default router;
