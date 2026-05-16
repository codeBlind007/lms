import mongoose, {Schema, Document} from 'mongoose';

interface iUser extends Document {
    fullName: string,
    email: string,
    password: string
}

const userSchema: Schema<iUser> =  new Schema({
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
})

const Users = mongoose.model<iUser>('Users', userSchema);

export default Users;