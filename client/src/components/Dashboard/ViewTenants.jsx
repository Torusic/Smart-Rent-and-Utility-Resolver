import React, { useState, useEffect } from "react";
import Divider from "../Divider";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError";
import { FaEdit, FaSearch } from "react-icons/fa";
import Action from "../Action";
import ManageUtilities from "../ManageUtilities";
import { formatCurrency } from "../../utils/formatCurrency";
import UpdateTenants from "./UpdateTenants";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

const ViewTenants = ({ fetchDashboard }) => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(false);
  const [update, setUpdate] = useState(false);
  const [remove, setRemove] = useState("");
  const [manageUtilities, setManageUtilities] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const [apartmentSummary, setApartmentSummary] = useState({
    totalExpected: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const tenantsPerPage = 10;

  const fetchTenants = async () => {
    try {
      const response = await Axios({ ...SummaryApi.view });

      if (response.data.success) {
        setData(response.data.tenants || []);
        if (response.data.apartmentSummary) {
          setApartmentSummary(response.data.apartmentSummary);
        }
      } else {
        toast.error(response.data.message || "No tenants found");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const searchTenant = async () => {
    if (!query) {
      fetchTenants();
      return;
    }

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.search,
        url: `${SummaryApi.search.url}?query=${query}`,
      });

      if (response.data.success) {
        setData(response.data.tenants || []);
        setCurrentPage(1);
      } else {
        setData([]);
        toast.error(response.data.message || "Tenant not found");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      searchTenant();
    }, 500);
    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.removeTenant,
        data: { tenantId: remove },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTenants();
        setAction(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const resetState = () => {
    setQuery("");
    setCurrentPage(1);
    setSelectedTenant(null);
    setAction(false);
    setManageUtilities(false);
  };

  const resetMonthlyPayments = () => {
    setApartmentSummary((prev) => ({
      totalExpected: prev.totalExpected,
      totalPaid: 0,
      totalUnpaid: prev.totalExpected,
    }));

    setData((prevData) =>
      prevData.map((tenant) => ({
        ...tenant,
        payment: {
          totalRent: tenant.payment?.totalRent || 0,
          amountPaid: 0,
        },
      }))
    );

    toast.success("Monthly payments reset!");
  };

 useEffect(() => {
  if (!data.length) return;

  const today = new Date();

  const updatedTenants = data.map((tenant) => {
    const moveInDate = new Date(tenant.createdAt);

    const billingDay = moveInDate.getDate();
    const todayDate = today.getDate();

   
    if (billingDay === todayDate) {
      return {
        ...tenant,
        payment: {
          ...tenant.payment,
          amountPaid: 0
        }
      };
    }

    return tenant;
  });

  setData(updatedTenants);
}, [data.length]);

  useEffect(() => {
    const { totalPaid, totalExpected } = apartmentSummary;
    if (totalPaid === totalExpected && totalExpected > 0) {
      resetState();
      toast.success("All rents are fully paid!");
    }
  }, [apartmentSummary]);

  const indexOfLastTenant = currentPage * tenantsPerPage;
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage;
  const currentTenants = data.slice(indexOfFirstTenant, indexOfLastTenant);
  const totalPages = Math.ceil(data.length / tenantsPerPage);

  return (
    <section className="bg-gray-50 h-full overflow-y-auto scrollbar-hidden p-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl rounded-2xl border-l-4 border-green-500 shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex justify-between gap-2 items-center">
            <p onClick={() => window.history.back()} className="cursor-pointer flex items-center rounded-lg bg-gray-100 p-2  text-gray-500 hover:text-gray-700"><BsArrowLeft size={20}/></p>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                Tenant Management
             </h2>
             
            
          </div>
          <div className="bg-gray-100 p-2 rounded-2xl border-l-4 border-green-500 grid">
            <p className="font-semibold text-sm py-2 text-green-500">key</p>
            <div className="flex gap-2 items-center justify-between">
              <p className="font-semibold text-gray-400 text-xs">⚡Electricity</p>
              <p className="font-semibold text-gray-400 text-xs">💧Water</p>
            </div>

          </div>
        
        <p className="text-sm font-semibold flex items-center gap-2 text-gray-700 " >Add tenant<Link to="/landlorddashboard/addtenants" className="bg-gray-200 cursor-pointer p-2 rounded-lg"><IoMdAdd /></Link></p>
        </div>
        

        <div className="flex  items-center bg-gray-100 rounded-xl px-4 py-2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by phone, email, or room..."
            className="bg-transparent outline-none ml-3 w-full"
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Total Expected Rent</p>
          <h3 className="text-2xl font-bold text-green-600">
            {formatCurrency(apartmentSummary.totalExpected)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Rent Paid</p>
          <h3 className="text-2xl font-bold text-blue-600">
            {formatCurrency(apartmentSummary.totalPaid)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">Total Unpaid Rent</p>
          <h3 className="text-2xl font-bold text-red-600">
            {formatCurrency(apartmentSummary.totalUnpaid)}
          </h3>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {data.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No tenants found.
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hidden h-full rounded-2xl border-l-4 border-gray-400">
            <table className="w-full  text-xs">
              <thead className="bg-gray-100  text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3 text-left">Rent</th>
                  <th className="px-4 py-3 text-left">Paid</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-18 py-3">Move-In Date</th>
                  <th className="px-5 py-3">Utilities</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="">
                {currentTenants.map((tenant, index) => {
                  const totalRent = tenant.payment?.totalRent || 0;
                  const amountPaid = tenant.payment?.amountPaid || 0;
                  const balance = totalRent - amountPaid;

                  const rentStatus =
                    balance <= 0
                      ? "Paid"
                      : amountPaid === 0
                      ? "Unpaid"
                      : "Partial";

                  return (
                    <tr 
                      key={tenant._id}
                      className=" hover:bg-gray-50 transition "
                    >
                      <td className="px-4 py-3">
                        {indexOfFirstTenant + index + 1}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {tenant.name}
                      </td>
                     
                      <td className="px-4 py-3 font-medium">
                        {tenant.phone}
                      </td>
                      <td className="px-4 py-3">{tenant.room}</td>
                      <td className="px-4 py-3 font-medium">
                        {tenant.payment?.totalRent}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {tenant.payment?.amountPaid || 0}
                      </td>
                      <td className="px-4 py-3 text-red-500 font-semibold">
                        {formatCurrency(balance)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full text-white ${
                            rentStatus === "Paid"
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : rentStatus === "Partial"
                              ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                              : "bg-gradient-to-r from-red-500 to-red-600"
                          }`}
                        >
                          {rentStatus}
                        </span>
                      </td>
                      <td className="px-8 py-3">
                         {new Date(tenant.createdAt).toLocaleString()}
                      </td>
                     <td className="py-3 text-xs  font-semibold">
                            <span
                              className={`mr-2  ${
                                tenant.utilities?.electricityStatus === "ON"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                              }`}
                            >
                              ⚡ {tenant.utilities?.electricityStatus || "OFF"} 
                            </span>
                          

                            <span
                              className={
                                tenant.utilities?.waterStatus === "ON"
                                  ? "text-blue-500"
                                  : "text-red-500"
                              }
                            >
                              💧 {tenant.utilities?.waterStatus || "OFF"}
                            </span>
                          </td>
                      <td className="px-4 py-3 flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setManageUtilities(true);
                          }}
                          className="px-3 py-1 rounded-lg flex items-center gap-2 cursor-pointer  bg-green-100 text-green-700 hover:bg-green-200"
                        >
                          <MdManageAccounts />
                          Manage
                        </button>

                        <button
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setUpdate(true);
                          }}
                          className="px-3 py-1 flex items-center gap-2 cursor-pointer rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          <FaEdit />
                          Update
                        </button>

                        <button
                          onClick={() => {
                            setAction(true);
                            setRemove(tenant._id);
                          }}
                          className="px-3 py-1 rounded-lg cursor-pointer flex items-center gap-2 cursor-pointe bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          <RiDeleteBin5Line />
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 p-4 ">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg cursor-pointer bg-gray-200 disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-200 cursor-pointer disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {manageUtilities && (
        <ManageUtilities
          tenant={selectedTenant}
          close={() => setManageUtilities(false)}
          fetch={fetchTenants}
        />
      )}

      {update && (
        <UpdateTenants
          tenant={selectedTenant}
          close={() => setUpdate(false)}
          fetch={fetchTenants}
        />
      )}

      {action && (
        <Action
          close={() => setAction(false)}
          cancel={() => setAction(false)}
          confirm={handleDelete}
        />
      )}
    </section>
  );
};

export default ViewTenants;