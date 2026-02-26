import africastalking from "africastalking";
import dotenv from "dotenv";

dotenv.config();

const credentials = {
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
};

const AT = africastalking(credentials);
const sms = AT.SMS;


function normalizeKenyanPhone(phone) {
  if (!phone) return phone;

  phone = phone.toString().trim();

  if (phone.startsWith("+254")) return phone;

  if (phone.startsWith("0")) {
    return "+254" + phone.substring(1);
  }

  if (phone.startsWith("7")) {
    return "+254" + phone;
  }

  return phone;
}

export const sendSMS = async (phone, message) => {
  try {
    const formattedPhone = normalizeKenyanPhone(phone);

    const result = await sms.send({
      to: formattedPhone,
      message: message,
    });

    console.log(" SMS sent:", JSON.stringify(result, null, 2));

    return result;

  } catch (error) {
    console.log("❌ SMS error:", error.message);
  }
};

export default sendSMS;