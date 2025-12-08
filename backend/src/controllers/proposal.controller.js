import Proposal from "../models/proposal.model.js";
import Rfp from "../models/rfp.models.js";
import { parseVendorProposal } from "../services/ai.service.js";

const ProposalController = {
  receivePropasal: async (req, res) => {
    try {
      const { emailContent, rfpId, vendorId, vendorEmail } = req.body;

      // Fetch RFP requirements
      const rfp = await Rfp.findById(rfpId);
      if (!rfp) {
        return res.status(404).json({ error: "RFP not found", success: false });
      }

      // Find vendor by email if vendorId not provided
      let finalVendorId = vendorId;
      if (!finalVendorId && vendorEmail) {
        const Vendor = (await import("../models/vendor.model.js")).default;
        const vendor = await Vendor.findOne({ email: vendorEmail });
        if (vendor) {
          finalVendorId = vendor._id;
        }
      }

      // AI: Parse email content
      const parsedProposal = await parseVendorProposal(emailContent, rfp.requirements);

      // Save proposal
      const proposal = new Proposal({
        rfpId,
        vendorId: finalVendorId,
        ...parsedProposal,
        rawEmail: emailContent,
        status: "received",
      });
      await proposal.save();

      res.status(201).json({ data: proposal, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  getProposalsByRfpId: async (req, res) => {
    try {
      const { rfpId } = req.params;
      const proposals = await Proposal.find({ rfpId }).populate("vendorId");
      res.status(200).json({ data: proposals, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  getProposalById: async (req, res) => {
    try {
      const { id } = req.params;
      const proposal = await Proposal.findById(id);
      if (!proposal) {
        return res
          .status(404)
          .json({ error: "Proposal not found", success: false });
      }
      res.status(200).json({ data: proposal, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  updateProposal: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProposal = await Proposal.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedProposal) {
        return res
          .status(404)
          .json({ error: "Proposal not found", success: false });
      }
      res.status(200).json({ data: updatedProposal, success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },

  deleteProposal: async (req, res) => {
    try {
      const { id } = req.params;
      const proposal = await Proposal.findByIdAndDelete(id);
      if (!proposal) {
        return res
          .status(404)
          .json({ error: "Proposal not found", success: false });
      }
      res.status(200).json({ message: "Proposal deleted", success: true });
    } catch (error) {
      res.status(500).json({ error: error.message, success: false });
    }
  },
};


export default ProposalController;