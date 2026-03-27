export const baseURL = "http://localhost:5173";

const SummaryApi = {
  /* ================= AUTH ================= */
  register: {
    url: "/api/LandLord/register",
    method: "post",
  },
  login: {
    url: "/api/LandLord/login",
    method: "post",
  },
  logout:{
    url:"/api/LandLord/logout",
    method:"get"

  },

  /* ================= LANDLORD ================= */
  landlordDashboard: {
    url: "/api/LandLord/Ldashboard",
    method: "get",
  },
  add: {
    url: "/api/LandLord/add",
    method: "post",
  },
  view: {
    url: "/api/LandLord/get",
    method: "get",
  },
  update: {
    url: "/api/LandLord/update",
    method: "put",
  },
  landlord: {
    url: "/api/LandLord/user",
    method: "get",
  },
  broadcast: {
    url: "/api/LandLord/broadcast",
    method: "post",
  },
  getBroadcast: {
    url: "/api/LandLord/getBroadcast",
    method: "get",
  },
  search: {
    url: "/api/LandLord/search",
    method: "get",
  },
  getTenantById: (id) => ({
  url: `/api/LandLord/tenant/${id}`,
  method: "get"
}),
  removeTenant: {
    url: "/api/LandLord/delete",
    method: "delete",
  },
  getVaccantRooms: {
    url: "/api/LandLord/vacantRooms",
    method: "get",
  },
  manageUtilities: {
    url: "/api/LandLord/manageUtilities",
    method: "post",
  },

  
  getChat: (tenantId, category = "All") => ({
    url: `/api/LandLord/getChats?tenantId=${tenantId}&category=${category}`,
    method: "get",
  }),

  //  Landlord sends message
  sendChat: {
    url: "/api/LandLord/message",
    method: "post",
  },

 
  getUnreadForLandlord: {
    url: "/api/LandLord/unread/landlord",
    method: "get",
  },


  markLandlordMessagesRead: {
    url: "/api/LandLord/messages/mark-read",
    method: "post",
  },

 

  tenantDashboard: {
    url: "/api/LandLord/TDashboard",
    method: "get",
  },

  
  sendChatToLandlord: {
    url: "/api/LandLord/tenant/send",
    method: "post",
  },

  
  getTenantChats: (landlordId, category = "All") => ({
    url: `/api/LandLord/tenant/getChats?landlordId=${landlordId}&category=${category}`,
    method: "get",
  }),

  getUnreadForTenant: {
    url: "/api/LandLord/unread/tenant",
    method: "get",
  },

  
  markTenantMessagesAsRead: {
    url: "/api/LandLord/tenant/markRead",
    method: "put",
  },

  updateTenantPassword: {
    url: "/api/LandLord/updateTenantPassword",
    method: "put",
  },

  makePayment: {
    url: "/api/mpesa/stk",
    method: "post",
  },
};

export default SummaryApi;