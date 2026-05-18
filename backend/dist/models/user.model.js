import mongoose, { Schema, Document } from 'mongoose';
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['sales', 'admin']
    }
});
const UsersAssignment = mongoose.model('UsersAssignment', userSchema);
export default UsersAssignment;
//# sourceMappingURL=user.model.js.map