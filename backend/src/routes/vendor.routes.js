// /backend/src/routes/vendor.routes.js
import express from "express";
const VendorRouter = express.Router();
import VendorController from "../controllers/vendor.controller.js";
// Create vendor
VendorRouter.post("/", VendorController.createVendor);

// Get all vendors
VendorRouter.get("/", VendorController.getAllVendors);

// Get single vendor
VendorRouter.get("/:id", VendorController.getVendorById);

// Update vendor
VendorRouter.put("/:id", VendorController.updateVendor);

// Delete vendor
VendorRouter.delete("/:id", VendorController.deleteVendor);

// Clear all vendors (for testing)
VendorRouter.delete("/", VendorController.clearAllVendors);

export default VendorRouter;
