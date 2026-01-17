import axios from "axios";

const generateToken = async (req, res, next) => {
  try {
    const consumer = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;


    const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` }
      }
    );

    req.mpesaToken = response.data.access_token; // store token
    console.log("M-Pesa Token:", req.mpesaToken);

    next();
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(400).json({ error: "Failed to generate M-Pesa token" });
  }
};

export default generateToken;
