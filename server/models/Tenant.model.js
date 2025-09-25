import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "LandLord", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, length: 10 },
    password: { type: String, required: true },
    refresh_token: { type: String, default: null },
    room: { type: String },
    role: {
      type: String,
      default: "tenant",
    },
    rent: { type: Number, default: 0 },
    rentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    utilities: {
      water: { type: String, default: "Unpaid" },
      waterStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
      electricity: { type: String, default: "Unpaid" },
      elecricityStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    },

    // ✅ embed messages correctly
    messages: [
      {
        content: { type: String, required: true },
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }, // ✅ fixed
      },
    ],

    lastPayment: { type: Date },
  },
  { timestamps: true } // auto adds createdAt & updatedAt for tenant itself
);

const TenantModel = mongoose.model("Tenant", tenantSchema);
export default TenantModel;
