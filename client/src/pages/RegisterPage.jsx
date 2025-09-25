import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {FaEye, FaEyeSlash} from 'react-icons/fa'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import logo from '../assets/smartrent.png'

const RegisterPage = () => {

    const[data,setData]=useState({
        name:"",
        email:"",
        phone:"",
        password:"",
        confirmPassword:"",
        totalRooms:""
})
    const[showPassword,setShowPassword]=useState(false)
    const[showConfirmPassword,setShowConfirmPassword]=useState(false)
    const navigate=useNavigate()

    const handleChange=(e)=>{
        const{name,value}=e.target

        setData((preve)=>{
            return{
                ...preve,
                [name]:value
            }
        })

    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
      
            if(data.password!==data.confirmPassword){
                toast.error("Password does not match")
                return
            }

              try {
                const response= await Axios({
                    ...SummaryApi.register,
                    data:data
                })
            if(response.data.error){
                toast.error(response.data.error)
            }
            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name:"",
                    email:"",
                    phone:"",
                    password:"",
                    confirmPassword:"",
                    totalRooms:""
                })
                navigate('/login')
            }
        } catch (error) {
            AxiosToastError(error)
            
        }
    }


   const validate=Object.values(data).every(el=>el)
  return (
    <section className='w-full container mt-6 '>
        <div className='bg-white lg:w-130 w-100 p-7 mx-auto shadow-md  rounded  border border-green-400'>
           
           <p className='bg-red-300 w-full   text-red-600 p-2 rounded font-semibold '>Only LandLords can Register</p>
            <p className='flex items-center font-extrabold mt-2 text-green-400'>Welcome to <img src={logo} alt="" width={60} height={60} className='' /></p>
           <p className='text-black py-3 font-bold'>LandLord Registration</p>
           <form action="" onSubmit={handleSubmit}>
            <div className='grid py-2 ml-3'>
            <label htmlFor="" className='text-black font-semibold'>Name:</label>
            <input type="text"
             name="name"
            id='name'
            onChange={handleChange} 
            value={data.name}
            
            className='border border-white outline-none border-b-black rounded'
            />

           </div>
            <div className='grid py-2 ml-3'>
            <label htmlFor="" className='text-black font-semibold'>Email:</label>
            <input type="email" 
            id='email'
             name="email"
             onChange={handleChange} 
             value={data.email}
            
            className='border border-white outline-none border-b-black'
            />

           </div>
            <div className='grid py-2 ml-3'>
            <label htmlFor="" className='text-black font-semibold'>Phone:</label>
            <input type="tel" 
            id='phone'
             name="phone"

             onChange={handleChange} 
             value={data.phone}
            
            className='border border-white outline-none border-b-black'
            />

           </div>
            <div className='grid py-2 ml-3'>
            <label htmlFor="" className='text-black font-semibold'>Password:</label>
            <div className=' bg-white border-white border-b-black outline-none border rounded flex items-center justify-between gap-2 '>
            <input type={showPassword? "text":"password"}
            id='password'
             name="password"
             onChange={handleChange}  
             value={data.password}
            
            
            className=' w-full outline-none'
            />
           
            <div onClick={()=>setShowPassword(preve=>!preve)}>
                {
                    showPassword ?(
                        <FaEye/>
                    ):(
                        <FaEyeSlash/>
                    )
                }
                
            </div>
             </div>
           </div>
         <div className='grid py-2 ml-3'>
            <label htmlFor="" className='text-black font-semibold'>Confirm Password:</label>
            <div className=' bg-white border-white border-b-black outline-none border rounded flex items-center justify-between gap-2 '>
            <input type={showConfirmPassword? "text":"password" }
             onChange={handleChange}
             id='confirmPassword'
              name="confirmPassword"
             value={data.confirmPassword} 
            
            
            className=' w-full outline-none'
            />
            <div onClick={()=>setShowConfirmPassword(preve=>!preve)}>
                {
                    showConfirmPassword ?(
                        <FaEye/>
                    ):(
                        <FaEyeSlash/>
                    )
                }
                
            </div>
           
            
             </div>
           </div>
            <div className='grid py-4 ml-3'>
            <label htmlFor="" className='text-black font-semibold'>Total Rooms:</label>
            <input type="text" 
            id='totalRooms'
            name="totalRooms"
             onChange={handleChange}
             value={data.totalRooms} 
            
            className='border border-white outline-none border-b-black'
            />

           </div>

           <button className='bg-green-400  text-white font-bold w-full p-3 rounded'>Register</button>
           </form>
           <p className='flex gap-2 py-3 items-center justify-center'>Already have an Account ?<Link to={"/login"} className='font-semibold'>Login</Link></p>
           
          
          

          
        </div>

    </section>
      
    
  )
}

export default RegisterPage
