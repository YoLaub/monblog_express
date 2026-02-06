# 📝 Clean Blog - Application de Blog avec Node.js \& Express v5

Un blog moderne et élégant construit avec Node.js, Express v5, MongoDB et Bootstrap 5. Ce projet démontre les meilleures pratiques de développement web en 2026.

## ✨ Fonctionnalités

- 📋 Liste d'articles avec pagination automatique
- ✍️ Création d'articles avec éditeur de texte
- 🖼️ Upload d'images de couverture
- 📱 Design responsive avec Bootstrap 5.3
- 🔍 Interface utilisateur moderne et intuitive
- 💾 Stockage des données dans MongoDB
- 🚀 Performance optimisée avec Mongoose v8


## 🛠️ Technologies utilisées

### Backend

- **Node.js v22 LTS** - Runtime JavaScript haute performance
- **Express v5** - Framework web minimaliste et flexible
- **MongoDB v7.x** - Base de données NoSQL
- **Mongoose v8** - ODM pour MongoDB avec validation


### Frontend

- **EJS** - Moteur de templates JavaScript
- **Bootstrap 5.3** - Framework CSS responsive
- **Font Awesome 6.5** - Bibliothèque d'icônes
- **Start Bootstrap Clean Blog** - Thème Bootstrap gratuit


### Outils de développement

- **Node.js --watch** - Rechargement automatique (natif v22)
- **dotenv** - Gestion des variables d'environnement
- **express-fileupload** - Gestion des uploads de fichiers


## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js v22 LTS](https://nodejs.org/) ou supérieur
- [MongoDB v7.x](https://www.mongodb.com/try/download/community) ou accès à MongoDB Atlas
- [Git](https://git-scm.com/) (optionnel)


## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/monblog.git
cd monblog
```


### 2. Installer les dépendances

```bash
npm install
```


### 3. Copier les assets du thème

```bash
# Copier CSS, JS et images depuis node_modules
cp -r node_modules/startbootstrap-clean-blog/dist/css public/
cp -r node_modules/startbootstrap-clean-blog/dist/js public/
cp -r node_modules/startbootstrap-clean-blog/dist/assets public/

# Créer le dossier pour les uploads
mkdir -p public/assets/img/uploads
```


### 4. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/newBlog
```

**Pour MongoDB Atlas**, remplacez `MONGODB_URI` par votre chaîne de connexion :

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/newBlog
```


### 5. Démarrer MongoDB (si local)

```bash
# Sur macOS/Linux
mongod

# Sur Windows (dans une invite de commande admin)
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```


### 6. Lancer l'application

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

L'application sera accessible sur **http://localhost:3000**

## 📁 Structure du projet

```
monblog/
├── src/                        # Code source
│   ├── models/                 # Modèles Mongoose
│   │   └── BlogPost.js        # Schéma des articles
│   ├── routes/                 # Routes Express
│   │   ├── index.js           # Routes principales
│   │   └── posts.js           # Routes des articles
│   └── app.js                 # Configuration Express
├── views/                      # Templates EJS
│   ├── layouts/               # Composants réutilisables
│   │   ├── header.ejs
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   └── scripts.ejs
│   ├── index.ejs              # Page d'accueil
│   ├── create.ejs             # Formulaire de création
│   ├── post.ejs               # Détail d'un article
│   ├── about.ejs              # Page à propos
│   ├── contact.ejs            # Page contact
│   └── error.ejs              # Page d'erreur
├── public/                     # Fichiers statiques
│   ├── css/                   # Styles CSS
│   ├── js/                    # Scripts JavaScript
│   └── assets/                # Images et ressources
│       └── img/
├── .env                        # Variables d'environnement (non versionné)
├── .gitignore                 # Fichiers ignorés par Git
├── package.json               # Dépendances npm
├── server.js                  # Point d'entrée
└── README.md                  # Documentation
```


## 🎯 Utilisation

### Créer un article

1. Cliquez sur **"Nouveau Post"** dans la barre de navigation
2. Remplissez le formulaire :
    - **Titre** : Maximum 200 caractères
    - **Contenu** : Corps de l'article
    - **Image** : Formats acceptés JPG, PNG, WEBP (max 5 Mo)
3. Cliquez sur **"Publier"**

### Consulter les articles

- **Page d'accueil** : Liste de tous les articles triés par date
- **Cliquez sur un article** pour voir son contenu complet


## 🔧 Scripts disponibles

```bash
# Démarrage en mode développement (rechargement auto avec Node.js v22)
npm run dev

# Démarrage en mode développement (avec nodemon)
npm run dev:nodemon

# Démarrage en mode production
npm start
```


## 🗄️ Modèle de données

### BlogPost

```javascript
{
  title: String,           // Titre de l'article (requis, max 200 car.)
  body: String,            // Contenu de l'article (requis)
  image: String,           // Chemin de l'image (défaut: /assets/img/home-bg.jpg)
  datePosted: Date,        // Date de publication (défaut: Date.now)
  createdAt: Date,         // Créé automatiquement par timestamps
  updatedAt: Date          // Mis à jour automatiquement
}
```


## 🌐 Routes API

| Méthode | Route | Description |
| :-- | :-- | :-- |
| GET | `/` | Page d'accueil avec liste des articles |
| GET | `/posts/new` | Formulaire de création |
| POST | `/posts/store` | Créer un nouvel article |
| GET | `/posts/:id` | Détail d'un article |
| GET | `/about` | Page à propos |
| GET | `/contact` | Page contact |

## 🔐 Sécurité

- ✅ Validation des entrées utilisateur
- ✅ Limitation de taille des fichiers (5 Mo)
- ✅ Validation des types MIME pour les images
- ✅ Protection contre les injections NoSQL (Mongoose)
- ✅ Variables d'environnement pour les données sensibles
- ✅ Gestion d'erreurs robuste


## 🚀 Déploiement

### Prérequis production

- Node.js v22+ installé sur le serveur
- MongoDB accessible (local ou Atlas)
- Variables d'environnement configurées


### Variables d'environnement production

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/newBlog
```


### Plateformes recommandées

- **[Render](https://render.com)** - Gratuit, facile à déployer
- **[Railway](https://railway.app)** - Déploiement automatique depuis Git
- **[Heroku](https://heroku.com)** - Plateforme éprouvée
- **[DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)** - Scalable


### Exemple de déploiement sur Render

1. Créez un compte sur [Render](https://render.com)
2. Créez un nouveau **Web Service**
3. Connectez votre dépôt Git
4. Configuration :
    - **Build Command** : `npm install`
    - **Start Command** : `npm start`
5. Ajoutez les variables d'environnement
6. Déployez !

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## 📝 Améliorations futures

- [ ] Système d'authentification utilisateur
- [ ] Pagination des articles
- [ ] Système de commentaires
- [ ] Recherche full-text
- [ ] Catégories et tags
- [ ] Éditeur WYSIWYG (TinyMCE/Quill)
- [ ] API REST pour consommation externe
- [ ] Tests unitaires et d'intégration
- [ ] Optimisation des images (compression, WebP)
- [ ] Mode sombre


## 🐛 Problèmes connus

Aucun problème connu pour le moment. Ouvrez une [issue](https://github.com/yolaub/monblog_express/issues) si vous rencontrez un bug.

## 📚 Ressources

- [Documentation Express v5](https://expressjs.com)
- [Documentation Mongoose](https://mongoosejs.com)
- [Documentation EJS](https://ejs.co)
- [Node.js v22 Documentation](https://nodejs.org/docs/latest-v22.x/api/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)


## 👤 Auteur

**Votre Nom**

- GitHub: YoLaub(https://github.com/yolaub)

## 🙏 Remerciements

- [Start Bootstrap](https://startbootstrap.com) pour le thème Clean Blog
- [MongoDB](https://www.mongodb.com) pour la base de données
- La communauté Node.js pour l'écosystème incroyable

***

⭐ **Si ce projet vous a aidé, n'oubliez pas de lui donner une étoile !**

***