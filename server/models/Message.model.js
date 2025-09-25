import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel", // could be landlord or tenant
      required: true,
    },
    senderModel: {
      type: String,
      enum: ["LandLord", "Tenant"],
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "receiverModel",
      required: true,
    },
    receiverModel: {
      type: String,
      enum: ["LandLord", "Tenant"],
      required: true,
    },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MessageModel=mongoose.model("Message",messageSchema)
export default MessageModel;