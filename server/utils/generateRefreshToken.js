
import jwt from 'jsonwebtoken'
import LandLord from '../models/LandLord.model.js'
import TenantModel from '../models/Tenant.model.js';

const generateRefreshToken =async (userId,role) => {
    const token=await jwt.sign({id:userId,role},process.env.REFRESH_TOKEN,{
        expiresIn:'7d'
    })
   if (role === "landlord") {
    await LandLord.updateOne({ _id: userId }, { refresh_token: token });
  } else if (role === "tenant") {
    await TenantModel.updateOne({ _id: userId }, { refresh_token: token });
  }
  return token;
}

export default generateRefreshToken
