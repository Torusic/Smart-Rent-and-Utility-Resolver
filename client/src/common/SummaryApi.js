export const baseURL = "http://localhost:8080";

const SummaryApi = {
  register: {
    url: "/api/LandLord/register",
    method: "post",
  },
  login: {
    url: "/api/LandLord/login",
    method: "post",
  },
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
  search: {
    url: "/api/LandLord/search",
    method: "get",
  },
  getBroadcast: {
    url: "/api/LandLord/getBroadcast",
    method: "get",
  },

  // Landlord <-> Tenant chat
  getChat: (tenantId) => ({
    url: `/api/LandLord/getChats?tenantId=${tenantId}`,
    method: "get",
  }),
  sendChat: (tenantId) => ({
  url: "/api/LandLord/message",
  method: "post",
  tenantId,
}),

  // Tenant-specific routes
  tenantDashboard: {
    url: "/api/LandLord/TDashboard",
    method: "get",
  },
  sendChatToLandlord: (landlordId) => ({
  url: "/api/LandLord/tenant/send",
  method: "post",
  landlordId,
}),
  
  getTenantChats: (landlordId) => ({
    url: `/api/LandLord/tenant/getChats?landlordId=${landlordId}`,
    method: "get",
  }),
  markTenantMessagesAsRead: {
    url: "/api/LandLord/tenant/markRead",
    method: "put",
  },
};

export default SummaryApi;
