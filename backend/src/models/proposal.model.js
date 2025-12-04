import mongoose from "mongoose";

const ProposalSchema = new mongoose.Schema(
  {
    rfpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rfp",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    pricing: {
      items: [
        {
          name: String,
          unitPrice: Number,
          quantity: Number,
          total: Number,
        },
      ],
      totalCost: Number,
    },
    terms: {
      deliveryDays: Number,
      paymentTerms: String,
      warranty: String,
    },
    rawEmail: String, // Store original email for reference
    aiSummary: String,
    aiScore: Number, // 0-100 score from AI
    status: {
      type: String,
      enum: ["received", "reviewed", "accepted", "rejected"],
      default: "received",
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Proposal = mongoose.model("Proposal", ProposalSchema);
export default Proposal;
