import mongoose from "mongoose";

const mpesaSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LandLord",
      required: true,
    },

    phone: {
      type: String,
      required: true,
      length: 10,
    },

    amount: {
      type: Number,
      required: true,
    },

    receiptNumber: {
      type: String,
      required: true,
      unique: true, // M-Pesa code like QHX7Y8K9P
    },

    transactionDate: {
      type: Date,
      required: true,
    },

    checkoutRequestID: {
      type: String, // from STK push response
    },

    merchantRequestID: {
      type: String,
    },

    paymentType: {
      type: String,
      enum: ["Rent", "Water", "Electricity"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },

    rawCallback: {
      type: Object, 
    },
  },
  { timestamps: true }
);

const MpesaTransaction = mongoose.model("MpesaTransaction", mpesaSchema);
export default MpesaTransaction;
