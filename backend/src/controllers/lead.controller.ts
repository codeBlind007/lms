import type { Response, Request, NextFunction} from "express";
import Leads from "../models/lead.model.js";
import type { IUser } from "../types/custom.types.js";
import AppError from "../utils/AppError.js";

const createLead = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as IUser;
        if(!user){
            return next(new AppError("Unauthorized", 401));
        }

        let  {name, email, status, source} = req.body;
        if(!name || !email || !status || !source){
            return next(new AppError("All fields are required", 400));
        }
        status = status.toLowerCase(status);
        source = source.toLowerCase(source);

        const lead = await Leads.create({name, email, status, source});
      
        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            lead
        })

    } catch (error) {
        console.log(error);
        next(new AppError("Lead creation failed, Try again Later!", 500));
    }
}

const getLeads = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as IUser;

        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }

        const page = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // filters
        const status = req.query.status as string;
        const source = req.query.source as string;
        const search = req.query.search as string;
        const sort = req.query.sort as string;

      
        const query: any = {};

        if (status) {
            query.status = status;
        }

        // filter by source
        if (source) {
            query.source = source;
        }

        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        let sortOption = {};

        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        // get leads
        const leads = await Leads.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        // total documents
        const totalLeads = await Leads.countDocuments(query);

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalLeads / limit),
            totalLeads,
            count: leads.length,
            leads
        });

    } catch (error) {
        next(error);
    }
};

const getSingleLead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as IUser;

        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }

        const { id } = req.params;

        const lead = await Leads.findById(id);

        if (!lead) {
            return next(new AppError("Lead not found", 404));
        }

        return res.status(200).json({
            success: true,
            lead
        });

    } catch (error) {
        next(error);
    }
};

const deleteLead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as IUser;
        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }

        // role based access control
        if (user.role !== "admin") {
            return next(
                new AppError(
                    "Access denied. Only admin can delete leads",
                    403
                )
            );
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
            message: "Lead deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

const updateLead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as IUser;

        // check authentication
        if (!user) {
            return next(new AppError("Unauthorized", 401));
        }

        // both Admin and Sales can update
        if (
            user.role !== "admin" &&
            user.role !== "sales"
        ) {
            return next(
                new AppError("Access denied", 403)
            );
        }

        const { id } = req.params;

        const {
            name,
            email,
            status,
            source
        } = req.body;

        // find lead
        const lead = await Leads.findById(id);

        if (!lead) {
            return next(new AppError("Lead not found", 404));
        }

        // update fields only if provided
        if (name) lead.name = name;
        if (email) lead.email = email;
        if (status) lead.status = status.toLowerCase(status);
        if (source) lead.source = source.toLowerCase(source);

        await lead.save();

        return res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            lead
        });

    } catch (error) {
        next(error);
    }
};

const leadController = {
    createLead, 
    getLeads,
    getSingleLead,
    deleteLead,
    updateLead
}

export default leadController;