import { Router } from "express";
import { addTenantController, commonLoginController,getAllTenantsController, getMessagesController, getTenantByIdController, getTenantMessages, getTenantUpdates, getUnreadMessagesForLandlord, getUnreadMessagesForTenant, landlordDashboardController, landlordDetails, logoutController, manageUtilities, markMessagesAsRead, markTenantMessagesAsRead, registerController, removeTenantController, searchTenant, sendChatToLandlord, sendChatToTenants, sendMessageToTenants, tenantDashboardController, tenantPasswordUpdate, updateLandlordController, updateTenantsController, vaccantRoomsController, verifyEmailController } from "../contollers/LandLord.Controller.js";
import auth from "../middleware/auth.js";
import { LogInstance } from "twilio/lib/rest/serverless/v1/service/environment/log.js";




const LandLordRoute=Router();

LandLordRoute.post('/register',registerController)
LandLordRoute.post('/verify_email',verifyEmailController)
LandLordRoute.post('/login',commonLoginController)
LandLordRoute.get('/logout',auth,logoutController)
LandLordRoute.post('/add',auth,addTenantController)
LandLordRoute.get('/search',auth,searchTenant)
LandLordRoute.put('/updateTenantPassword',auth,tenantPasswordUpdate)
LandLordRoute.post('/manageUtilities',auth,manageUtilities)
LandLordRoute.get('/vacantRooms',auth,vaccantRoomsController)
LandLordRoute.get('/Ldashboard',auth,landlordDashboardController)
LandLordRoute.get('/get',auth,getAllTenantsController)
LandLordRoute.put('/update',auth,updateLandlordController)
LandLordRoute.put('/tenant/:id', auth, updateTenantsController);
LandLordRoute.get('/user',auth,landlordDetails)
LandLordRoute.post('/broadcast',auth,sendMessageToTenants)
LandLordRoute.get('/getBroadcast',auth,getTenantUpdates)
LandLordRoute.get('/TDashboard',auth,tenantDashboardController)
LandLordRoute.post('/message',auth,sendChatToTenants)
LandLordRoute.get('/getChats',auth,getMessagesController)
LandLordRoute.post('/tenant/send', auth, sendChatToLandlord)
LandLordRoute.get('/tenant/getChats', auth, getTenantMessages)
LandLordRoute.put('/tenant/markRead', auth, markTenantMessagesAsRead)
LandLordRoute.get("/unread/landlord", auth, getUnreadMessagesForLandlord);
LandLordRoute.get("/unread/tenant", auth, getUnreadMessagesForTenant);
LandLordRoute.post("/messages/mark-read", auth, markMessagesAsRead);
LandLordRoute.delete('/delete',auth,removeTenantController)
LandLordRoute.get('/getTenantById/:id',auth,getTenantByIdController)

 

export default LandLordRoute;