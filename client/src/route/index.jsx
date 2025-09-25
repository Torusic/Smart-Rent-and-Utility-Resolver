import React from "react";
import { createBrowserRouter } from "react-router-dom";

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
import ChatBox from "../components/Dashboard/ChatBox";
import MessageChats from "../ChatElements/MessageChats";
import TenantDashboard from "../components/Dashboard/TenantDashBoard";
import TenantStatistics from "../Statistics/TenantStatistics";
import Tenant from "../role/Tenant";
import TenantChats from "../ChatElements/TenantChats";

const router=createBrowserRouter([
    {
        path:"",
        element:<App/>,
        children:[{
            path:"/register",
            element:<RegisterPage/>

        },
        {
            path:'/login',
            element:<Login/>
        },{
            path:"/landlorddashboard",
            element:<LandLordDashboard/>,
            children:[{
                 path:"landlord",
            element:<Landlord/>

            },
        {
            path:"landlordstatistics",
            element:<LandLordStatistics/>
        },
          {
            path:"addtenants",
            element:<AddTenants/>
        },
        {
            path:"view",
            element:<ViewTenants/>
        },
        {
            path:"update",
            element:<UpdateLandLordProfile/>
        },
        {
            path:"chat",
            element:<ChatBox/>,
            children:[
                {
                    path:"chatMessage",
                    element:<MessageChats/>
                }
            ]

        },
        
    ]
            
        },
        
        {
            path:"/tenantdashboard",
            element:<TenantDashBoard/>,
            children:[{
                path:"tenant",
                element:<Tenant/>
            },
                {
                path:"tenantstatistics",
                element:<TenantStatistics/>
            },
    {
      
          path: "tenantChat",
          element: <TenantChats />,
        
      
    },
 
  
        ]
        }
    ]

    }

])
export default router;