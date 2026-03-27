import React, { useState } from 'react'
import Axios from '../../../utils/Axios.js'
import SummaryApi from '../../../common/SummaryApi.js'
import AxiosToastError from '../../../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'

function RentPayment({ close, refreshDashboard, balance }) {
  const [amount, setAmount] = useState(balance || 0)
  const [loading, setLoading] = useState(false)

  const handlePayment = async (e) => {
    e.preventDefault()

    if (amount <= 0) {
      return toast.error("Enter a valid amount")
    }

  { /** if (amount < balance) {
      return toast.error("Only full payment is allowed")
    }*/ 
  }

    setLoading(true)

    try {
      // Call backend to initiate M-Pesa STK push
      const response = await Axios({
        ...SummaryApi.makePayment,
        data: { amount }
      })

      if (response.data.success) {
        toast.success("STK Push sent! Check your phone")

        // Poll dashboard every 5 seconds until balance changes
        const interval = setInterval(async () => {
          try {
            const dash = await Axios({ ...SummaryApi.tenantDashboard })
            const newBalance = dash.data.data.payment.balance

            if (newBalance !== balance) {
              setLoading(false)
              refreshDashboard(window.dispatchEvent(new Event("paymentSuccess"))) // update parent dashboard
              toast.success("Payment confirmed!")
              clearInterval(interval)
              close() 
            }
          } catch (err) {
            AxiosToastError(err)
          }
        }, 5000)
      } else {
        setLoading(false)
        toast.error("Failed to initiate payment")
      }
    } catch (error) {
      setLoading(false)
      AxiosToastError(error)
    }
  }

  return (
    <div className='inset-0 bg-gray-700/60 backdrop-blur-sm z-50 top-0 left-0 p-7 right-0 bottom-0 fixed flex items-center justify-center'>
      <div className='bg-white border-l-4 border-green-500 p-3 w-full max-w-md grid shadow-md rounded-2xl items-center'>
        <div className='flex justify-between items-center p-3'>
          <p className='text-sm font-semibold'>Make Rent Payment</p>
          <IoClose onClick={close} className='cursor-pointer'/>
        </div>

        <form onSubmit={handlePayment}>
          <div className='p-2'>
            <div className='flex relative justify-between  items-center  rounded-lg p-2 gap-1'>
           
              <input
                type="number"
                placeholder='Enter Amount...'
                className='peer w-full h-12 px-4 pt-4 text-sm text-gray-500  border bg-gray-50 border-gray-200 rounded-xl
              focus:border-green-400 outline-none transition-all duration-300 '
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
                 <label className='absolute left-4 top-2 text-xs my-1 text-gray-500
            peer-focus:text-green-500'>Amount:</label>
            </div>
            <span className='flex gap-2 items-center text-red-400 p-2 justify-center mt-2 animate-pulse text-xs font-semibold'>
              <IoMdInformationCircleOutline size={20}/> Only full Payment is allowed
            </span>
          </div>

          <div className='mt-5 flex p-2 justify-center items-center'>
            <button
              type="submit"
              className={`bg-green-400 w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-lg p-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Rent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RentPayment
