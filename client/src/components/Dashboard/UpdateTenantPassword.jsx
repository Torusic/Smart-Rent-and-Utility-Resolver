import React, { useEffect, useState } from 'react'
import AxiosToastError from '../../utils/AxiosToastError'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import { LuLoaderCircle } from 'react-icons/lu'

const UpdateTenantPassword = () => {
  const[tenantUpdatePassword,setTenantUpdatePassword]=useState({
    currentPassword:"",
    newPassword:"",
    confirmNewPassword:""
  })
  const[loading,setLoading]=useState(false)
  const[showPassword,setShowPassword]=useState(false)

  const handleChange=(e)=>{
    const{name,value}=e.target

    setTenantUpdatePassword((preve)=>{
      return{
        ...preve,
        [name]:value

      }
    })


  }

  const handleSubmit=async(e)=>{
    e.preventDefault()

    if(tenantUpdatePassword.newPassword!==tenantUpdatePassword.confirmNewPassword){
      toast.error(
        "Password dont match"
      )
      return
    }
    try {
      setLoading(true)
      const response=await Axios({
        ...SummaryApi.updateTenantPassword,
        data:tenantUpdatePassword
      })
      const{data:responseData}=response
      
      if(responseData.success){
        toast.success(responseData.message)
        setTenantUpdatePassword({ 
        currentPassword:"",
        newPassword:"",
        confirmNewPassword:""})
      }
     
    } catch (error) {
      AxiosToastError(error)
      
    }finally{
      setLoading(false)
    }
  }
  return (
    <section className='shadow p-3 bg-white h-screen rounded'>
      <h2 className='italic font-bold text-green-500'>Update Your Password</h2>
     <form action="" className='grid items-center 'onSubmit={handleSubmit}>
      <div className='grid py-2 '>
        <label htmlFor=""className='py-2 font-semibold'>Current Password</label>
        <input type="text"
        id='currentPassword' 
        name='currentPassword'
       className='w-80 h-9 outline-none text-sm p-3 bg-white border border-gray-200 rounded-lg'
        placeholder='Enter current password'
        onChange={handleChange} 
        value={tenantUpdatePassword.currentPassword}
        
        />
        <p className='italic py-1 text-sm text-green-400'>(It should be the password sent to Your email during registration)</p>
      </div>
          <div className='grid py-1 '>
        <label htmlFor=""className='py-2 font-semibold'>New Password</label>
        <input
         type={showPassword ?"text":"password"}
           id='newPassword' 
        name='newPassword'
        className='w-80 h-9 outline-none text-sm p-3 bg-white border border-gray-200 rounded-lg'
        onChange={handleChange} 
        placeholder='Enter new password'
        value={tenantUpdatePassword.newPassword}
        
        />
      </div>
          <div className='grid py-2 '>
        <label htmlFor=""className='py-2 font-semibold'>Confirm New Password</label>
        <input
         type={showPassword ?"text":"password"}
          id='confirmNewPassword' 
        name='confirmNewPassword'
        className='w-80 h-9 outline-none text-sm p-3 bg-white border border-gray-200 rounded-lg' 
        onChange={handleChange}
        placeholder='Confirm new password'
        value={tenantUpdatePassword.confirmNewPassword}
        
        />
      </div>
           <div className='py-2'>
          <label className='flex items-center gap-2 cursor-pointer text-sm text-gray-600'>
            <input
              type='checkbox'
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Passwords
          </label>
        </div>
      <div className='py-4  flex items-center '>
        <button disabled={loading} className={`bg-green-400 text-white w-80 flex justify-center cursor-pointer font-semibold p-2 rounded
          ${loading?"bg-gray-400 cursor-not-allowed":"bg-green-400 hover:bg-green-500"}
        `}>
          {
            loading ? <LuLoaderCircle size={26} className='flex justify-center '/>:"Update Password"
          }
        </button>
      </div>

     </form>
        


     

    </section>
  )
}

export default UpdateTenantPassword
