
import React from 'react'
import Divider from '../Divider.jsx'
import { Outlet } from 'react-router-dom'
import logo from  '../../assets/smartrent.png'
import Tenant from '../../role/Tenant.jsx'


const TenantDashboard = () => {
  return (
    <section className=''>
      <div className=''>
        <header className='h-25 bg-white z-50 shadow-md sticky top-0'>
            <img src={logo} alt="" width={100} height={100} className='ml-3' />
          </header>
          <div className='flex  '>
             <div className='lg:w-60 w-50 '>
             <Tenant/>
        </div>
        <div className='bg-green-400  '>
          <Divider/>
        </div>
     <div className='lg:px-7 px-8 lg:w-full w-45 py-4'>
        <Outlet/>
     </div>
          </div>
      </div>
          
       
    </section>
  )
}

export default  TenantDashboard;