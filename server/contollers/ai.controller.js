import LandLord from "../models/LandLord.model.js";
import TenantModel from "../models/Tenant.model.js";
import { getOpenRouterResponse as getAIResponse } from "../utils/generateAIResponse.js";


export async function smartRentAI(req,res){
    try {
        const {message}=req.body;
        const userId=req.userId;
        const role=req.role

        let context=""
        if(role==="tenant"){
            const tenant=await TenantModel.findById(userId).populate("landlord")

            context=`
        Tenant Name:${tenant.name}
        Room:${tenant.room}
        Rent: ${tenant.rent}
        Balance: ${tenant.payment.balance}
        Electricity: ${tenant.relay.electricity ? "ON" : "OFF"}
        Water: ${tenant.relay.water ? "ON" : "OFF"}
        Landlord: ${tenant.landlord.name}
        
        
        `
        }
        if(role==="landlord"){
            const landlord=await LandLord.findById(userId);
            const tenants=await TenantModel.find({landlord:userId})

            const unpaid=tenants.filter(t=>t.payment.balance>0).length

             context = `
                Landlord: ${landlord.name}
                Total Rooms: ${landlord.totalRooms}
                Rented: ${landlord.rentedRooms}
                Vacant: ${landlord.vacantRooms}
                Tenants with balances: ${unpaid}
                    `;
    }

    const prompt=`
            You are a Smart Rent & Utility Assistant in Kenya.
            Use this system data to answer:

            ${context}

            User Question:${message}
            Respond in simple English or Swahili depending on the language the user has typed.
            Do not mention databases or code.
                            
    `
    const reply=await getAIResponse(prompt)
    
    return res.json({
      success: true,
      debugPrompt: prompt,
      reply
    });
        
    } catch (error) {
        return res.status(500).json({
      message: error.message,
      error: true,
      success:false
        
    })
    }
}