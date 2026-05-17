import mongoose, { Document } from 'mongoose';
export interface ILeads extends Document {
    name: string;
    email: string;
    status: 'new' | 'contacted' | 'qualified' | 'lost';
    source: 'website' | 'instagram' | 'referral';
    createdAt: Date;
}
declare const Leads: mongoose.Model<ILeads, {}, {}, {}, mongoose.Document<unknown, {}, ILeads, {}, mongoose.DefaultSchemaOptions> & ILeads & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILeads>;
export default Leads;
//# sourceMappingURL=lead.model.d.ts.map