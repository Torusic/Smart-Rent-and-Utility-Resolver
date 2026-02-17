import React, { useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";

const AddTenants = () => {
  const [tenant, setTenant] = useState({
    name: "",
    email: "",
    phone: "",
    room: "",
    rent: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTenant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tenant.name || !tenant.phone || !tenant.room || !tenant.rent) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.add,
        data: tenant,
      });

      if (response.data.success) {
        toast.success(response.data.message);

        setTenant({ name: "", email: "", phone: "", room: "", rent: "" });

        navigate("/landlorddashboard/landlordstatistics");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="flex justify-center items-center h-full bg-white px-4 animate-fadeIn">
      {/* Card */}
      <div className="w-full max-w-8xl bg-white min-h-150  rounded-2xl p-10
        transition-all duration-500 ">
        
        <h2 className="text-3xl font-bold text-green-600 mb-8 text-center animate-fadeInDown">
          Add New Tenant
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Name + Email */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col flex-1">
              <label className="font-semibold mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter tenant name"
                name="name"
                value={tenant.name}
                onChange={handleChange}
                className="w-full p-4 rounded-lg border border-gray-300 focus:border-green-500 outline-none focus:ring-1 focus:ring-green-200 transition"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className="font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter tenant email"
                name="email"
                value={tenant.email}
                onChange={handleChange}
                className="w-full p-4 rounded-lg border border-gray-300 focus:border-green-500 outline-none focus:ring-1 focus:ring-green-200 transition"
              />
            </div>
          </div>

          {/* Phone + Room */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col flex-1">
              <label className="font-semibold mb-2">Phone</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                name="phone"
                value={tenant.phone}
                onChange={handleChange}
                className="w-full p-4 rounded-lg border border-gray-300 focus:border-green-500 outline-none focus:ring-1 focus:ring-green-200 transition"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className="font-semibold mb-2">Room</label>
              <input
                type="number"
                placeholder="Enter room number"
                name="room"
                value={tenant.room}
                onChange={handleChange}
                className="w-full p-4 rounded-lg border border-gray-300 focus:border-green-500 outline-none focus:ring-1 focus:ring-green-200 transition"
              />
            </div>
          </div>

          {/* Rent */}
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Rent Amount</label>
            <input
              type="number"
              placeholder="Enter rent amount"
              name="rent"
              value={tenant.rent}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border border-gray-300 focus:border-green-500 outline-none focus:ring-1 focus:ring-green-200 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-600 text-white py-4 rounded-lg font-semibold
              transition-all duration-300 hover:bg-green-700 hover:scale-[1.02] active:scale-95 shadow-md"
          >
            Add Tenant
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddTenants;
