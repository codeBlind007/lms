import mongoose, {Schema, Document} from 'mongoose';


export interface ILeads extends Document {
    name: string,
    email: string,
    status: 'new' | 'contacted' | 'qualified' | 'lost',
    source: 'website' | 'instagram' | 'referral',
    createdAt: Date
}

const leadSchema = new Schema<ILeads>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'lost'],
        required: true
    },
    source: {
        type: String,
        enum: ['website', 'instagram', 'referral'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Leads = mongoose.model<ILeads>("Leads", leadSchema);

export default Leads;