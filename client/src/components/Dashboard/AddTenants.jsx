import React, { useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const AddTenants = () => {

  const [tenant, setTenant] = useState({
    name: "",
    email: "",
    phone: "",
    room: "",
    rent: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTenant(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!tenant.name || !tenant.phone || !tenant.room || !tenant.rent) {
    toast.error("Please fill all required fields");
    return;
  }

  try {
    setLoading(true);

    const response = await Axios({
      ...SummaryApi.add,
      data: tenant,
    });

    if (response.data.success) {
      toast.success("Tenant added successfully!");

      setTenant({
        name: "",
        email: "",
        phone: "",
        room: "",
        rent: "",
      });

      console.log("Backend Response:", response.data);
      toast.success("Check tenant phone for SMS notification");
      navigate("/landlorddashboard/landlordstatistics");
    } else {
      toast.error(response.data.message);
    }

  } catch (error) {
    AxiosToastError(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="flex justify-center items-center  bg-gradient-to-br bg-white p-6">

      <div className="w-full border-l-4 rounded-2xl border-green-400 max-w-8xl bg-white p-10 ">
      
        
        <p onClick={() => window.history.back()} className="cursor-pointer flex items-center w-10 text- rounded-lg bg-gray-100 p-2  text-black font-semibold"><BsArrowLeft size={20}/></p>
        <h2 className="text-3xl font-bold text-green-600 text-center mb-10 tracking-wide">
          Add New Tenant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="font-semibold text-gray-600 mb-2 block">
                Tenant Name *
              </label>

              <input
                type="text"
                placeholder="Enter tenant name"
                name="name"
                value={tenant.name}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-300
                focus:border-green-500 outline-none focus:ring-2 focus:ring-green-200 transition"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-600 mb-2 block">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter tenant email"
                name="email"
                value={tenant.email}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-300
                focus:border-green-500 outline-none focus:ring-2 focus:ring-green-200 transition"
              />
            </div>

          </div>

          {/* PHONE + ROOM */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="font-semibold text-gray-600 mb-2 block">
                Phone Number *
              </label>

              <input
                type="tel"
                placeholder="Enter phone number"
                name="phone"
                value={tenant.phone}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-300
                focus:border-green-500 outline-none focus:ring-2 focus:ring-green-200 transition"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-600 mb-2 block">
                Room Number *
              </label>

              <input
                type="number"
                placeholder="Enter room number"
                name="room"
                value={tenant.room}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-300
                focus:border-green-500 outline-none focus:ring-2 focus:ring-green-200 transition"
              />
            </div>

          </div>

          {/* RENT */}
          <div>
            <label className="font-semibold text-gray-600 mb-2 block">
              Monthly Rent Amount *
            </label>

            <input
              type="number"
              placeholder="Enter rent amount"
              name="rent"
              value={tenant.rent}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-gray-300
              focus:border-green-500 outline-none focus:ring-2 focus:ring-green-200 transition"
            />
          </div>

          {/* SUBMIT BUTTON */}
         <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition hover:scale-[1.02] active:scale-95 shadow-md disabled:opacity-50"
            >
              {loading ? "Processing..." : "Add Tenant"}
          </button>

        </form>
      </div>
    </section>
  );
};

export default AddTenants;