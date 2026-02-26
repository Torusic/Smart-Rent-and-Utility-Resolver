import React from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { BsFillExclamationTriangleFill } from "react-icons/bs";

const Action = ({ close, cancel, confirm }) => {

  return (
    <section className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden animate-fadeIn">

        {/* HEADER */}
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

        {/* BODY */}
        <div className="p-6 space-y-5">

          {/* Warning Icon */}
          <div className="flex justify-center">
            <BsFillExclamationTriangleFill
              size={70}
              className="text-red-400 animate-pulse"
            />
          </div>

          {/* Message */}
          <p className="text-center text-gray-600 text-xs font-medium">
            Are you sure you want to remove this tenant?
            <br />
            This action cannot be undone.
          </p>

        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-4 p-5  bg-gray-50">

          <button
            onClick={cancel}
            className="px-4 py-2 rounded-xl text-xs border cursor-pointer border-green-400
            text-green-600 font-semibold hover:bg-green-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={confirm}
            className="px-5 py-2 rounded-xl text-xs border cursor-pointer bg-red-400
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