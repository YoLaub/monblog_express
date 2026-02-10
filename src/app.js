import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import indexRouter from './routes/index.js';
import postsRouter from './routes/posts.js';
import authRouter from './routes/auth.js';
import User from './models/User.js';

async function createFirstUser() {
    try {
        const newUser = new User({
            username: "Testeur",
            email: "test@example.com",
            password: "Admin01",
            age: 25
        });

        await newUser.save();
        console.log("Base de données mise à jour : Collection User créée !");
    } catch (err) {
        console.error("Erreur :", err);
    }
}

// createFirstUser();

// Configuration ESM pour __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || 'p0st_s3cur3_k3y',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 heures
}))

// Middleware pour rendre le statut de connexion global aux vues EJS
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.userId || null;
    next();
});

// Configuration du moteur de template
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Middlewares modernes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    abortOnLimit: true,
    createParentPath: true
}));

// Connexion MongoDB avec gestion d'erreur améliorée
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newBlog');
        console.log('✅ MongoDB connecté');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/posts', postsRouter);

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).render('error', {
        message: 'Page non trouvée',
        error: { status: 404 }
    });
});

// Gestionnaire d'erreurs global (Express v5 supporte les async!)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        message: err.message || 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

export default app;
