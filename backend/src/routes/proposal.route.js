// /backend/src/routes/proposal.routes.js
import express from 'express';
import ProposalController from '../controllers/proposal.controller.js';
const ProposalRouter = express.Router();

// Receive vendor response (email)
ProposalRouter.post('/receive', ProposalController.receivePropasal);

// Get all proposals for an RFP
ProposalRouter.get('/rfp/:rfpId', ProposalController.getProposalsByRfpId);

// Get single proposal
ProposalRouter.get('/:id', ProposalController.getProposalById);

export default ProposalRouter;