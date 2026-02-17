import axios from "axios";
import TenantModel from "../models/Tenant.model.js";
import { io } from "../server.js";


export async function startPayment(req, res) {
  try {
    const tenantId = req.userId;
    const { amount } = req.body;

    const tenant = await TenantModel.findById(tenantId).populate("landlord");
    if (!tenant) return res.status(400).json({ message: "Tenant not found", error: true });

    const landlordShortcode = tenant.landlord?.paybill || process.env.MPESA_PAYBILL;
    const passKey = tenant.landlord?.passKey || process.env.MPESA_PASS_KEY;

    if (!landlordShortcode || !passKey) {
      return res.status(400).json({ message: "Landlord M-Pesa not configured", error: true });
    }

    const phone = tenant.phone.startsWith("0") ? tenant.phone.slice(1) : tenant.phone;

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password = Buffer.from(landlordShortcode + passKey + timestamp).toString("base64");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: landlordShortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: landlordShortcode,
        PhoneNumber: `254${phone}`,
        CallBackURL: "https://yourdomain.com/api/mpesa/callback",
        AccountReference: tenant._id.toString(), 
        TransactionDesc: "House Rent"
      },
      {
        headers: {
          Authorization: `Bearer ${req.mpesaToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json({
      message: "STK Push sent to your phone",
      success: true,
      data: response.data
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    return res.status(500).json({ error: "STK Push failed" });
  }
}


{/** 
export async function mpesaCallback(req, res) {
  try {
    const data = req.body;

    if (!data.stkCallback) {
      return res.status(400).json({ message: "Invalid callback data", error: true });
    }

    const callback = data.stkCallback;

    const tenantId = callback.AccountReference;
    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found", error: true });
    }

    // Only process successful transactions
    if (callback.ResultCode === 0) {
      const items = callback.CallbackMetadata.Item;

      const amountPaidItem = items.find(i => i.Name === "Amount");
      const mpesaReceiptItem = items.find(i => i.Name === "MpesaReceiptNumber");

      const amountPaid = amountPaidItem ? amountPaidItem.Value : 0;
      const receipt = mpesaReceiptItem ? mpesaReceiptItem.Value : "";

      // Update tenant payment
      tenant.payment = tenant.payment || {};
      tenant.payment.amountPaid = (tenant.payment.amountPaid || 0) + amountPaid;
      tenant.payment.balance = (tenant.rent || 0) - tenant.payment.amountPaid;
          if (tenant.payment.balance <= 0) {
            tenant.rentStatus = "Paid";
          } else if (tenant.payment.amountPaid > 0) {
            tenant.rentStatus = "Partially Paid";
          } else {
            tenant.rentStatus = "Unpaid";
          }


      await tenant.save();

      return res.status(200).json({ message: "Callback processed successfully", success: true });
    } else {
      return res.status(400).json({ message: "Payment failed or cancelled", error: true });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Callback processing failed", error: true });
  }
}*/}


export async function mpesaCallback(req, res) {
  try {
    const body = req.body;

    const result =
      body?.Body?.stkCallback ||
      body?.stkCallback ||
      body;

    if (!result || result.ResultCode === undefined) {
      return res.status(400).json({
        message: "Invalid callback structure",
        error: true,
        success: false
      });
    }

    if (result.ResultCode !== 0) {
      return res.status(400).json({
        message: "Payment failed or cancelled",
        error: true,
        success: false
      });
    }

    const items = result.CallbackMetadata?.Item || [];
    const amount = items.find(i => i.Name === "Amount")?.Value || 0;
    const receipt = items.find(i => i.Name === "MpesaReceiptNumber")?.Value || "";
    const phone = items.find(i => i.Name === "PhoneNumber")?.Value || "";

    const tenant = await TenantModel.findById(result.AccountReference);

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
        error: true,
        success: false
      });
    }

    tenant.payment.amountPaid += amount;
    tenant.payment.lastPaidAmount = amount;
    tenant.payment.lastPaidAt = new Date();
    tenant.payment.balance = tenant.payment.totalRent - tenant.payment.amountPaid;

    if (tenant.payment.balance <= 0) {
      tenant.rentStatus = "Paid";

      if (!tenant.relay) {
        tenant.relay = { electricity: false, water: false };
     }



      tenant.relay.electricity = true;
      tenant.relay.water = true;

      io.to(tenant.deviceId).emit("deviceCommand", {
        electricity: "ON",
        water: "ON"
      });
    }

    await tenant.save();

    io.emit("paymentUpdate", {
      room: tenant.room,
      balance: tenant.payment.balance
    });

    return res.json({
      message: "Payment processed successfully",
      success: true
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
      error: true,
      success: false
    });
  }
}

