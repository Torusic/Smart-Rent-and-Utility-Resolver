import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {FaEye, FaEyeSlash} from 'react-icons/fa'
import Axios from '../utils/Axios'

import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import logo from  '../assets/smartrent.png'

const Login = () => {

    const[data,setData]=useState({
        
        
        phone:"",
        password:"",
        
 
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
      
          

              try {
                const response= await Axios({
                    ...SummaryApi.login,
                    data:data
                })
            if(response.data.error){
                toast.error(response.data.error)
            }
            if(response.data.success){
                toast.success(response.data.message)
                const userRole=response.data.data?.role

                
                setData({
                    
                    phone:"",
                    password:"",
                    role:""
                    
                })
                if(userRole==="landlord"){
                  navigate("/landlorddashboard/landlordstatistics")
                }
                else if(userRole==="tenant"){
                  navigate("/tenantdashboard/tenantstatistics")
                }
                else {
                toast.error("Unknown role. Please contact admin.")
               }
               console.log("userRole",userRole)
            }
        } catch (error) {
            AxiosToastError(error)
            
        }
    }


   const validate=Object.values(data).every(el=>el)
  return (
    <section className='w-full container   bg-green-50 mx-auto h-screen  '>
        <div className='sticky top-20 '>
            <div className=' bg-green-50 lg:w-130 w-80 p-7 mx-auto  shadow-lg  rounded-lg  border-2 border-green-200'>
           
           <p className='bg-red-300 w-full   text-red-600 p-2 rounded font-semibold '>No Account!!! Register With your Landlord</p>
           <img src={logo} alt="" width={120} height={120} className='items-center ml-20 lg:ml-40 flex justify-center' />
           <p className='text-green-500  text-2xl mb-3 p-3 font-bold'> Login</p>
           <form action="" onSubmit={handleSubmit}>
           
            
            <div className='grid py-2  ml-3'>
            <label htmlFor="" className='text-black font-semibold'>Phone:</label>
            <div className=' bg-green-50 border-green-100 border-b-green-300'>
                <input type="tel" 
            id='phone'
             name="phone"

             onChange={handleChange} 
             value={data.phone}
            
            className='border-2 border-green-50 w-full outline-none border-b-green-300'
            />
            </div>
            

           </div>
            <div className='grid py-2 ml-3'>
            <label htmlFor="" className='text-black font-semibold'>Password:</label>
            <div className=' bg-green-40 border-2 border-green-50 border-b-green-300 outline-none  rounded flex items-center justify-between gap-2 '>
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
        
        

           <button className='bg-green-400  text-white font-bold w-full p-3 rounded mt-3'>Login</button>
           </form>
           <p className='flex gap-2 py-3 items-center justify-center'>Landlord Dont have an Account ?<Link to={"/register"} className='font-semibold'>Register</Link></p>
           
          
          

          
        </div>
        </div>
        

    </section>
      
    
  )
}

export default Login
