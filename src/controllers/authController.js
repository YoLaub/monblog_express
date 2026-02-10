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
        res.render('login', { error: 'Identifiants invalides', title: 'Connexion' });
    },

    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
};