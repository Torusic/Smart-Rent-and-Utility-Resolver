import TenantModel from "../models/Tenant.model.js";
import sendSMS from "./sendSMS.js";

export async function checkAndResetBilling(tenant) {
  if (!tenant) return;

  const today = new Date();
  const todayDay = today.getDate();

  const billingDay = tenant.billing?.billingDay;

  if (!billingDay) return tenant;

  const lastBilled = tenant.billing?.lastBilledAt;

  const alreadyBilled =
    lastBilled &&
    lastBilled.getMonth() === today.getMonth() &&
    lastBilled.getFullYear() === today.getFullYear();


  if (todayDay === billingDay && !alreadyBilled) {

    tenant.payment.amountPaid = 0;
    tenant.payment.totalRent = tenant.rent;

    tenant.billing.lastBilledAt = today;

    await tenant.save();

    if (tenant.phone) {
      await sendSMS(
        tenant.phone,
        `Dear ${tenant.name}, your rent billing cycle has started. 
Monthly rent: KES ${tenant.rent}. 
Please pay before deadline to avoid service interruption.`
      );
    }
  }

  return tenant;
}