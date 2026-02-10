import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Le nom d d\'utilisateur est requis'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis']
    },
    role: {
        type: String,
        default: 'admin' // Pour ce projet, on part sur un rôle admin par défaut
    }
});

// Middleware Mongoose pour hacher le mot de passe
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User', UserSchema);
export default User;