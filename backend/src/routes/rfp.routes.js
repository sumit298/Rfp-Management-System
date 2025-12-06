// /backend/src/routes/rfp.routes.js
import express from "express";
const RFPRouter = express.Router();
import RFPController from "../controllers/rfp.controller.js";
// Create RFP from natural language
RFPRouter.post("/create", RFPController.createRfp);

// Get all RFPs
RFPRouter.get("/", RFPController.getAllRfp);

// Get single RFP
RFPRouter.get("/:id", RFPController.getRfpById);

// Send RFP to vendors
RFPRouter.post("/:id/send", RFPController.sendRFPToVendors);

// Get comparison for an RFP
RFPRouter.get("/:id/comparison", RFPController.getComparison);

export default RFPRouter;
