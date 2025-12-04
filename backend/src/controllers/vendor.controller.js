import Vendor from "../models/vendor.model";

const VendorController = {
  createVendor: async (req, res) => {
    try {
      const vendorData = req.body;
      const vendor = new Vendor(vendorData);
      await vendor.save();
      res.status(201).json({ data: vendor, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  getAllVendors: async (req, res) => {
    try {
      const vendors = await Vendor.find();
      res.status(200).json({ data: vendors, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  getVendorById: async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id);
      if (!vendor) {
        return res
          .status(404)
          .json({ error: "Vendor not found", success: false });
      }
      res.status(200).json({ data: vendor, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  updateVendor: async (req, res) => {
    try {
      const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!vendor) {
        return res
          .status(404)
          .json({ error: "Vendor not found", success: false });
      }
      res.status(200).json({ data: vendor, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
  deleteVendor: async (req, res) => {
    try {
      const vendor = await Vendor.findByIdAndDelete(req.params.id);
      if (!vendor) {
        return res
          .status(404)
          .json({ error: "Vendor not found", success: false });
      }
      res.status(200).json({ message: "Vendor deleted", success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};

export default VendorController;
