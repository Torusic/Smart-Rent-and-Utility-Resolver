import React from 'react'
import { HiOutlineExclamationCircle } from "react-icons/hi"
import { IoClose } from 'react-icons/io5'
import { BsFillExclamationTriangleFill } from "react-icons/bs"

const Action = ({close,cancel,confirm}) => {
  return (
    <section className=' bg-neutral-950/70 z-50 fixed top-0 left-0 bottom-0 right-0 p-4 flex  items-center justify-center'>
        <div className='bg-white w-full max-w-md rounded-lg p-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-red-400 font-bold flex gap-2'><HiOutlineExclamationCircle size={26}/> Tenant removal</h1>
                <button>
                    <IoClose size={25} onClick={close} className='cursor-pointer'/>
                </button>
            </div>
            
            <div className='mt-5 '>
                <span className='font-semibold px-2 py-1 rounded text-gray-700'>Are you sure you want to remove tenant ?</span>

            </div>
            <div className='flex justify-center items-center mt-4'>
                <BsFillExclamationTriangleFill size={50} className='text-red-400 animate-pulse' />
            </div>
            <div className='ml-auto block w-fit mt-6 space-x-4'>
                <button onClick={cancel} className='border border-green-400 cursor-pointer hover:bg-green-200  text-green-500 px-3 py-1 font-semibold rounded'>cancel</button>
                <button onClick={confirm} className='border border-red-400 px-3 cursor-pointer hover:bg-red-300 rounded text-red-500 font-semibold py-1'>remove</button>
            </div>
            
        </div>

    </section>
  )
}

export default Action
