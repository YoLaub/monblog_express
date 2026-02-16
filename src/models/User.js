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
        required: [true, 'Le mot de passe est requis'],
        minlength: [8, 'Le mot de passe doit faire au moins 8 caractères']
    },
    role: {
        type: String,
        default: 'admin'
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User', UserSchema);
export default User;