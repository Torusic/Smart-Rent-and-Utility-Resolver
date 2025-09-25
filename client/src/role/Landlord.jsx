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

const Landlord = ({ onLogout }) => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/landlorddashboard/landlordstatistics", icon: <MdDashboard size={20} /> },
    { name: "Add Tenant", path: "/landlorddashboard/addtenants", icon: <MdPersonAdd size={20} /> },
   
    { name: "Chat", path: "/landlorddashboard/chat", icon: <MdChat size={20} /> },
    { name: "View Tenants", path: "/landlorddashboard/view", icon: <MdViewList size={20} /> },
    { name: "Update Profile", path: "/landlorddashboard/update", icon: <MdEdit size={20} /> },
    { name: "Logout", path: null, icon: <MdLogout size={20} /> },
  ];

  return (
    <aside className="w-56 bg-white  p-4">
      <ul className="space-y-2">
        {menu.map((item, i) => {
          // route-aware active: if path exists and current path starts with item.path
          const isActive = item.path && location.pathname.startsWith(item.path);

          return (
            <li key={i}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-2 rounded text-sm font-semibold w-full
                    ${isActive ? "bg-green-600 text-white" : "hover:bg-green-100 text-black"}`}
                  aria-label={item.name}
                >
                  <span className={`flex-none ${isActive ? "text-white" : "text-green-600"}`}>{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </Link>
              ) : (
                <button
                  onClick={() => typeof onLogout === "function" ? onLogout() : console.log("logout clicked")}
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
    </aside>
  );
};

export default Landlord;
