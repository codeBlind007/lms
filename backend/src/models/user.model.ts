import mongoose, {Schema, Document} from 'mongoose';

interface iUser extends Document {
    fullName: string,
    email: string,
    password: string,
    role: 'admin' | 'sales'
}

const userSchema: Schema<iUser> =  new Schema({
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
})

const UsersAssignment = mongoose.model<iUser>('UsersAssignment', userSchema);

export default UsersAssignment;