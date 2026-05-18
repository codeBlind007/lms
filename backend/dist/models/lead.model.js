import mongoose, { Schema, Document } from 'mongoose';
const leadSchema = new Schema({
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UsersAssignment",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Leads = mongoose.model("Leads", leadSchema);
export default Leads;
//# sourceMappingURL=lead.model.js.map