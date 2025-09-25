import mongoose from "mongoose";

const LandLordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      length: 10,
    },

    password: {
      type: String,
      required: true,
    },

    verify_email: {
      type: Boolean,
      default: false,
    },

    refresh_token: {
      type: String,
      default: null,
    },

    last_login_date: {
      type: Date,
      default: null,
    },

    forgot_password_otp: {
      type: String,
      default: null,
    },

    forgot_password_expiry: {
      type: Date,
      default: null,
    },

    // Tenants linked to this landlord
    Tenant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
      },
    ],

    // Total number of rooms landlord owns
    totalRooms: {
      type: Number,
      default: 0,
    },

    // Track how many are currently rented
    rentedRooms: {
      type: Number,
      default: 0,
    },

    // Vacant rooms auto-calculated from totalRooms - rentedRooms
    vacantRooms: {
      type: Number,
      default: 0,
    },

    role:{
      type:String,
      default:"landlord"

    },
    messages:[
      {
        content:{
          type:String,
          
        },
        date:{
          type:Date,
          default:Date.now()
        },
        
      }
    ],

    // Utilities tracking (for dashboard graph)
    utilities: {
      rent: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      electricity: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Before saving, auto-calculate vacantRooms
LandLordSchema.pre("save", function (next) {
  this.vacantRooms = this.totalRooms - this.rentedRooms;
  if (this.vacantRooms < 0) this.vacantRooms = 0;
  next();
});


const LandLord =mongoose.model("LandLord", LandLordSchema);
export default LandLord;
