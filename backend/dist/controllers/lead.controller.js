import Leads from "../models/lead.model.js";
import AppError from "../utils/AppError.js";
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const nameHasNoNumbers = (name) => !/\d/.test(name);
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const sanitizeLower = (v) => typeof v === "string" ? v.trim().toLowerCase() : undefined;
const allowedStatus = ["new", "contacted", "qualified", "lost"];
const allowedSource = ["website", "instagram", "referral"];
const createLead = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }
        let { name, email, status, source } = req.body;
        if (!isNonEmptyString(name) ||
            !isNonEmptyString(email) ||
            !isNonEmptyString(status) ||
            !isNonEmptyString(source)) {
            return next(new AppError("All fields are required and must be valid strings", 400));
        }
        if (!nameHasNoNumbers(name)) {
            return next(new AppError("Name must not contain numbers", 400));
        }
        if (!isValidEmail(email)) {
            return next(new AppError("Invalid email format", 400));
        }
        status = sanitizeLower(status);
        source = sanitizeLower(source);
        if (!allowedStatus.includes(status)) {
            return next(new AppError("Invalid status value", 400));
        }
        if (!allowedSource.includes(source)) {
            return next(new AppError("Invalid source value", 400));
        }
        const lead = await Leads.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            status: status,
            source: source,
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
        const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const status = sanitizeLower(req.query.status ?? undefined);
        const source = sanitizeLower(req.query.source ?? undefined);
        const search = isNonEmptyString(req.query.search)
            ? req.query.search.trim()
            : undefined;
        const sort = isNonEmptyString(req.query.sort)
            ? req.query.sort.trim()
            : undefined;
        const query = {};
        if (user.role !== "admin") {
            query.createdBy = user.id;
        }
        if (status) {
            if (!allowedStatus.includes(status)) {
                return next(new AppError("Invalid status filter", 400));
            }
            query.status = status;
        }
        if (source) {
            if (!allowedSource.includes(source)) {
                return next(new AppError("Invalid source filter", 400));
            }
            query.source = source;
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
        if (user.role !== "admin") {
            return next(new AppError("Access denied. Only admin can delete leads", 403));
        }
        const { id } = req.params;
        // find lead
        const lead = await Leads.findById(id);
        if (!lead) {
            return next(new AppError("Lead not found", 404));
        }
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
        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }
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
        if (name !== undefined) {
            if (!isNonEmptyString(name)) {
                return next(new AppError("Name must be a non-empty string", 400));
            }
            if (!nameHasNoNumbers(name)) {
                return next(new AppError("Name must not contain numbers", 400));
            }
            lead.name = name.trim();
        }
        if (email !== undefined) {
            if (!isNonEmptyString(email) || !isValidEmail(email)) {
                return next(new AppError("Invalid email format", 400));
            }
            lead.email = email.trim().toLowerCase();
        }
        if (status !== undefined) {
            const s = sanitizeLower(status);
            if (!s)
                return next(new AppError("Status must be a string", 400));
            if (!allowedStatus.includes(s)) {
                return next(new AppError("Invalid status value", 400));
            }
            lead.status = s;
        }
        if (source !== undefined) {
            const src = sanitizeLower(source);
            if (!src)
                return next(new AppError("Source must be a string", 400));
            if (!allowedSource.includes(src)) {
                return next(new AppError("Invalid source value", 400));
            }
            lead.source = src;
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