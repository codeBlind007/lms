import Leads from "../models/lead.model.js";
import AppError from "../utils/AppError.js";
const createLead = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }
        let { name, email, status, source } = req.body;
        if (!name || !email || !status || !source) {
            return next(new AppError("All fields are required", 400));
        }
        status = status.toLowerCase(status);
        source = source.toLowerCase(source);
        const lead = await Leads.create({
            name,
            email,
            status,
            source,
            createdBy: user.id,
        });
        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            lead,
        });
    }
    catch (error) {
        console.log(error);
        next(new AppError("Lead creation failed, Try again Later!", 500));
    }
};
const getLeads = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        // filters
        const status = req.query.status;
        const source = req.query.source;
        const search = req.query.search;
        const sort = req.query.sort;
        const query = {};
        if (user.role !== "admin") {
            query.createdBy = user.id;
        }
        if (status) {
            query.status = status.toLowerCase();
        }
        if (source) {
            query.source = source.toLowerCase();
        }
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
        let sortOption = {};
        if (sort && sort.toLowerCase() === "oldest") {
            sortOption = { createdAt: 1 };
        }
        else {
            sortOption = { createdAt: -1 };
        }
        const leads = await Leads.find(query)
            .populate("createdBy", "fullName email")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);
        const totalLeads = await Leads.countDocuments(query);
        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalLeads / limit),
            totalLeads,
            count: leads.length,
            leads,
        });
    }
    catch (error) {
        next(error);
    }
};
const getSingleLead = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }
        const leadId = String(req.params.id);
        if (!leadId) {
            return next(new AppError("Lead not found", 404));
        }
        let lead;
        if (user.role === "admin") {
            lead = await Leads.findById(leadId).populate("createdBy", "fullName email");
        }
        else {
            lead = await Leads.findOne({
                _id: leadId,
                createdBy: user.id,
            }).populate("createdBy", "fullName email");
        }
        if (!lead) {
            return next(new AppError("Lead not found", 404));
        }
        return res.status(200).json({
            success: true,
            lead,
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteLead = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }
        // role based access control
        if (user.role !== "admin") {
            return next(new AppError("Access denied. Only admin can delete leads", 403));
        }
        const { id } = req.params;
        // find lead
        const lead = await Leads.findById(id);
        if (!lead) {
            return next(new AppError("Lead not found", 404));
        }
        // delete lead
        await lead.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Lead deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
const updateLead = async (req, res, next) => {
    try {
        const user = req.user;
        // authentication check
        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }
        // role check
        if (user.role !== "admin" && user.role !== "sales") {
            return next(new AppError("Access denied", 403));
        }
        const { id } = req.params;
        if (!id) {
            return next(new AppError("Lead Id is required", 400));
        }
        const leadId = String(id);
        const { name, email, status, source } = req.body;
        let lead;
        if (user.role === "admin") {
            lead = await Leads.findById(leadId);
        }
        else {
            lead = await Leads.findOne({
                _id: leadId,
                createdBy: user.id,
            });
        }
        if (!lead) {
            return next(new AppError("Lead not found or access denied", 404));
        }
        if (name) {
            lead.name = name;
        }
        if (email) {
            lead.email = email;
        }
        if (status) {
            lead.status = status.toLowerCase();
        }
        if (source) {
            lead.source = source.toLowerCase();
        }
        await lead.save();
        await lead.populate("createdBy", "fullName email");
        return res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            lead,
        });
    }
    catch (error) {
        next(error);
    }
};
const leadController = {
    createLead,
    getLeads,
    getSingleLead,
    deleteLead,
    updateLead,
};
export default leadController;
//# sourceMappingURL=lead.controller.js.map