import mongoose, { Schema, Document } from 'mongoose';
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const Users = mongoose.model('Users', userSchema);
export default Users;
//# sourceMappingURL=user.model.js.map