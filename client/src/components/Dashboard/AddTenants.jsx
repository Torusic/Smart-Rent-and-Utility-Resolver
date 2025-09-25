import React from 'react'
import { useState } from 'react'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../../utils/AxiosToastError'
import { useNavigate } from 'react-router-dom'

const AddTenants = () => {
  const[tenant,setTenant]=useState({
    name:"",
    email:"",
    phone:"",
    room:"",
    rent:""
  })
  const navigate=useNavigate()

  const handleChange=(e)=>{
    const{name,value}=e.target;

    setTenant((preve)=>{
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
        ...SummaryApi.add,
        data:tenant
      })
      if(response.data.error){
        
       
      }
      if(response.data.success){
        toast.success(response.data.message)
        setTenant({
           name:"",
           email:"",
           phone:"",
           room:"",
           rent:""

        })
        navigate("/landlorddashboard/landlordstatistics")


      }
      
    } catch (error) {
      AxiosToastError(error)
      
    }

  }
  return (
  <section className='shadow-md lg:w-full w-70 container mx-auto border  border-green-400 p-6 rounded'>
    <h2 className='font-bold text-green-500 '>Add Tenants</h2>
    <form action="" onClick={handleSubmit}>
      <div className='grid'>
      <label className='py-3 font-semibold' htmlFor="">Name:</label>
      <input type="text"
      placeholder='Enter tenant name'
      className='p-2 outline-none bg-blue-50 border border-blue-50 hover:border-green-400 rounded'
            name="name"
            id='name'
            onChange={handleChange} 
            value={tenant.name} />
    </div>
    <div className='grid'>
      <label className='py-3 font-semibold' htmlFor="">Email:</label>
      <input type="email"
      placeholder='Enter tenant email address'
      className='p-2 outline-none bg-blue-50 border border-blue-50 hover:border-green-400 rounded' 
             id='email'
             name="email"
             onChange={handleChange} 
             value={tenant.email}
             />
    </div>
    <div className='grid'>
      <label className='py-3 font-semibold' htmlFor="">Phone:</label>
      <input type="tel"
      placeholder='Enter tenant phone number'
      className='p-2 outline-none bg-blue-50 border border-blue-50 hover:border-green-400 rounded'
       id='phone'
             name="phone"

             onChange={handleChange} 
             value={tenant.phone}
              />
    </div>
    <div className='grid'>
      <label className='py-3 font-semibold' htmlFor="">Room:</label>
      <input type="number"
      placeholder='Enter room number'
      className='p-2 outline-none bg-blue-50 border border-blue-50 hover:border-green-400 rounded'
       id='room'
             name="room"

             onChange={handleChange} 
             value={tenant.room} />
    </div>
    <div className='grid'>
      <label className='py-3 font-semibold' htmlFor="">Rent:</label>
      <input type="number"
      placeholder='Enter Amount'
      className='p-2 outline-none bg-blue-50  border border-blue-50 hover:border-green-400 rounded' 
       id='rent'
             name="rent"

             onChange={handleChange} 
             value={tenant.rent}/>
    </div>
   <div className='mt-4'>
    <button className='bg-green-600 text-white p-2 rounded w-full font-bold cursor-pointer'>Add</button>
   </div>
  
    </form>
    
  </section>
  )
}

export default AddTenants