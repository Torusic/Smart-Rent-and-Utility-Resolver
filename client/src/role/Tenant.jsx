// src/components/Landlord.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPersonAdd,
  MdSearch,
  MdChat,
  MdViewList,
  MdEdit,
  MdLogout,
} from "react-icons/md";
import { GiPayMoney } from "react-icons/gi";
import { TbSunElectricity } from "react-icons/tb";
import { FaHandHoldingWater, FaHistory, FaRobot } from "react-icons/fa";

const Tenant = ({ onLogout,closeMenu }) => {
  const location = useLocation();

  const menu = [
   
    { name: "Dashboard", path: "/tenantdashboard/tenantstatistics", icon: <MdDashboard size={20} /> },
    { name: "Chat", path: "/tenantdashboard/tenantChat", icon: <MdChat size={20} /> },
    { name: "Update Profile", path: "/tenantdashboard/update", icon: <MdEdit size={20} /> },
      {name:"History", icon:<FaHistory size={20} />},
    { name: "Logout", path: null, icon: <MdLogout size={20} /> },
  ];

  return (
    <aside className="w-48  z-50 flex flex-col justify-between  lg:h-full h-190  inset-0 bg-gradient-to-t from-[#D1FAE5] via-transparent py-6  ">
      <ul className="space-y-2">
        {menu.map((item, i) => {
          // route-aware active: if path exists and current path starts with item.path
          const isActive = item.path && location.pathname.startsWith(item.path);

          return (
            <li key={i}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex items-center  gap-3 p-2 rounded text-sm font-semibold w-full
                    ${isActive ? "bg-green-600 text-white" : "hover:bg-green-200 text-black"}`}
                  aria-label={item.name}
                  onClick={closeMenu}
                >
                  <span className={`flex-none  ${isActive ? "text-white" : "text-green-600"}`}>{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </Link>
              ) : (
                 <button
                onClick={() => {
                  if (typeof onLogout === "function") onLogout();
                  if (typeof closeMenu === "function") closeMenu();
                }}
                className="flex items-center gap-3 p-2 rounded text-sm font-semibold w-full hover:bg-red-50 text-black"
              >
                <span className="text-red-600">{item.icon}</span>
                <span>{item.name}</span>
              </button>
              )}
            </li>
          );
        })}
      </ul>
        <div className='p-3 animate-pulse w-35 grid mt-2 gap-1 cursor-pointer ml-auto shadow-md rounded-full bg-green-200 items-center justify-center'>
          <FaRobot size={30} className='animate-pulse ml-9  cursor-pointer text-green-600 '/>
          <p className='text-sm font-semibold text-green-700'>Ask FAQs to AI</p>
        </div>
    </aside>
  );
};

export default Tenant;


   