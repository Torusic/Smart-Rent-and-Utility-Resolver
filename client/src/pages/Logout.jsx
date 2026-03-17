import React from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { IoIosKey, IoIosLock, IoIosSave } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'

const Logout = () => {
  return (
    <section className='fixed top-0 bottom-0 right-0 left-0 bg-gray-900/60 p-2 z-70 flex items-center justify-center'>
      <div className='bg-white p-6 max-w-md w-full rounded-xl shadow-lg'>
        
        <div className='flex justify-between items-center mb-3'>
          <p 
            onClick={() => window.history.back()} 
            className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg bg-gray-200 text-gray-500 hover:text-gray-700"
          >
            <BsArrowLeft size={20}/>
          </p>

          <button className='text-gray-500 hover:text-gray-800'>
            <IoClose size={22}/>
          </button>
        </div>

        <h2 className='text-red-500 font-semibold text-lg mb-2'>
          Logout Confirmation
        </h2>

        <p className='mb-3 font-medium'>
          Are you sure you want to logout?
        </p>

        <div className='bg-gray-100 p-3 rounded text-sm text-gray-700 space-y-2'>
          <p className='flex items-center text-xs gap-1'><IoIosLock size={15} className='text-red-500'/> Your session will be closed and your account will be secured.</p>
          <p className='flex items-center text-xs gap-1'> <IoIosSave size={15} className='text-red-500'/> Any unsaved work may be lost.</p>
          
          <p className='flex items-center text-xs gap-1'> <IoIosKey size={15} className='text-red-500'/> You will need to login again to continue using the system.</p>
        </div>

        <div className='flex justify-end gap-3 mt-4'>
          <button 
            onClick={() => window.history.back()}
            className='px-4 py-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-200'
          >
            Cancel
          </button>

          <button 
            className='px-4 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600'
          >
            Logout
          </button>
        </div>

      </div>
    </section>
  )
}

export default Logout