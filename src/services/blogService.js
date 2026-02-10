import BlogPost from '../models/BlogPost.js';
import path from 'path';
import fs from 'fs/promises'; // Import pour la suppression en cas d'erreur
import { fileURLToPath } from 'url';
import sanitizeHtml from "sanitize-html";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const blogService = {
    async getAllPosts() {
        return await BlogPost.find({}).sort({ datePosted: -1 }).lean();
    },

    async getPostById(id) {
        return await BlogPost.findById(id);
    },

    async createPost({ title, body }, imageFile) {
        // image par défaut (optionnelle)
        let imagePath = '/img/uploads/default.jpg';

        if (imageFile) {
            const timestamp = Date.now();
            const safeName = imageFile.name.replace(/\s+/g, '_');
            const fileName = `${timestamp}-${safeName}`;

            // Fichier physique : public/img/uploads/...
            const uploadPath = path.join(__dirname, '../../public/img/uploads', fileName);

            await imageFile.mv(uploadPath);

            // Chemin web stocké en BDD
            imagePath = `/img/uploads/${fileName}`;
        }

        const cleanBody = sanitizeHtml(postData.body, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2']),
            allowedAttributes: { 'a': ['href', 'name', 'target'] }
        });

        const blogpost = await BlogPost.create({
            title,
            cleanBody,
            image: imagePath
        });

        return blogpost;
    },

    async updatePost(id, postData, file) {
        const post = await BlogPost.findById(id);
        if (!post) throw new Error('Post introuvable');

        let imagePath = post.image;

        if (file) {
            // Supprimer l'ancienne image du disque si ce n'est pas l'image par défaut
            if (post.image && post.image !== '/assets/img/home-bg.jpg') {
                const oldPath = path.join(__dirname, '../../public', post.image);
                await fs.unlink(oldPath).catch(() => {});
            }

            const timestamp = Date.now();
            const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
            const fileName = `${timestamp}-${safeName}`;
            const uploadPath = path.join(__dirname, '../../public/assets/img/uploads', fileName);

            await file.mv(uploadPath);
            imagePath = `/assets/img/uploads/${fileName}`;
        }

        return await BlogPost.findByIdAndUpdate(id, { ...postData, image: imagePath }, { new: true });
    },

    async deletePost(id) {
        const post = await BlogPost.findById(id);
        if (!post) return null;

        // Supprimer l'image du disque
        if (post.image && post.image !== '/assets/img/home-bg.jpg') {
            const imagePathOnDisk = path.join(__dirname, '../../public', post.image);
            await fs.unlink(imagePathOnDisk).catch(() => {});
        }

        return await BlogPost.findByIdAndDelete(id);
    }
};