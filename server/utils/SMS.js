import africastalking from "africastalking";

const credentials = {
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
};

const AT = africastalking(credentials);
const sms = AT.SMS;

export async function sendSMS(phone, message) {
  try {
    await sms.send({
      to: phone,
      message
    });

    console.log("SMS sent to", phone);
  } catch (error) {
    console.log("SMS failed:", error.message);
  }
}
