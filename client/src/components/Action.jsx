import React from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IoClose, IoSyncCircleSharp } from "react-icons/io5";
import { BsFillExclamationTriangleFill, BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { IoIosWarning, IoIosWater } from "react-icons/io";
import { MdElectricBolt } from "react-icons/md";
import { TbReport, TbReportAnalytics } from "react-icons/tb";

const Action = ({ close, cancel, confirm }) => {

  return (
    <section className="fixed inset-0 bg-black/70 backdrop-blur-sm z-70 flex items-center justify-center p-4">

      <div className="w-full max-w-xl bg-white rounded-lg shadow-2xl overflow-hidden animate-fadeIn">

        <div className="flex justify-between items-center p-5">
          <div className="flex items-center gap-2 text-sx text-red-500 font-bold">
            <HiOutlineExclamationCircle size={26} />
            <span>Tenant Removal</span>
          </div>

          <IoClose
            size={24}
            onClick={close}
            className="cursor-pointer text-gray-500 hover:text-red-500 transition"
          />
        </div>

        <div className="p-6 space-y-5">

          <div className="flex justify-center">
            <BsFillExclamationTriangleFill
              size={70}
              className="text-red-400 animate-pulse"
            />
          </div>

          <p className="text-center text-gray-600 text-xs font-medium">
            Are you sure you want to remove this tenant?
            <br />
            This action cannot be undone.
          </p>

          <div className="bg-red-50 border border-red-200 p-3 rounded text-xs text-gray-700 space-y-2">
            <p className='flex items-center gap-1'><IoIosWarning size={15} className='text-red-500'/>Tenant records and related data may be permanently deleted.</p>
            <p className='flex items-center gap-1'><MdElectricBolt size={15} className='text-red-500'/> Active services like electricity control or rent tracking may stop.</p>
            <p className='flex items-center gap-1'><TbReport size={16} className='text-red-500' /> Reports and payment history linked to this tenant may no longer be accessible.</p>
            <p className='flex items-center gap-1'><IoSyncCircleSharp size={16} className='text-red-500'/> The tenant may need to be registered again to restore access.</p>
          </div>

        </div>

        <div className="flex justify-end gap-4 p-5 bg-gray-50">

          <button
            onClick={cancel}
            className="px-4 py-2 rounded-xl text-xs border cursor-pointer border-green-400
            text-green-600 font-semibold hover:bg-green-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={confirm}
            className="px-5 py-2 rounded-xl text-xs border cursor-pointer bg-gradient-to-r from-red-400 to-red-500
            text-white font-semibold hover:bg-red-500 transition"
          >
            Remove Tenant
          </button>

        </div>

      </div>

    </section>
  );
};

export default Action;