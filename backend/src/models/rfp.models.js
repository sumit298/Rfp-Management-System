import mongoose from "mongoose";

const RfpSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    requirements: {
      items: [
        {
          name: String,
          quantity: Number,
          specs: Number,
        },
      ],
      budget: Number,
      deliveryDays: Number,
      paymentTerms: String,
      warranty: String,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "closed"],
      default: "draft",
    },
    selectedVendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
      },
    ],
  },
  { timestamps: true }
);

const Rfp = mongoose.model("Rfp", RfpSchema);

export default Rfp;
