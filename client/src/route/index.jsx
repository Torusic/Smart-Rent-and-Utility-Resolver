// src/routes/router.js
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import Login from "../pages/Login";
import LandLordDashboard from "../components/Dashboard/LandLordDashboard";
import TenantDashBoard from "../components/Dashboard/TenantDashBoard";

import Landlord from "../role/Landlord";
import LandLordStatistics from "../Statistics/LandLordStatistics";
import AddTenants from "../components/Dashboard/AddTenants";
import ViewTenants from "../components/Dashboard/ViewTenants";
import UpdateLandLordProfile from "../components/Dashboard/UpdateLandLordProfile";

import MessageChats from "../ChatElements/MessageChats";

import Tenant from "../role/Tenant";
import TenantStatistics from "../Statistics/TenantStatistics";
import TenantChats from "../ChatElements/TenantChats";
import ChatLayout from "../ChatElements/ChatLayout";
import Welcome from "../components/Welcome";
import UpdateTenantPassword from "../components/Dashboard/updateTenantPassword";
import History from "../components/Dashboard/PaymentAction/History";
import View from "../components/Dashboard/View";




const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      { 
        index:true,
        element:<Navigate to={'/welcome'} replace/>

      },
      {
        path:"/welcome",
        element:<Welcome/>

      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
  path: "/landlorddashboard",
  element: <LandLordDashboard />,
  children: [
    { index: true, element: <Landlord /> }, // Default route
    { path: "landlordstatistics", element: <LandLordStatistics /> },
    { path: "addtenants", element: <AddTenants /> },
    { path: "view", element: <ViewTenants /> },
    { path: "update", element: <UpdateLandLordProfile /> },
    {
      path: "chat",
      element: <ChatLayout />,
      children: [{ path: ":chatId", element: <MessageChats /> }],
    },
  ],
},
{
  path: "/tenantdashboard",
  element: <TenantDashBoard />,
  children: [
    { index: true, element: <Tenant /> },
    {path:"history",element:<History/>},
    { path:"updatePassword",element:<UpdateTenantPassword/>},
    { path:"viewTenants",element:<View/>},
    { path: "tenantstatistics", element: <TenantStatistics /> },
    { path: "tenantChat", element: <TenantChats /> },
    
  ],
}
,
    ],
  },
]);

export default router;
