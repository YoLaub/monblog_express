import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est obligatoire'],
        trim: true,
        maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
    },
    body: {
        type: String,
        required: [true, 'Le contenu est obligatoire'],
        trim: true
    },
    image: {
        type: String,
        default: '/assets/img/home-bg.jpg',
        trim: true
    },
    datePosted: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index pour améliorer les performances de recherche
BlogPostSchema.index({ title: 'text', body: 'text' });
BlogPostSchema.index({ datePosted: -1 });

// Virtuel pour formater la date
BlogPostSchema.virtual('formattedDate').get(function() {
    return this.datePosted.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Méthode pour tronquer le contenu
BlogPostSchema.methods.getExcerpt = function(length = 150) {
    return this.body.length > length
        ? this.body.substring(0, length) + '...'
        : this.body;
};

// Méthode statique pour récupérer les posts récents
BlogPostSchema.statics.getRecent = function(limit = 10) {
    return this.find()
        .sort({ datePosted: -1 })
        .limit(limit)
        .lean(); // lean() pour de meilleures performances
};

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost;
