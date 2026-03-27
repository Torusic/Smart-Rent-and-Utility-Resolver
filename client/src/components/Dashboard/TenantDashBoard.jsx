
import React, { useState } from 'react'
import Divider from '../Divider.jsx'
import { Outlet } from 'react-router-dom'
import logo from  '../../assets/smartrent.png'
import Tenant from '../../role/Tenant.jsx'
import { MdClose, MdMenu } from 'react-icons/md'


const TenantDashboard = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle for mobile

  return (
    <section className="h-screen w-screen bg-white lg:flex lg:flex-col grid overflow-x-hidden">
      {/* Sticky header */}
      <header className="h-20 bg-white z-50 shadow-md sticky top-0 flex items-center justify-between px-4">
        {/* Logo */}
        <img src={logo} alt="SmartRent" width={100} height={100} className="ml-2" />

        {/* Menu Icon (only on small screens) */}
        <button
          className="lg:hidden cursor-pointer"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
        </button>
      </header>

      {/* Main layout */}
      <div className="flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static top-20 bottom-0  left-0 screen w-56 bg-white shadow-md 
            transform transition-transform duration-300 ease-in-out 
            ${isOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0 lg:block
          `}
        >
          <Tenant onLogout={() => console.log("logout")} closeMenu={() => setIsOpen(false)} />
        </aside>

        {/* Divider */}
        <div className="hidden lg:block">
          <Divider />
        </div>

        {/* Main scrollable content */}
        <main className="flex-1 inset-0 bg-green-50  overflow-y-auto   ">
          <Outlet />
        </main>
      </div>
    </section>
  );
}

export default  TenantDashboard;