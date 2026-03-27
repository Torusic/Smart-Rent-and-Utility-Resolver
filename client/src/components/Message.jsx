import React, { useState } from 'react';
import { FaRegCopyright } from 'react-icons/fa';
import { IoSend } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

const Message = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.broadcast,
        data: { message }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setMessage("");
      } else {
        toast.error("Message not sent to all tenants");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <section className='mt-1'>
      <div className='max-w-7xl mx-auto bg-white  rounded-2xl p-6 lg:p-4 w-full transition '>
        
        {/* Header */}
        <span className='font-bold lg:text-xl text-sm p-2 rounded text-green-600 text-center w-full block mb-4'>
          Send Updates to Your Tenants
        </span>

        {/* Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <label className='font-semibold text-gray-700 lg:text-sm text-xs flex gap-1'>
            Updates <span className='font-thin text-gray-500'>(Optional)</span>:
          </label>

          <div className='flex items-center lg:gap-2 gap-1 bg-gray-100 rounded-lg lg:px-3 px-2 lg:py-2 py-1'>
            <input
              type="text"
              onChange={handleChange}
              placeholder='Type an update...'
              value={message}
              className='flex-1 bg-gray-100 lg:text-sm text-xs outline-none lg:p-2 p-1 rounded-full'
            />
            <button type="submit" className='p-2 rounded-full hover:bg-green-100 transition'>
              <IoSend size={25} className='text-green-500 hover:text-green-700' />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className='flex justify-start mt-4 text-gray-500 items-center gap-2 lg:text-sm text-xs'>
          <FaRegCopyright /> All rights reserved 2025
        </div>
      </div>
    </section>
  );
};

export default Message;
