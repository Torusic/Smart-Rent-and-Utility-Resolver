import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose, IoWaterOutline } from 'react-icons/io5'
import { IoIosBulb } from "react-icons/io"
import { MdBedroomParent } from 'react-icons/md'
import toast from 'react-hot-toast'

const TenantStatistics = () => {
  const [broadcast, setBroadcast] = useState(null)
  const [dashboard, setDashboard] = useState({})

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

  const fetchDashboard = async () => {
    try {
      const response = await Axios({ ...SummaryApi.tenantDashboard })
      if (response.data.success) {
        setDashboard(response.data.data)
        toast.success(response.data.message)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetchUpdate()
    fetchDashboard()
  }, [])

  const handleClose = () => setBroadcast(null)

  return (
    <section>
      {/* Broadcast */}
      {broadcast && (
        <div className="bg-green-200 lg:w-full w-auto min-w-50 p-1 grid">
          <span className="font-semibold text-green-600 px-2 py-1">
            {broadcast.content}
          </span>
          <small className="text-gray-400 px-2">
            {new Date(broadcast.createdAt).toLocaleString()}
          </small>
          <button className="w-fit ml-auto flex items-center" onClick={handleClose}>
            <IoClose size={20} />
          </button>
        </div>
      )}

      {/* Tenant Cards */}
      <div className='p-3 mt-3 rounded grid gap-3 lg:flex justify-between'>
        {/* Rent */}
        <div className='lg:h-105 h-80 shadow rounded lg:w-80 w-50 border-2 border-gray-200 cursor-pointer hover:border-green-400'>
          <div className='grid items-center justify-center mt-2'>
            <span className='font-extrabold text-gray-500 text-2xl py-2'>Rent</span>
            <MdBedroomParent size={90} className='text-green-400' />
          </div>
          <div className='grid mr-auto mt-9 px-8 justify-between'>
            <span className='lg:py-2 text-gray-700 font-bold'>Room: {dashboard.room}</span>
            <span className='lg:py-2 text-gray-700 font-bold flex'>
              Status: <p className='bg-green-200 text-green-500 py-0.5 px-4 mx-2 rounded'>{dashboard.rent?.status}</p>
            </span>
            <span className='lg:py-2 text-gray-700 font-bold'>Amount: {dashboard.rent?.amount}</span>
          </div>
          <div className='flex justify-center items-center mt-3'>
            <button className='bg-green-400 text-white py-3 cursor-pointer px-3 rounded-full w-50'>
              Make Payment
            </button>
          </div>
        </div>

        {/* Electricity */}
        <div className='h-105 shadow rounded w-80 border-2 border-gray-200 cursor-pointer hover:border-green-400'>
          <div className='grid items-center justify-center mt-2'>
            <span className='font-extrabold text-gray-500 text-2xl'>Electricity</span>
            <IoIosBulb size={90} className='text-green-400' />
          </div>
          <div className='grid mr-auto mt-9 px-8'>
            <span className='lg:py-2 text-gray-700 font-bold flex'>
              Status: <p className='bg-green-200 text-green-500 py-0.5 px-4 mx-2 rounded'>{dashboard.electricity?.status}</p>
            </span>
            <span className='lg:py-2 text-gray-700 font-bold'>Amount: {dashboard.electricity?.amount}</span>
          </div>
          <div className='flex justify-center items-center mt-3'>
            <button className='bg-green-400 text-white py-3 cursor-pointer px-3 rounded-full w-50'>
              Make Payment
            </button>
          </div>
        </div>

        {/* Water */}
        <div className='h-105 shadow rounded w-80 border-2 border-gray-200 cursor-pointer hover:border-green-400'>
          <div className='grid items-center justify-center mt-2'>
            <span className='font-extrabold text-gray-500 text-2xl py-2'>Water</span>
            <IoWaterOutline size={90} className='text-green-400' />
          </div>
          <div className='grid mr-auto mt-9 px-8'>
            <span className='lg:py-2 text-gray-700 font-bold flex'>
              Status: <p className='bg-green-200 text-green-500 py-0.5 px-4 mx-2 rounded'>{dashboard.water?.status}</p>
            </span>
            <span className='lg:py-2 text-gray-700 font-bold'>Amount: {dashboard.water?.amount}</span>
          </div>
          <div className='flex justify-center items-center mt-3'>
            <button className='bg-green-400 text-white py-3 cursor-pointer px-3 rounded-full w-50'>
              Make Payment
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TenantStatistics
