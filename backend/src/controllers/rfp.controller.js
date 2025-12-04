import mongoose from "mongoose";
import Rfp from "../models/rfp.models";

const RFPController = {
  createRfp: async (req, res) => {
    try {
      const { naturalLanguageInput } = req.body;

      // TODO: Call AI service to parse input
      // TODO: Save to database
      res.status(200).json({ message: "RFP created (stub)", success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  getAllRfp: async (req, res) => {
    try {
      const rfps = await Rfp.find();
      res.status(200).json({ data: rfps, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  getRfpById: async (req, res) => {
    try {
      const rfp = await Rfp.findById(req.params.id);
      if (!rfp) {
        return res.status(404).json({ error: "RFP not found", success: false });
      }
      res.status(200).json({ data: rfp, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  updateRfp: async (req, res) => {
    try {
      const rfp = await Rfp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!rfp) {
        return res.status(404).json({ error: "RFP not found", success: false });
      }
      res.status(200).json({ data: rfp, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  deleteRfp: async (req, res) => {
    try {
      const rfp = await Rfp.findByIdAndDelete(req.params.id);
      if (!rfp) {
        return res.status(404).json({ error: "RFP not found", success: false });
      }
      res.status(200).json({ message: "RFP deleted", success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  //send rfp to vendors
  sendRFPToVendors: async (req, res) => {
    try {
      const { id } = req.params;
      const { vendorIds } = req.body;

      // TODO: Fetch RFP and vendors
      // TODO: Call email service
      res.status(200).json({ message: "RFP sent to vendors", success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  //get comparison
  getComparison: async (req, res) => {
    try {
      const { id } = req.params;

      // TODO: Fetch proposals
      // TODO: Call AI service for comparison
      res.status(200).json({ message: "Comparison fetched", success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};


export default RFPController;