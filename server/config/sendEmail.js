import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.RESEND_API) {
  console.log("Provide a RESEND_API key in the .env file");
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const recipients = Array.isArray(sendTo) ? sendTo : [sendTo];

    const { data, error } = await resend.emails.send({
      from: 'Smart Rent <onboarding@resend.dev>',
      to: recipients,
      subject,  
      html,
    });

    if (error) {
      console.error("Resend Error:", error);
      return;
    }

    console.log("Email sent successfully:", data);
    return data;

  } catch (err) {
    console.error("Send email failed:", err);
  }
};

export default sendEmail;
