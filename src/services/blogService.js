import BlogPost from '../models/BlogPost.js';
import path from 'path';
import fs from 'fs/promises';
import {fileURLToPath} from 'url';
import sanitizeHtml from "sanitize-html";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- STANDARDISATION DES CHEMINS ---
const UPLOAD_BASE_DIR_RELATIVE = '/assets/img/uploads'; // Chemin relatif utilisé en BDD et dans les vues
const UPLOAD_DISK_PATH = path.join(__dirname, '../../public', UPLOAD_BASE_DIR_RELATIVE); // Chemin absolu sur le disque
const DEFAULT_IMAGE_RELATIVE_PATH = '/assets/img/home-bg.jpg'; // Chemin de l'image par défaut du modèle

export const blogService = {
    async getAllPosts(userId) {
        const filter = userId ? { userid: userId } : {};
        return BlogPost.find(filter).sort({datePosted: -1});
    },

    async getPostById(id) {
        return await BlogPost.findById(id);
    },

    async createPost({ title, body, userid }, imageFile) {
        let imagePathToStore = DEFAULT_IMAGE_RELATIVE_PATH; // Utilisation du chemin par défaut standardisé

        if (imageFile) {
            await fs.mkdir(UPLOAD_DISK_PATH, { recursive: true }); // Crée le dossier si inexistant

            const timestamp = Date.now();
            const safeName = imageFile.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
            const fileName = `${timestamp}-${safeName}`;
            const uploadFullPath = path.join(UPLOAD_DISK_PATH, fileName);

            await imageFile.mv(uploadFullPath);
            imagePathToStore = `${UPLOAD_BASE_DIR_RELATIVE}/${fileName}`; // Chemin relatif pour la base de données
        }

        const cleanBody = sanitizeHtml(body, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'p', 'b', 'i', 'strong', 'em', 'a', 'ul', 'ol', 'li']),
            allowedAttributes: {
                a: ['href', 'name', 'target'],
                img: ['src', 'alt', 'title']
            }
        });

        return await BlogPost.create({
            title,
            body: cleanBody,
            image: imagePathToStore,
            userid
        });
    },

    async updatePost(id, postData, file) {
        const post = await BlogPost.findById(id);
        if (!post) throw new Error('Post introuvable');

        let imagePathToStore = post.image; // Conserve l'image existante si aucun nouveau fichier

        if (file) {
            if (post.image && post.image !== DEFAULT_IMAGE_RELATIVE_PATH) {
                const oldPathOnDisk = path.join(__dirname, '../../public', post.image);
                await fs.unlink(oldPathOnDisk).catch((err) => {
                    if (err.code !== 'ENOENT') { // Ignore les erreurs "fichier non trouvé"
                        console.warn(`Failed to delete old image ${oldPathOnDisk}:`, err);
                    }
                });
            }

            await fs.mkdir(UPLOAD_DISK_PATH, { recursive: true }); // Crée le dossier si inexistant

            const timestamp = Date.now();
            const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
            const fileName = `${timestamp}-${safeName}`;
            const uploadFullPath = path.join(UPLOAD_DISK_PATH, fileName);

            await file.mv(uploadFullPath);
            imagePathToStore = `${UPLOAD_BASE_DIR_RELATIVE}/${fileName}`;
        }

        // Applique la sanitisation au corps de l'article lors de la mise à jour
        const updatedBody = postData.body ? sanitizeHtml(postData.body, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'p', 'b', 'i', 'strong', 'em', 'a', 'ul', 'ol', 'li']),
            allowedAttributes: {
                a: ['href', 'name', 'target'],
                img: ['src', 'alt', 'title']
            }
        }) : post.body;

        return BlogPost.findByIdAndUpdate(id,
            {...postData, body: updatedBody, image: imagePathToStore},
            {new: true, runValidators: true}
        );
    },

    async deletePost(id) {
        const post = await BlogPost.findById(id);
        if (!post) return null;

        // Supprime l'image du disque si ce n'est pas l'image par défaut
        if (post.image && post.image !== DEFAULT_IMAGE_RELATIVE_PATH) {
            const imagePathOnDisk = path.join(__dirname, '../../public', post.image);
            await fs.unlink(imagePathOnDisk).catch((err) => {
                if (err.code !== 'ENOENT') {
                    console.warn(`Failed to delete image ${imagePathOnDisk}:`, err);
                }
            });
        }

        return await BlogPost.findByIdAndDelete(id);
    }
};