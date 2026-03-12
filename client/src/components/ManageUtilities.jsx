import React, { useState, useEffect } from "react";
import { FaRegLightbulb, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

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
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8"
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

          <IoClose
            onClick={close}
            className="cursor-pointer text-red-500 hover:scale-110 transition"
            size={24}
          />
        </div>

        
        <div className="space-y-6">

         
          <div className="flex justify-between items-center bg-gradient-to-r from-yellow-100 to-amber-200 p-5 rounded-xl border border-yellow-100 hover:shadow-md transition">
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

         
          <div className="flex justify-between items-center bg-gradient-to-r from-blue-100 to-blue-200 p-5 rounded-xl border border-blue-100 hover:shadow-md transition">
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

      
        <div className="mt-10 text-center text-xs text-gray-400">
          Powered by ESP32 IoT Control System © 2026
        </div>
      </motion.div>
    </section>
  );
};

export default ManageUtilities;