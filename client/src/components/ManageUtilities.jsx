import React, { useState, useEffect } from "react";
import { FaRegLightbulb, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const ManageUtilities = ({ tenant, close, fetch }) => {
  const [electricity, setElectricity] = useState(false);
  const [water, setWater] = useState(false);

  const tenantId = tenant?._id;

  /* Load Current Status */
  useEffect(() => {
    if (tenant?.utilities) {
      setElectricity(tenant.utilities.electricityStatus === "ON");
      setWater(tenant.utilities.waterStatus === "ON");
    }
  }, [tenant]);

  /* Updated handleManage */
  const handleManage = async (type, state) => {
    try {
      const response = await Axios({
        ...SummaryApi.manageUtilities,
        data: {
          tenantId,
          electricity: type === "electricity" ? state : undefined,
          water: type === "water" ? state : undefined,
        },
      });

      toast.success(response?.data?.message);

      if (fetch) {
        
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        
        {/* HEADER */}
        <div className="flex justify-between mb-5">
          <h2 className="font-bold text-green-600">
            Manage Room {tenant?.room}
          </h2>

          <IoClose
            onClick={close}
            className="cursor-pointer text-red-500"
            size={22}
            
          />
        </div>

        {/* ELECTRICITY */}
        <div className="flex justify-between mb-5">
          <p className="flex gap-2 items-center">
            <FaRegLightbulb className="text-yellow-500" />
            Electricity
          </p>

          <div
            onClick={() => {
              const newState = !electricity;
             
              setElectricity(newState);
              

              handleManage("electricity", newState ? "ON" : "OFF");
              
            }}
          >
            {electricity ? (
              <FaToggleOn
                size={30}
                className="text-yellow-500 cursor-pointer"
              />
            ) : (
              <FaToggleOff
                size={30}
                className="text-yellow-500 cursor-pointer"
              />
            )}
          </div>
        </div>

        {/* WATER */}
        <div className="flex justify-between">
          <p className="flex gap-2 items-center">
            <IoIosWater className="text-blue-500" />
            Water
          </p>

          <div
            onClick={() => {
              const newState = !water;
              setWater(newState);

              handleManage("water", newState ? "ON" : "OFF");
            }}
          >
            {water ? (
              <FaToggleOn
                size={30}
                className="text-blue-500 cursor-pointer"
              />
            ) : (
              <FaToggleOff
                size={30}
                className="text-blue-500 cursor-pointer"
              />
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6">
          Powered by ESP32 @2026
        </p>
      </div>
    </section>
  );
};

export default ManageUtilities;
