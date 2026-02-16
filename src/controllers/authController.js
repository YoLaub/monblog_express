import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const authController = {
    renderLogin(req, res) {
        res.render('login', { title: 'Connexion Admin' });
    },

    async login(req, res) {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.userId = user._id; // On stocke l'ID dans la session
                return res.redirect('/');
            }
        }
        req.flash('error', 'Identifiants invalides');
        return res.redirect('/auth/login');
    },

    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    },

    renderRegister(req, res) {
        res.render('register', { title: 'Inscription' });
    },

    async register(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                req.flash('error', 'Username et mot de passe obligatoires');
                return res.redirect('/auth/register');
            }

            const existing = await authController.verifyUser(username);
            if (existing) {
                req.flash('error', 'Username déjà utilisé');
                return res.redirect('/auth/register');
            }

            const user = await User.create({ username, password });

            req.session.userId = user._id;
            req.flash('success', 'Compte créé avec succès !');
            return res.redirect('/');
        } catch (err) {
            if (err.code === 11000) {
                req.flash('error', 'Username déjà utilisé');
                return res.redirect('/auth/register');
            }
            req.flash('error', err.message || 'Erreur serveur');
            return res.redirect('/auth/register');
        }
    },

    async verifyUser(username) {
        return await User.findOne({ username });
    }
};