import React, { useState, useEffect } from "react";
import { FaRegLightbulb, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { IoIosWarning, IoIosWater } from "react-icons/io";
import { IoClose, IoFlashSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { RiAlarmWarningFill } from "react-icons/ri";
import { GiAutoRepair, GiSpanner } from "react-icons/gi";

const ManageUtilities = ({ tenant, close, fetch }) => {
  const [electricity, setElectricity] = useState(false);
  const [water, setWater] = useState(false);
  const [loadingType, setLoadingType] = useState(null);

  const tenantId = tenant?._id;


  useEffect(() => {
    if (tenant?.utilities) {
      setElectricity(tenant.utilities.electricityStatus === "ON");
      setWater(tenant.utilities.waterStatus === "ON");
    }
  }, [tenant]);


  const handleManage = async (type, state) => {
    try {
      setLoadingType(type);

      const response = await Axios({
        ...SummaryApi.manageUtilities,
        data: {
          tenantId,
          electricity: type === "electricity" ? state : undefined,
          water: type === "water" ? state : undefined,
        },
      });

      toast.success(response?.data?.message);

      if (fetch) fetch();
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-70 p-">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-7"
      >
        <div className="flex justify-between items-center  pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Manage Room {tenant?.room}
            </h2>
            <p className="text-sm text-gray-500">
              Control tenant utilities remotely
            </p>
          </div>
           <div className="bg-gray-100 px-2 py-1 rounded-2xl border-l-4 border-green-500 grid">
            <p className="font-semibold text-sm py-2 text-green-500">key</p>
            <div className="flex gap-2 items-center justify-between">
              <p className="font-semibold text-gray-400 text-xs"><FaToggleOn className="text-green-400" size={20} />turned on</p>
              <p className="font-semibold text-gray-400 text-xs"><FaToggleOff className="text-green-400" size={20} />turned off</p>
            </div>

          </div>
        

          <IoClose
            onClick={close}
            className="cursor-pointer text-red-500 hover:scale-110 transition"
            size={24}
          />
        </div>

        
        <div className="space-y-3">

         
          <div className="flex justify-between items-center bg-yellow-50 to-amber-200 p-5 rounded-xl border border-yellow-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className=" bg-yellow-100  p-3 rounded-full">
                <FaRegLightbulb className="text-yellow-500 text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Electricity
                </h3>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span fetch={fetch()} className={`font-medium ${electricity ? "text-green-600" : "text-red-500"}`}>
                    {electricity ? "ON" : "OFF"}
                  </span>
                </p>
              </div>
            </div>

            <div
              onClick={() => {
                if (loadingType === "electricity") return;

                const newState = !electricity;
                setElectricity(newState);
                handleManage("electricity", newState ? "ON" : "OFF");
              }}
              className="cursor-pointer"
            >
              {electricity ? (
                <FaToggleOn
                  size={36}
                  className="text-yellow-500 hover:scale-110 transition"
                />
              ) : (
                <FaToggleOff
                  size={36}
                  className="text-gray-400 hover:scale-110 transition"
                />
              )}
            </div>
          </div>

         
          <div className="flex justify-between items-center bg-blue-50 p-5 rounded-xl border border-blue-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <IoIosWater className="text-blue-500 text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  Water Supply
                </h3>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span fetch={fetch()} className={`font-medium ${water ? "text-green-600" : "text-red-500"}`}>
                    {water ? "ON" : "OFF"}
                  </span>
                </p>
              </div>
            </div>

            <div
              onClick={() => {
                if (loadingType === "water") return;

                const newState = !water;
                setWater(newState);
                handleManage("water", newState ? "ON" : "OFF");
              }}
              className="cursor-pointer"
            >
              {water ? (
                <FaToggleOn
                  size={36}
                  className="text-blue-500 hover:scale-110 transition"
                />
              ) : (
                <FaToggleOff
                  size={36}
                  className="text-gray-400 hover:scale-110 transition"
                />
              )}
            </div>
          </div>
        </div>
        
          {/* Guidance Section */}
          <div className="mt-8 p-4 bg-gradient-to-r from-red-50 via-yellow-50 to-red-50 rounded-xl border-l-4 border-red-500 shadow-md">
            <h3 className="flex items-center font-bold text-red-600 mb-2 text-lg">
             System Alert 
            </h3>
            <p className="text-sm flex  text-gray-700 gap-2 my-3">
              <RiAlarmWarningFill size={40} className="text-red-500" /> WARNING: Utilities are automatically controlled by the system based on rent payments. 
              If rent is overdue, electricity and water may be DISCONNECTED automatically. 
              Services are RESTORED immediately after payment is received. 
              
              
            </p>
            <p className="text-sm flex text-gray-700 mt-2 gap-1">
              <IoFlashSharp size={40} className="text-yellow-500" />
              <div className="grid ">
                <p>  Take this seriously: accidental manual shutdown is prevented, but failure to pay rent will result in immediate service loss. 
              Tenants will only regain access after compliance.</p>
              
              <p className="mt-1 flex "><strong>Note:</strong> The manual toggle here  is used for testing the IoT system reaction based on rent status, to observe how the intelligent system responds to payment and non-payment scenarios.</p>
              </div>
           
              
            </p>
            <p className="text-sm text-gray-600 flex gap-2  italic mt-2">
              <GiSpanner size={20} className="text-gray-500" />This is an intelligent IoT-enabled control system designed to enforce payment compliance.
            </p>
            <p className="text-sm text-gray-700 flex gap-2 mt-2 font-semibold">
              <GiAutoRepair size={35} className="text-gray-500"  /> Manual override feature coming soon! This will allow landlords to control utilities manually while keeping automatic protections active. 
              
            </p>
</div>
      
        <div className="mt-10 text-center text-xs text-gray-400">
          Powered by ESP32 IoT Control System © 2026
        </div>
      </motion.div>
    </section>
  );
};

export default ManageUtilities;