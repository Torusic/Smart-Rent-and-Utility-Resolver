import React, { useEffect, useState } from 'react'
import Message from '../Message'
import AxiosToastError from '../../utils/AxiosToastError'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'

const UpdateLandLordProfile = () => {
    const[landlordData,setLandlordData]=useState({
        name:"",
        email:"",
        phone:"",
        totalRooms:""
    })

    useEffect(()=>{
        const fetchLandlordDetails=async()=>{
            try {
                const response=await Axios({
                    ...SummaryApi.landlord,
                 
                })
                const{data:responseData}=response

                if(responseData.success){
                    toast.success(responseData.message)
                    setLandlordData(responseData.data)
                }
                
                
            } catch (error) {
                AxiosToastError(error)
                
            }

        }
        fetchLandlordDetails()

    },[])
const handleChange=(e)=>{
    const{name,value}=e.target

    setLandlordData((preve)=>{
        return{
            ...preve,
            [name]:value
        }  
    })
}
const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
        const response=await Axios({
            ...SummaryApi.update,
            data:landlordData

        })
        const{data:responseData}=response
        if(responseData.success){
            toast.success(responseData.message)

            if(responseData.data){
                setLandlordData(responseData.data)

            }
            
        }

        
    } catch (error) {
        AxiosToastError()
        
    }
}

  return (
   <section >
    <div className='bg-white shadow-md py-10 px-5 border border-green-400 rounded'>
        <span className='font-semibold bg-green-200 p-2 rounded w-full text-green-600'>Update My Profile</span>
        <form action="" onSubmit={handleSubmit}><div className='flex gap-10 px-2 justify-between'>
        <div className='grid mt-5 gap-2'>
            <label className='font-semibold text-sm' htmlFor="">Name:</label>
            <input type="name"
             id='name'
            name='name'
            className='bg-blue-50 outline-none rounded w-90 p-1 border font-semibold text-gray-500 hover:text-black  border-blue-50'
            onChange={handleChange}
            value={landlordData.name}

            />
        </div>
        <div className='grid mt-3 gap-2'>
            <label className='font-semibold text-sm' htmlFor="">Email:</label>
            <input type="email"
            id='email'
            name='email'
            className='bg-blue-50 outline-none rounded w-90 p-1 font-semibold text-gray-500 hover:text-black border  border-blue-50'
             onChange={handleChange}
               value={landlordData.email}
               required
            />
        </div>
        <div className='grid mt-3 gap-2'>
            <label className='font-semibold text-sm' htmlFor="">Phone:</label>
            <input type="tel"
            id='phone'
            name='phone'
            className='bg-blue-50 outline-none rounded w-90 p-1 font-semibold text-gray-500 hover:text-black border  border-blue-50'
             onChange={handleChange}
               value={landlordData.phone}
            />
        </div>
    </div>
    <div className=' flex px-2 mt-5 gap-18'>
        <div className='grid mt-3 gap-2'>
            <label className='font-semibold text-sm' htmlFor="">Number of Rooms:</label>
            <input type="Number"
            id='totalRooms'
            name='totalRooms'
            className='bg-blue-50 outline-none rounded w-90 font-semibold text-gray-500 hover:text-black p-1 border border-blue-50'
             onChange={handleChange}
               value={landlordData.totalRooms}
            />
        </div>

        <div className='mt-12 '>
            <button className='bg-green-600 px-3 py-1 rounded  w-90 cursor-pointer text-white font-semibold'>Update</button>
        </div>
    </div>     
        </form>

    </div>

    <Message/>




   </section>
  )
}

export default UpdateLandLordProfile
