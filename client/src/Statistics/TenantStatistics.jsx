import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios.js'
import SummaryApi from '../common/SummaryApi.js'
import AxiosToastError from '../utils/AxiosToastError'
import socket from '../utils/Socket.js'
import { IoClose, IoWaterOutline } from 'react-icons/io5'
import { IoIosBulb } from "react-icons/io"
import { MdBedroomParent } from 'react-icons/md'
import toast from 'react-hot-toast'
import About from '../components/About'
import {TbHomeMove} from 'react-icons/tb'
import { FaStar, FaStarHalfAlt, FaWallet } from 'react-icons/fa'
import Feedback from '../components/Feedback'
import RentPayment from '../components/Dashboard/PaymentAction/RentPayment'
import {LuLoader} from 'react-icons/lu'
import { formatCurrency } from "../utils/formatCurrency.js";
import History from "../components/Dashboard/PaymentAction/History"



const TenantStatistics = () => {
  const [broadcast, setBroadcast] = useState(null)
  const [dashboard, setDashboard] = useState({})
  const [rentModal, setRentModal] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Fetch broadcast updates
  const fetchUpdate = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getBroadcast })
      if (response.data.success) {
        const updates = response.data.data
        if (Array.isArray(updates) && updates.length > 0) {
          const latest = updates.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )[0]
          setBroadcast(latest)
        } else if (updates && typeof updates === 'object') {
          setBroadcast(updates)
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // Fetch tenant dashboard
  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const response = await Axios({ ...SummaryApi.tenantDashboard })
      if (response.data.success) {
        const data = response.data.data

        setDashboard({
        ...data,
        payment: {
          ...data.payment,
          history: data.payment?.history || []
        }
        })
        toast.success(response.data.message)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  fetchUpdate();
  fetchDashboard();

  socket.on("statusUpdate", (data) => {
    // live utility update
    fetchUpdate();
    fetchDashboard();
     
    if (data.room === dashboard.room) {
      setDashboard((prev) => ({
        ...prev,
        utilities: {
          water: data.water,
          electricity: data.electricity
        }
      }));
    }
    window.addEventListener("paymentSuccess", fetchDashboard)

      return () => {
      window.removeEventListener("paymentSuccess", fetchDashboard)
}
  });

 socket.on("paymentUpdate", async () => {
 await fetchDashboard();

 setDashboard(prev => ({
   ...prev,
   payment: {
     ...prev.payment,
     history: prev.payment?.history || []
   }
 }));
});
  return () => {
    socket.off("statusUpdate");
    socket.off("paymentUpdate");
  };
}, []);


  const handleClose = () => setBroadcast(null)

  return (
    <section className='bg-white items-center overflow-y-auto scrollbar-hidden h-full s px-2 py-2 justify-center' >
      
      {/* Broadcast */}
      {broadcast && (
        <div className="bg-gray-100 rounded-2xl border-l-4 border-gray-400 top-1 z-50 sticky lg:w-full w-88 text-sm p-1 flex items-center">
          <span className="font-semibold  text-red-600 px-2 py-1">
            {broadcast.content}
          </span>
          <small className="text-gray-400 px-2">
            {new Date(broadcast.createdAt).toLocaleString()}
          </small>
          <button className="ml-auto text-red-400 cursor-pointer" onClick={handleClose}>
            <IoClose size={20} />
          </button>
        </div>
      )}

      {/* Welcome */}
        <p className='font-bold text-2xl rounded-2xl border--4 border-green-400  lg:text-2xl justify-center py-3 px-3 flex items-center text-gray-800' >
        Welcome to Your Smart Home experience
        <span className='px-3 text-yellow-400 flex gap-2'><FaStar /><FaStar /><FaStarHalfAlt /></span>
      </p>
       <span className='p-3 font-semibold flex items-center gap-3'>Choose Payment <FaWallet size={20} /></span>
      
      
      <div className='p-3  inset-0  bg-white lg:flex justify-between'>
        
        {/* Rent Card */}
        <div className='lg:h-95  shadow-xl  rounded-2xl border-l-4 border-green-400 transition py-2  my-2 transform  duration-500 ease-in-out hover:scale-105  bg-white lg:w-80 w-80  cursor-pointer '>
          <div className='flex flex-col items-center justify-center mt-2'>
            <span className='text-3xl lg:text-4xl text-center font-bold text-green-400 py-2'>Rent</span>
            <MdBedroomParent size={40} className='text-green-400' />
          </div>
          <div className='grid mr-auto mt-2 gap-3  px-8 justify-between'>
            <span className='text-gray-900 text-xs font-semibold'>Room: {dashboard.room}</span>
            <span className='text-gray-900 text-sm font-semibold flex'>
              Status: 
              <p className='bg-green-200 text-green-500 text-xs font-semibold py-0.5 px-4 mx-2 rounded-xl'>
                {dashboard.rent?.status}
              </p>
            </span>
            <span className='text-gray-900 text-xs font-semibold'>
              Total Rent: { formatCurrency(dashboard.payment?.totalRent || dashboard.rent?.amount)}
            </span>
            <span className='text-gray-900 text-xs font-semibold'>
              Amount Paid:  {formatCurrency(dashboard.payment?.amountPaid || 0)}
            </span>
            <span className='text-gray-900 flex   gap-2 text-xs font-semibold'>
              Balance:<p className='font-semibold text-red-400 text-sm'>  {formatCurrency(dashboard.payment?.balance || 0)}</p>
            </span>
            <span className='text-gray-900  flex justify-between gap-2 text-xs font-semibold'>
              Last Paid:  <p className='font-semibold'> {formatCurrency(dashboard.payment?.lastPaidAmount || 0)} on {dashboard.payment?.lastPaidAt ? new Date(dashboard.payment.lastPaidAt).toLocaleDateString() : 'N/A'}</p>
            </span>
          </div>
          <div className='flex justify-center  items-center mt-3'>
            <button 
              className='bg-gradient-to-r from-green-500 to-emerald-500 text-sm text-white py-3 font-semibold cursor-pointer px-3 rounded-full w-40'
              onClick={() => setRentModal(true)}
            >
              Make Payments
            </button>
          </div>
        </div>

        {/* Electricity Card */}
        <div className='lg:h-90 py-7  shadow-xl rounded-2xl border-l-4 border-yellow-400 transition transform gap-4 duration-500 ease-in-out hover:scale-105 bg-white mt-4  lg:w-80 w-80 cursor-pointer'>
          <div className='flex flex-col items-center justify-center mt-2'>
            <span className='text-3xl lg:text-4xl text-center font-bold text-yellow-400'>Electricity</span>
            <IoIosBulb size={40} className='text-yellow-400' />
          </div>
          <div className='grid mr-auto lg:mt-6 mt-4  gap-4 px-8'>
            <span className='text-gray-900 text-sm font-semibold flex'>
              Status: 
              <p className='bg-yellow-200 text-yellow-500 py-0.5 px-4 mx-2 rounded-xl'>
                {dashboard.utilities?.electricity?.status}
              </p>
            </span>
            <span className='text-gray-900 text-xs font-semibold'>Amount:  {dashboard.utilities?.electricity?.amount || 0}</span>
            <span className='text-gray-900 text-xs font-semibold'>Units: {dashboard.utilities?.electricity?.units || 0} kWh</span>
            
          </div>
          <div className='flex justify-center items-center mt-8'>
            <button className='bg-gradient-to-r from-yellow-500 to-amber-500 text-sm text-white py-3 font-semibold cursor-pointer px-3 rounded-full w-40'>
              Make Payment
            </button>
          </div>
        </div>

        {/* Water Card */}
        <div className='lg:h-90 py-7 shadow-xl rounded-2xl border-l-4 border-blue-400  transform transition duration-500 ease-in-out hover:scale-105  bg-white mt-4  w-80  cursor-pointer '>
          <div className='flex flex-col items-center justify-center mt-2'>
            <span className='text-3xl lg:text-4xl font-bold text-center text-blue-400 py-2'>Water</span>
            <IoWaterOutline size={40} className='text-blue-400' />
          </div>
          <div className='grid mr-auto gap-4 text-sm font-bold mt-6 px-8'>
            <span className='text-gray-900 text-sm font-semibold flex'>
              Status: 
              <p className='bg-blue-200 text-blue-500 text-sm font-semibold py-0.5 px-4 mx-2 rounded-xl'>
                {dashboard.utilities?.water?.status}
              </p>
            </span>
            <span className='text-gray-900 text-xs font-semibold'>Amount: KES {dashboard.utilities?.water?.amount || 0}</span>
            <span className='text-gray-900 text-xs font-semibold'>Units: {dashboard.utilities?.water?.units || 0} m³</span>
           
          </div>
          <div className='flex justify-center p-2 items-center mt-8'>
            <button className='bg-gradient-to-r from-blue-500 to-blue-600 text-sm text-white py-3 font-bold cursor-pointer px-3 rounded-full w-40'>
              Make Payment
            </button>
          </div>
        </div>

      </div>

  
      

    {/** <Feedback />*/ }
    <div className="mt-2 rounded-2xl border-l-4 border-green-400">
       <About  />
    </div>
     

      {loading && (
        <div className='flex justify-center items-center mt-4'>
          <LuLoader size={40} className='animate-spin text-green-400' />
        </div>
      )}
           

    {rentModal && (
 
  <RentPayment 
    close={() => setRentModal(false)} 
    refreshDashboard={fetchDashboard} 
    balance={dashboard.payment?.balance} 
  />
)}

    </section>
  )
}

export default TenantStatistics
