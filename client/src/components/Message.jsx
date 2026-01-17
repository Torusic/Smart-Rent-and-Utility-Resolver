import React, { useState } from 'react'
import { FaRegCopyright } from 'react-icons/fa'
import { IoSend } from "react-icons/io5"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const Message = () => {
  const[message,setMessage]=useState("")

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      const response=await Axios({
        ...SummaryApi.broadcast,
        data:{message}
      })
      if(response.data.success){
        toast.success(response.data.message)
        setMessage("")
      }else{
          toast.success("message not sent toall tenats")
      }
      
    } catch (error) {
      AxiosToastError(error)
    }
  }
  const handleChange=(e)=>{
    setMessage(e.target.value)
  }
  
  return (
    <section className='mt-0 '>
        <div className='bg-green-100 h-80 shadow-md   lg:mt-4 py-8 px-5 lg:w-full text-sm w-88 border border-white lg:border-green-400 rounded grid'>
             <span className='font-semibold bg-green-200 p-2 rounded w-full text-green-600'>Send Updates to Your Tenants</span>
          <label className='font-semibold text-sm flex gap-1 mt-3 mb-2' htmlFor="">Updates <div className='font-thin'>(Optional)</div>:</label>
          <form action="" onSubmit={handleSubmit}>  
            <div className=' mt-3 gap-2 bg-blue-50 flex items-center outline-none py-5 rounded px-2'>
            
            <input type="text"
            onChange={handleChange}
            placeholder='Type an update...'
            className='w-full outline-none rounded'
            value={message}
            />
            <button> <IoSend size={25} className='text-green-500 cursor-pointer hover:text-green-700'/></button>
        </div></form>
      
         <div className='flex mt-4'>
           <span className='flex items-center gap-2'><FaRegCopyright size={20} /> All rights reserved 2025</span> 
         </div>
        </div>
          
    </section>
  )
}

export default Message