import { Router } from "express";
import { smartRentAI } from "../contollers/ai.controller.js";
import auth from "../middleware/auth.js";

const aiRoute=Router()

aiRoute.post('/aiChat',auth,smartRentAI);

export default aiRoute;