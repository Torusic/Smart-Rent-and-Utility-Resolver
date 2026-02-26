import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  landlord: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "LandLord",
     required: true
     },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String,
     required: true,
      unique: true
     },
  phone: {
      type: String,
      required: true,
      unique: true,
      length: 10,
    },
  password: {
     type: String,
      required: true
     },
  refresh_token: { 
    type: String, 
    default: null
   },
  room: { 
    type: String
   },
  role: { 
    type: String, 
    default: "tenant"
   },

  // Rent
  rent: { 
    type: Number,
     default: 0 
    },
  rentStatus: { 
    type: String, 
    enum: ["Paid", "Unpaid", "Partially Paid"], 
    default: "Unpaid" 
  },
 deviceId: {
  type: String,
  default: null
},

relay: {
  electricity: { 
    type: Boolean,
     default: false },
  water: { 
    type: Boolean,
     default: false
     }
},

 // Payment Tracking
 // Payment Tracking
payment: {
  totalRent: {
    type: Number,
    default: 0
  },

  amountPaid: {
    type: Number,
    default: 0
  },

  balance: {
    type: Number,
    default: 0
  },

  lastPaidAmount: {
    type: Number,
    default: 0
  },

  lastPaidAt: {
    type: Date
  },

  history: [
    {
      description: String,

      amount: Number,

      status: {
        type: String,
        enum: ["SUCCESS", "FAILED", "PENDING"],
        default: "PENDING"
      },

      date: {
        type: Date,
        default: Date.now
      },

      transactionId: String
    }
  ]
},

// Utilities
utilities: {
  waterStatus: {
    type: String,
    enum: ["ON", "OFF"],
    default: "OFF"
  },

  water: {
    units: {
      type: Number,
      default: 0
    },

    amount: {
      type: Number,
      default: 0
    },

    token: {
      type: String,
      default: ""
    }
  },

  electricityStatus: {
    type: String,
    enum: ["ON", "OFF"],
    default: "OFF"
  },

  electricity: {
    units: {
      type: Number,
      default: 0
    },

    amount: {
      type: Number,
      default: 0
    },

    token: {
      type: String,
      default: ""
    }
  }
},
  billing: {
  billingDay: {
    type: Number, // 1–31
  },
  lastBilledAt: {
    type: Date,
    default: null
  }
},

  messages: [{
    content: {
       type: String, 
       required: true 
      },
    date: {
       type: Date,
        default: Date.now
       },
    read: { 
      type: Boolean,
       default: false 
      },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
  }],

  lastPayment: { type: Date },

}, { timestamps: true });

const TenantModel = mongoose.model("Tenant", tenantSchema);
export default TenantModel;
