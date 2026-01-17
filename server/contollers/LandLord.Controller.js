
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "../config/sendEmail.js";
import LandLord from "../models/LandLord.model.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import generatePassword from "../utils/generatePassword.js";
import TenantModel from "../models/Tenant.model.js";
import sndSMS from "../utils/sndSMS.js";
import bcrypt from "bcryptjs";
import { response } from "express";
import MessageModel from "../models/Message.model.js";


export async function registerController(req,res){
    try {
        const{name,email,phone,password,totalRooms}=req.body;
        if(!name||!email||!phone||!password||!totalRooms){
            return res.status(400).json({
                message:"All fields are required",
                error:true,
                success:false
            })
        }
        const LandLordExist=await LandLord.findOne({
              $or: [{ email }, { phone }]
        })
        if(LandLordExist){
            return res.status(400).json({
                message:"LandLord already Exists",
                error:true,
                success:false
            })
        }
        if(phone.length!==10){
            return res.status(400).json({
                message:"Phone number must be 10 digits",
                error:true,
                success:false
            })
        }
        const salt=await bcryptjs.genSalt(10);
        const hashedPassword=await bcryptjs.hash(password,salt)

        const payload={
            name,
            email,
            phone,
            password:hashedPassword,
            totalRooms,
            rentedRooms:0,
            vacantRooms:totalRooms
        }
        const newLandlord=new LandLord(payload);
        const save=await newLandlord.save()

        const verifyEmailUrl=`${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;
{/** 
       await sendEmail({
            sendTo:email,
            subject:'verify your email',
            html:verifyEmailTemplate({
                name,
                url:verifyEmailUrl
            })

        })*/}
       
        return res.status(200).json({
            message:"Landlord registerd Successfully, please check email to verify your account",
            error:false,
            success:true
        })

        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }
}
export async function verifyEmailController(req,res){
    try {
        const{code}=req.body

    const LandLord=await LandLord.findOne({_id:code})

    if(!LandLord){
        return res.status(400).json({
            message:"Invalid verification code",
            error:true,
            success:false
        })
    }
    const updateLandlord=await LandLord.updateOne({_id:code},
        {
            verify_email:true
        }
    )
    return res.status(200).json({
        message:"LandLord verified Successfully",
        error:false,
        success:true
    })

    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }
    
}

export async function commonLoginController(req, res) {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    //  Try landlord first
    let user = await LandLord.findOne({ phone });
    let role = "landlord";

    if (!user) {
      //  If not landlord, try tenant
      user = await TenantModel.findOne({ phone });
      role = "tenant";
    }

    if (!user) {
      return res.status(400).json({
        message: "User not registered or incorrect phone number",
        error: true,
        success: false,
      });
    }

    // Check password
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid Password",
        error: true,
        success: false,
      });
    }

    //  Generate tokens
    const accessToken = await generateAccessToken(user._id, role);
    const refreshToken = await generateRefreshToken(user._id, role);

    //  Update last login
    if (role === "landlord") {
      await LandLord.findByIdAndUpdate(user._id, { last_login_date: new Date() });
    } else {
      await TenantModel.findByIdAndUpdate(user._id, { last_login_date: new Date() });
    }

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.status(200).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully`,
      error: false,
      success: true,
      data: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function addTenantController(req, res) {
  try {
    const LandLordId = req.userId;
    const { name, email, phone, room, rent } = req.body;

    //  Validate required fields
    if (!name || !email || !phone || !room || !rent) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    //  Fetch landlord
    const landlord = await LandLord.findById(LandLordId);
    if (!landlord) {
      return res.status(404).json({
        message: "Landlord not found",
        error: true,
        success: false,
      });
    }

    //  Check if all rooms are full
    if (landlord.rentedRooms >= landlord.totalRooms) {
      return res.status(400).json({
        message: "All rooms fully occupied",
        error: true,
        success: false,
      });
    }

    //  Check if room is already occupied
    const tenantExist = await TenantModel.findOne({ landlord: LandLordId, room });
    if (tenantExist) {
      return res.status(400).json({
        message: `Room ${room} is already occupied`,
        error: true,
        success: false,
      });
    }

    //  Generate password for tenant
    const plainPassword = generatePassword();
    const hashpassword = await bcryptjs.hash(plainPassword, 10);

    //  Create tenant
    const newTenant = new TenantModel({
      landlord: LandLordId,
      name,
      email,
      phone,
      room,
      rent,
      role: "tenant",
      password: hashpassword,
    });

    const savedTenant = await newTenant.save();

    //  Update landlord counts
    landlord.Tenant.push(savedTenant._id);
    landlord.rentedRooms += 1;
    landlord.vacantRooms = landlord.totalRooms - landlord.rentedRooms;
    await landlord.save();

    // Send email
    let formattedNumber = phone.startsWith("0")
      ? "+254" + phone.slice(1)
      : phone;

    await sendEmail({
      sendTo: email,
      subject: 'Verify your email',
      html: verifyEmailTemplate({
        name,
        phone,
        plainPassword
      })
    });

    return res.status(200).json({
      message: "Tenant added successfully",
      error: false,
      success: true,
      tenant: {
        id: savedTenant._id,
        name: savedTenant.name,
        email: savedTenant.email,
        phone: savedTenant.phone,
        room: savedTenant.room,
        rent: savedTenant.rent,
        role: savedTenant.role,
        password: plainPassword,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function vaccantRoomsController(req, res) {
  try {
    const LandLordId = req.userId;
    const landlord = await LandLord.findById(LandLordId).populate("Tenant");

    if (!landlord) {
      return res.status(400).json({
        message: "Landlord does not exist",
        error: true,
        success: false,
      });
    }

    // Make sure tenant rooms match "Room X" format
    const rentedRooms = landlord.Tenant.map(tenant => `Room ${tenant.room}`);

    const allRooms = Array.from(
      { length: landlord.totalRooms },
      (_, i) => `Room ${i + 1}`
    );

    const vacantRooms = allRooms.filter(room => !rentedRooms.includes(room));
      

    return res.status(200).json({
      message: "Vacant rooms fetched successfully",
      error: false,
      success: true,
      totalRooms: landlord.totalRooms,
      rentedRooms: rentedRooms.length,
      vacantRoomsCount: vacantRooms.length,
      vacantRooms,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



export async function searchTenant(req,res){
    try {
        const landlordId=req.userId
        const{query}=req.query;

        if(!query){
            return res.status(400).json({
                message:"Query is required",
                error:true,
                success:false
            })
        }
        
       const regex = new RegExp(query, "i"); 
        const tenants=await TenantModel.find({
            landlord:landlordId,
            $or:[
                {phone:query},
                {email:query},
                {room:query}
            ]
        }).select("-password")

        return res.status(200).json({
            message:tenants.length?"Tenant found":"Tenant not found",
            error:false,
            success:true,
            tenants
        })

        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }
}
export async function removeTenantController(req, res) {
  try {
    const LandLordId = req.userId;
    const { tenantId } = req.body;

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant ID is required",
        error: true,
        success: false
      });
    }

    const landlord = await LandLord.findById(LandLordId);
    if (!landlord) {
      return res.status(400).json({
        message: "Landlord not found",
        error: true,
        success: false
      });
    }

    const tenant = await TenantModel.findOne({ _id: tenantId, landlord: LandLordId });
    if (!tenant) {
      return res.status(400).json({
        message: "Tenant does not exist or does not belong to you",
        error: true,
        success: false
      });
    }

    //  Remove tenant reference from landlord
    landlord.Tenant = landlord.Tenant.filter(
      (t) => t.toString() !== tenantId.toString()
    );

    landlord.rentedRooms = landlord.rentedRooms > 0 ? landlord.rentedRooms - 1 : 0;
    landlord.vacantRooms = landlord.totalRooms - landlord.rentedRooms;
    await landlord.save();

    // Delete tenant record
    await TenantModel.findByIdAndDelete(tenantId);

    //  Prepare SMS number & send
    const formattedNumber = tenant.phone; // or format as needed
    await sndSMS(
      formattedNumber,
      `Dear ${tenant.name}, you have been removed from ${landlord.name}'s property.`
    );

    return res.status(200).json({
      message: "Tenant removed successfully",
      error: false,
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function landlordDashboardController(req,res){
    try {
        const landLordId=req.userId
        
        const landlordInfo=await LandLord.findById(landLordId)
        if(!landlordInfo){
            return res.status(400).json({
                message:"Landlord not found",
                error:true,
                success:false
            })
        }
        const tenants=await TenantModel.find({
            landlord:landLordId
        })
        const rentedRooms=tenants.length
        const totalRooms=landlordInfo.totalRooms||0
        const vacantRooms=totalRooms-rentedRooms

        let rentPaid=0,
           rentUnpaid=0,
           waterPaid=0,
           waterUnpaid=0,
           electricityPaid=0,
           electricityUnpaid=0

           tenants.forEach((t)=>{
              if(t.rentStatus==="Paid")rentPaid++
            else rentUnpaid++

            if(t.utilities.water==="Paid")waterPaid++
            else waterUnpaid++

              if(t.utilities.electricity==="Paid")electricityPaid++
            else electricityUnpaid++


           })
       const totalTenants=tenants.length

       const utiliytiesGraph={
        rent:{
            paid:((rentPaid/totalTenants)*100).toFixed(2),
            unpaid:((rentUnpaid/totalTenants)*100).toFixed(2)
        },
        water:{
            paid:((waterPaid/totalTenants)*100).toFixed(2),
            unpaid:((waterUnpaid/totalTenants)*100).toFixed(2)
        },
         electricity:{
            paid:((electricityPaid/totalTenants)*100).toFixed(2),
            unpaid:((electricityUnpaid/totalTenants)*100).toFixed(2)
        },
       }
       return res.status(200).json({
        message:"LandLord dashboard fetched succesfully",
        error:false,
        success:true,
        data:{
             totalRooms,
            rentedRooms,
            vacantRooms,
            utiliytiesGraph
           
        }
       })

        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }
}

export async function tenantDashboardController(req, res) {
  try {
    const tenantId = req.userId;

    const tenant = await TenantModel.findById(tenantId).populate("landlord");
    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
        error: true,
        success: false,
      });
    }

    const waterAmount = (tenant.utilities?.water.units || 0) * (tenant.utilities?.water.rate || 5);
    const electricityAmount = (tenant.utilities?.electricity.units || 0) * (tenant.utilities?.electricity.rate || 20);

    const totalRent = tenant.payment?.totalRent || tenant.rent || 0;
    const amountPaid = tenant.payment?.amountPaid || 0;

    const dashboardData = {
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      room: tenant.room,

      rent: {
        amount: tenant.rent,
        status: tenant.rentStatus || "Unpaid",
      },

      payment: {
        totalRent,
        amountPaid,
        balance: totalRent - amountPaid,
        lastPaidAmount: tenant.payment?.lastPaidAmount || 0,
        lastPaidAt: tenant.payment?.lastPaidAt || null,
      },

      utilities: {
        water: {
          units: tenant.utilities?.water.units || 0,
          rate: tenant.utilities?.water.rate || 5,
          amount: waterAmount,
          status: tenant.utilities?.waterStatus || "Unpaid",
          token: tenant.utilities?.water.token || null,
        },
        electricity: {
          units: tenant.utilities?.electricity.units || 0,
          rate: tenant.utilities?.electricity.rate || 20,
          amount: electricityAmount,
          status: tenant.utilities?.electricityStatus || "Unpaid",
          token: tenant.utilities?.electricity.token || null,
        },
      },

      landlord: tenant.landlord
        ? {
            id: tenant.landlord._id,
            name: tenant.landlord.name,
            phone: tenant.landlord.phone,
          }
        : null,

      last_login_date: tenant.last_login_date || null,
    };

    return res.status(200).json({
      message: "Tenant dashboard fetched successfully",
      error: false,
      success: true,
      data: dashboardData,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export async function getAllTenantsController(req, res) {
  try {
    const LandLordId = req.userId;
    const landlord = await LandLord.findById(LandLordId);

    if (!landlord) {
      return res.status(404).json({
        message: "Landlord not found",
        error: true,
        success: false,
      });
    }

    // Get all tenants
    const tenants = await TenantModel.find({ landlord: LandLordId }).sort({ createdAt: -1 });

    if (!tenants || tenants.length === 0) {
      return res.status(400).json({
        message: "No tenants yet",
        error: true,
        success: false,
      });
    }

    // Attach last message + calculate payment info for each tenant
    const tenantsWithDetails = await Promise.all(
      tenants.map(async (tenant) => {
        const lastMessage = await MessageModel.findOne({
          $or: [
            { sender: LandLordId, receiver: tenant._id },
            { sender: tenant._id, receiver: LandLordId },
          ],
        }).sort({ createdAt: -1 });

        // Payment calculations
        const totalRent = tenant.payment?.totalRent || tenant.rent || 0;
        const amountPaid = tenant.payment?.amountPaid || 0;
        const balance = totalRent - amountPaid;

        return {
          ...tenant.toObject(),
          lastMessage: lastMessage || null,
          payment: {
            totalRent,
            amountPaid,
            balance,
            lastPaidAmount: tenant.payment?.lastPaidAmount || 0,
            lastPaidAt: tenant.payment?.lastPaidAt || null,
          },
        };
      })
    );

    return res.status(200).json({
      message: `${landlord.name}'s tenants found`,
      error: false,
      success: true,
      tenants: tenantsWithDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export async function updateLandlordController(req, res) {
    try {
        const LandLordId = req.userId;
        const { name, email, phone, totalRooms, password } = req.body;

        const landlord = await LandLord.findById(LandLordId);
        if (!landlord) {
            return res.status(404).json({
                message: "Landlord not found",
                error: true,
                success: false
            });
        }

        // Update fields if provided
        if (name) landlord.name = name;
        if (email) landlord.email = email;
        if (phone) landlord.phone = phone;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            landlord.password = await bcrypt.hash(password, salt);
        }

        // Update totalRooms and vacantRooms
        if (totalRooms && totalRooms !== landlord.totalRooms) {
            landlord.totalRooms = totalRooms;
            landlord.vacantRooms = landlord.totalRooms - landlord.rentedRooms;
        }

        await landlord.save();

        return res.status(200).json({
            message: "Updated Successfully",
            error: false,
            success: true,
            data: landlord
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export async function landlordDetails(req,res){
    try {
        const LandLordId=req.userId

        const landlord=await LandLord.findById(LandLordId).select("-password")

        return res.status(200).json({
            message:"Landlord Details fetched Successfully",
            error:false,
            success:true,
            data:landlord
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }
}
export async function sendMessageToTenants(req,res){
    try {
        const LandLordId=req.userId;
        const {message}=req.body;

        const landlord=await LandLord.findById(LandLordId).populate("Tenant")

        landlord.messages.push({
      content: message,
      date: new Date(),
      read: false,
    });
    await landlord.save();

    // Save message in tenants messages
   await TenantModel.updateMany(
  { _id: { $in: landlord.Tenant.map(t => t._id ? t._id : t) } }, 
  {
    $push: {
      messages: {
        content: message,
        date: new Date(),
        read:false
      }
    }
  }
);

        return res.status(200).json({
            message:"Message sent Succesfull",
            error:false,
            success:true
        })
       
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
        
    }

}
// Inside LandLord.Controller.js

export async function getTenantUpdates(req, res) {
  try {
    const tenantId = req.userId;

    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
        error: true,
        success: false,
      });
    }

    // Get cutoff date (7 days ago)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter messages newer than 7 days
    const validMessages = tenant.messages.filter(
      (msg) => new Date(msg.createdAt) >= sevenDaysAgo
    );

    // Sort messages by newest first
    const sortedMessages = validMessages.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Only take the most recent one
    const latestMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;

    return res.status(200).json({
      message: "Latest message fetched successfully",
      error: false,
      success: true,
      data: latestMessage, // ✅ only one, not all
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



export async function sendChatToTenants(req,res){
  try {
    const LandLordId=req.userId;
    const{tenantId,content}=req.body;

    if(!tenantId||!content){
      return res.status(400).json({
        message:"All fields are required",
        error:true,
        success:false
      })
     

    }
     const landlord=await LandLord.findById(LandLordId);
      if(!landlord){
        return res.status(400).json({
          message:"Landlord nOt found",
          error:true,
          success:false
        })
      }
      const tenant=await TenantModel.findById(tenantId)
      if(!tenant){
        return res.status(400).json({
          message:"Tenant Does not exist",
          error:true,
          success:false
        })

      }
      const newMessage=new MessageModel({
        sender:LandLordId,
        senderModel:"LandLord",
        receiver:tenantId,
        receiverModel:"Tenant",
        content
      })
      await newMessage.save()
      return res.status(200).json({
        message:"Chat sent Successfully",
        error:false,
        success:true
      })
    
  } catch (error) {
    return res.status(500).json({
      message:error.message||error,
      error:true,
      success:false
    })
    
  }
}
// 📥 Fetch chat history between landlord & tenant
export async function getMessagesController(req, res) {
  try {
    const landlordId = req.userId;
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant ID is required",
        error: true,
        success: false,
      });
    }

    const messages = await MessageModel.find({
      $or: [
        { sender: landlordId, receiver: tenantId },
        { sender: tenantId, receiver: landlordId },
      ],
    }).sort({ createdAt: 1 }); // oldest → newest

    return res.status(200).json({
      message: "Chat fetched successfully",
      error: false,
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
// Tenant sends chat to Landlord
export async function sendChatToLandlord(req, res) {
  try {
    const tenantId = req.userId;
    const { landlordId, content } = req.body;

    if (!landlordId || !content) {
      return res.status(400).json({
        message: "Landlord ID and content are required",
        error: true,
        success: false,
      });
    }

    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
        error: true,
        success: false,
      });
    }

    const landlord = await LandLord.findById(landlordId);
    if (!landlord) {
      return res.status(404).json({
        message: "Landlord not found",
        error: true,
        success: false,
      });
    }

    const newMessage = new MessageModel({
      sender: tenantId,
      senderModel: "Tenant",
      receiver: landlordId,
      receiverModel: "LandLord",
      content,
    });

    await newMessage.save();

    return res.status(200).json({
      message: "Message sent successfully",
      error: false,
      success: true,
      data: newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
// Tenant fetches chat history with landlord
export async function getTenantMessages(req, res) {
  try {
    const tenantId = req.userId;
    const { landlordId } = req.query;

    if (!landlordId) {
      return res.status(400).json({
        message: "Landlord ID is required",
        error: true,
        success: false,
      });
    }

    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
        error: true,
        success: false,
      });
    }

    const messages = await MessageModel.find({
      $or: [
        { sender: tenantId, receiver: landlordId },
        { sender: landlordId, receiver: tenantId },
      ],
    }).sort({ createdAt: 1 }); // oldest → newest

    return res.status(200).json({
      message: "Chat history fetched successfully",
      error: false,
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
// Tenant marks all landlord messages as read
export async function markTenantMessagesAsRead(req, res) {
  try {
    const tenantId = req.userId;
    const { landlordId } = req.body;

    await MessageModel.updateMany(
      { sender: landlordId, receiver: tenantId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      message: "Messages marked as read",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


// Get unread messages for landlord
export async function getUnreadMessagesForLandlord(req, res) {
  try {
    const landlordId = req.userId;

    const unreadCount = await MessageModel.countDocuments({
      receiver: landlordId,
      receiverModel: "LandLord",
      read: false,
    });

    return res.status(200).json({
      message: "Unread message count for landlord fetched successfully",
      error: false,
      success: true,
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get unread messages for tenant
export async function getUnreadMessagesForTenant(req, res) {
  try {
    const tenantId = req.userId;

    const unreadCount = await MessageModel.countDocuments({
      receiver: tenantId,
      receiverModel: "Tenant",
      read: false,
    });

    return res.status(200).json({
      message: "Unread message count for tenant fetched successfully",
      error: false,
      success: true,
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Mark all messages as read (generic for both landlord & tenant)
export async function markMessagesAsRead(req, res) {
  try {
    const userId = req.userId;

    const result = await MessageModel.updateMany(
      { receiver: userId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      message: "All unread messages marked as read",
      error: false,
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
