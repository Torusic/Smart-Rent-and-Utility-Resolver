import React from 'react'
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';
import { VscFeedback } from "react-icons/vsc";

function Feedback() {
  return (
    <section className='bg-green-100 py-2 '>
         <div className=' p-3 rounded bg-green-100 shadow-neutral-400 shadow-md'>
        <p className='font-semibold flex items-center gap-3 py-2'>Feedback <VscFeedback size={20} /></p>
        <div className='bg-white flex items-center px-2'>
            <input type="text" placeholder='Give feedback...' className='bg-white l w-full outline-none rounded p-2'/>
              <IoSend className='text-green-400' />
              </div>
        <span className='flex items-center gap-1 italic text-sm font-semibold py-1'>
            <IoMdInformationCircleOutline size={20} />
            Note: Only feedback or recommendations about the system may be sent. For any other messages, kindly contact the landlord directly.
            </span>
          

        
       
        </div>
        
    </section>
   
  )
}

export default Feedback