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
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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

BlogPostSchema.virtual('excerpt').get(function() {
    const plain = (this.body || '').replace(/<[^>]*>/g, '');
    return plain.length > 103 ? plain.slice(0, 103) + '...' : plain;
});

BlogPostSchema.statics.getRecentByUser = function(userId, limit = 10) {
    return this.find({ userid: userId })
        .sort({ datePosted: -1 })
        .limit(limit)
        .lean();
};

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost;
