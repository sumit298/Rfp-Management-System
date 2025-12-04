import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: String,
    contactPerson: String,
    company: String,
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", VendorSchema);
export default Vendor;