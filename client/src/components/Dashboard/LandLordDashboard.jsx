import React, { useState } from "react";
import Landlord from "../../role/Landlord.jsx";
import Divider from "../Divider.jsx";
import { Outlet } from "react-router-dom";
import logo from "../../assets/smartrent.png";
import { MdMenu, MdClose } from "react-icons/md";

const LandLordDashboard = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle for mobile
  const[dark,setDark]=useState(false)

  return (
    <section className="h-screen flex flex-col bg-white via-transparent overflow-x-hidden">
      {/* Sticky header */}
      <header className="h-20 bg-white z-60 shadow-sm  sticky top-0 flex items-center justify-between px-4">
        {/* Logo */}
        <img src={logo} alt="SmartRent" width={100} height={100} className="ml-2" />

        {/* Menu Icon */}
        
        <button
          className="lg:hidden cursor-pointer"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
        </button>
      </header>

      {/* Main layout */}
      <div className="flex overflow-hidden h-full">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static top-20 z-50 left-0 h-full w-56 bg-green-50
            transform transition-transform duration-300 ease-in-out 
            ${isOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0 lg:block
          `}
        >
          <Landlord onLogout={() => console.log("logout")} closeMenu={() => setIsOpen(false)} />
        </aside>

        {/* Divider */}
        <div className="hidden  lg:block">
          <Divider />
        </div>

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto h-full bg-white  ">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default LandLordDashboard;
