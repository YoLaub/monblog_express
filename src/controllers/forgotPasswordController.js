import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const forgotPasswordController = {

    renderForgotPassword(req, res) {
        res.render("forgotPassword", {title: "Mot de passe oublié"});
    },

    async forgotPassword(req, res, next) {
        try {
            const email = req.body.username;
            const user = await User.findOne({ username: email });

            if (!user) {
                req.flash("error", "Aucun utilisateur trouvé !");
                return res.redirect("/auth/forgot-password");
            }

            const token = crypto.randomBytes(32).toString("hex");
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 min [file:1]
            await user.save();

            console.log("Lien reset password:", `http://localhost:3000/auth/reset-password/${token}`);
            req.flash("success", "Lien envoyé (voir console) !");
            return res.redirect("/auth/login");
        } catch (err) {
            next(err);
        }
    },

    async renderReset(req, res) {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash("error", "Token invalide ou expiré !");
            return res.redirect("/auth/forgot-password");
        }

        res.render("resetPassword", { title: "Nouveau mot de passe", token: req.params.token });
    },

    async reset(req, res, next) {
        try {
            const { password } = req.body;

            const user = await User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                req.flash("error", "Token invalide ou expiré !");
                return res.redirect("/auth/forgot-password");
            }

            if (!password || password.length < 8) {
                req.flash("error", "Minimum 8 caractères pour le mot de passe.");
                return res.redirect(`/auth/reset-password/${req.params.token}`);
            }

            user.password = password; // <-- le pre('save') hash ici
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save(); // déclenche le hash + validations

            req.flash("success", "Mot de passe mis à jour !");
            return res.redirect("/auth/login");
        } catch (err) {
            next(err);
        }
    }
};