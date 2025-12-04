import Proposal from "../models/proposal.model";

const ProposalController = {
  receivePropasal: (req, res) => {
    try {
      const { emailContent, rfpId, vendorId } = req.body;

      // TODO: Call AI service to parse email
      // TODO: Save proposal to database

      res.json({ message: "Proposal received (stub)" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProposalsByRfpId: async (req, res) => {
    try {
      const { rfpId } = req.params;
      const proposals = await Proposal.find({ rfpId });
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