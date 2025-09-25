import React from 'react'
import Landlord from '../../role/Landlord.jsx'
import LandLordStatistics from '../../Statistics/LandLordStatistics'
import Divider from '../Divider.jsx'
import { Outlet } from 'react-router-dom'
import logo from  '../../assets/smartrent.png'

const LandLordDashboard = () => {
  return (
    <section className=''>
      <div className=''>
        <header className='h-25 bg-white z-50 shadow-md sticky top-0'>
            <img src={logo} alt="" width={100} height={100} className='ml-3' />
          </header>
          <div className='flex  '>
             <div className=' '>
             <Landlord/>
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

export default LandLordDashboard