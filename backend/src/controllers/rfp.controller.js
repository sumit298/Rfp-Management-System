import mongoose from "mongoose";
import Rfp from "../models/rfp.models.js";
import Vendor from "../models/vendor.model.js";
import Proposal from "../models/proposal.model.js";
import { parseNaturalLanguageRFP, compareProposals } from "../services/ai.service.js";

import { sendRFPEmail } from "../config/email.js";

const RFPController = {
  createRfp: async (req, res) => {
    try {
      const { naturalLanguageInput } = req.body;

      // AI: Parse natural language to structured RFP
      const structuredRFP = await parseNaturalLanguageRFP(naturalLanguageInput);

      // Save to database
      const rfp = new Rfp(structuredRFP);
      await rfp.save();

      res.status(201).json({ data: rfp, success: true });
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

      // Fetch RFP
      const rfp = await Rfp.findById(id);
      if (!rfp) {
        return res.status(404).json({ error: "RFP not found", success: false });
      }

      // Fetch vendors
      const vendors = await Vendor.find({ _id: { $in: vendorIds } });
      if (vendors.length === 0) {
        return res.status(404).json({ error: "No vendors found", success: false });
      }

      // Send emails
      await sendRFPEmail(rfp, vendors);

      // Update RFP status
      rfp.status = "sent";
      rfp.selectedVendors = vendorIds;
      await rfp.save();

      res.status(200).json({ message: "RFP sent successfully", success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  //get comparison
  getComparison: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch RFP
      const rfp = await Rfp.findById(id);
      if (!rfp) {
        return res.status(404).json({ error: "RFP not found", success: false });
      }

      // Fetch all proposals for this RFP
      const proposals = await Proposal.find({ rfpId: id }).populate("vendorId");
      if (proposals.length === 0) {
        return res.status(404).json({ error: "No proposals found", success: false });
      }

      // AI: Compare and score proposals
      const comparison = await compareProposals(proposals, rfp.requirements);

      // Update proposals with AI scores
      for (const scored of comparison.scoredProposals) {
        await Proposal.findByIdAndUpdate(scored.proposalId, {
          aiScore: scored.aiScore,
          aiSummary: scored.aiSummary,
        });
      }

      // Fetch updated proposals
      const updatedProposals = await Proposal.find({ rfpId: id }).populate("vendorId");

      res.status(200).json({
        data: {
          proposals: updatedProposals,
          recommendation: comparison.recommendation,
        },
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};


export default RFPController;