import type { Response, Request, NextFunction } from "express";
import Leads from "../models/lead.model.js";
import type { ILeads } from "../models/lead.model.js";
import type { IUser } from "../types/custom.types.js";
import AppError from "../utils/AppError.js";

type LeadListQuery = Record<string, unknown>;

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

const nameHasNoNumbers = (name: string) => !/\d/.test(name);

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const sanitizeLower = (v: unknown) =>
  typeof v === "string" ? v.trim().toLowerCase() : undefined;


const allowedStatus = ["new", "contacted", "qualified", "lost"] as const;
const allowedSource = ["website", "instagram", "referral"] as const;

const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    if (!user) {
      return next(new AppError("Unauthorized", 401));
    }

    let { name, email, status, source } = req.body;
    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(email) ||
      !isNonEmptyString(status) ||
      !isNonEmptyString(source)
    ) {
      return next(
        new AppError("All fields are required and must be valid strings", 400),
      );
    }

    if (!nameHasNoNumbers(name)) {
      return next(new AppError("Name must not contain numbers", 400));
    }

    if (!isValidEmail(email)) {
      return next(new AppError("Invalid email format", 400));
    }

    status = sanitizeLower(status) as string;
    source = sanitizeLower(source) as string;

    if (!allowedStatus.includes(status as (typeof allowedStatus)[number])) {
      return next(new AppError("Invalid status value", 400));
    }

    if (!allowedSource.includes(source as (typeof allowedSource)[number])) {
      return next(new AppError("Invalid source value", 400));
    }

    const lead = await Leads.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status: status as ILeads["status"],
      source: source as ILeads["source"],
      createdBy: user.id,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("Lead creation failed, Try again Later!", 500));
  }
};

const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;

    if (!user) {
      return next(new AppError("Unauthorized", 401));
    }

    const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
    const limit = 10;
    const skip = (page - 1) * limit;


    const status = sanitizeLower((req.query.status as unknown) ?? undefined) as
      | string
      | undefined;
    const source = sanitizeLower((req.query.source as unknown) ?? undefined) as
      | string
      | undefined;
    const search = isNonEmptyString(req.query.search)
      ? (req.query.search as string).trim()
      : undefined;
    const sort = isNonEmptyString(req.query.sort)
      ? (req.query.sort as string).trim()
      : undefined;

    const query: LeadListQuery = {};

    if (user.role !== "admin") {
      query.createdBy = user.id;
    }

    if (status) {
      if (!allowedStatus.includes(status as (typeof allowedStatus)[number])) {
        return next(new AppError("Invalid status filter", 400));
      }

      query.status = status as LeadListQuery["status"];
    }

    if (source) {
      if (!allowedSource.includes(source as (typeof allowedSource)[number])) {
        return next(new AppError("Invalid source filter", 400));
      }

      query.source = source as LeadListQuery["source"];
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
    } else {
      sortOption = { createdAt: -1 };
    }

    const leads = await Leads.find(query as never)
      .populate("createdBy", "fullName email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalLeads = await Leads.countDocuments(query as never);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalLeads / limit),
      totalLeads,
      count: leads.length,
      leads,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as IUser;

    if (!user) {
      return next(new AppError("Unauthorized", 401));
    }

    const leadId = String(req.params.id);

    if (!leadId) {
      return next(new AppError("Lead not found", 404));
    }

    let lead;

    if (user.role === "admin") {
      lead = await Leads.findById(leadId).populate(
        "createdBy",
        "fullName email",
      );
    } else {
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
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    if (!user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (user.role !== "admin") {
      return next(
        new AppError("Access denied. Only admin can delete leads", 403),
      );
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
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
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
    } else {
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
      if (!isNonEmptyString(email) || !isValidEmail(email as string)) {
        return next(new AppError("Invalid email format", 400));
      }

      lead.email = (email as string).trim().toLowerCase();
    }

    if (status !== undefined) {
      const s = sanitizeLower(status);
      if (!s) return next(new AppError("Status must be a string", 400));
      if (!allowedStatus.includes(s as (typeof allowedStatus)[number])) {
        return next(new AppError("Invalid status value", 400));
      }
      lead.status = s as ILeads["status"];
    }

    if (source !== undefined) {
      const src = sanitizeLower(source);
      if (!src) return next(new AppError("Source must be a string", 400));
      if (!allowedSource.includes(src as (typeof allowedSource)[number])) {
        return next(new AppError("Invalid source value", 400));
      }
      lead.source = src as ILeads["source"];
    }

    await lead.save();

    await lead.populate("createdBy", "fullName email");

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead,
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
  updateLead,
};

export default leadController;
