import { Router } from "express";


import auth from "../middleware/auth.js";
import generateToken from "../middleware/generateToken.js";
import { mpesaCallback, startPayment } from "../contollers/mpesaController.js";

const mpesaRoute=Router();

mpesaRoute.post('/stk', auth, generateToken, startPayment);

mpesaRoute.get("/token", generateToken, (req, res) => {
    res.json({ token: req.mpesaToken });
});
mpesaRoute.post("/callback", mpesaCallback);

export default mpesaRoute;