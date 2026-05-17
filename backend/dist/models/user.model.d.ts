import mongoose, { Document } from 'mongoose';
interface iUser extends Document {
    fullName: string;
    email: string;
    password: string;
}
declare const Users: mongoose.Model<iUser, {}, {}, {}, mongoose.Document<unknown, {}, iUser, {}, mongoose.DefaultSchemaOptions> & iUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, iUser>;
export default Users;
//# sourceMappingURL=user.model.d.ts.map