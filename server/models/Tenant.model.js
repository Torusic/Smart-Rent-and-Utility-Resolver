import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: "LandLord", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, length: 10 },
  password: { type: String, required: true },
  refresh_token: { type: String, default: null },
  room: { type: String },
  role: { type: String, default: "tenant" },

  // Rent
  rent: { type: Number, default: 0 },
  rentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },

  // Payment Tracking
  payment: {
    totalRent: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    lastPaidAmount: { type: Number, default: 0 },
    lastPaidAt: { type: Date }
  },

  // Utilities
  utilities: {
    waterStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    water: {
      units: { type: Number, default: 0 },
      amount: { type: Number, default: 0 },
      token: { type: String, default: "" },
    },

    electricityStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    electricity: {
      units: { type: Number, default: 0 },
      amount: { type: Number, default: 0 },
      token: { type: String, default: "" },
    },
  },

  messages: [{
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],

  lastPayment: { type: Date },

}, { timestamps: true });

const TenantModel = mongoose.model("Tenant", tenantSchema);
export default TenantModel;
