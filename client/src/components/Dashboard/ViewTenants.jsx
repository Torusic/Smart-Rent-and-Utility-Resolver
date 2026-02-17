import React, { useState, useEffect } from 'react'
import Divider from '../Divider'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../../utils/AxiosToastError'
import { FaSearch } from 'react-icons/fa'
import Action from '../Action'
import ManageUtilities from '../ManageUtilities'
import { formatCurrency } from '../../utils/formatCurrency'

const ViewTenants = ({ fetchDashboard }) => {

  const [data, setData] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState(false)
  const [remove, setRemove] = useState("")
  const [manageUtilities, setManageUtilities] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState(null)

  // ✅ Apartment Financial Summary State
  const [apartmentSummary, setApartmentSummary] = useState({
    totalExpected: 0,
    totalPaid: 0,
    totalUnpaid: 0
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const tenantsPerPage = 10

  // ================= FETCH TENANTS =================
  const fetchTenants = async () => {
    try {
      const response = await Axios({ ...SummaryApi.view })

      if (response.data.success) {
        setData(response.data.tenants || [])

        if (response.data.apartmentSummary) {
          setApartmentSummary(response.data.apartmentSummary)
          
        }
      } else {
        toast.error(response.data.message || "No tenants found")
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  // ================= SEARCH =================
  const searchTenant = async () => {

    if (!query) {
      fetchTenants()
      return
    }

    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.search,
        url: `${SummaryApi.search.url}?query=${query}`,
      })

      if (response.data.success) {
        setData(response.data.tenants || [])
        setCurrentPage(1)
      } else {
        setData([])
        toast.error(response.data.message || "Tenant not found")
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      searchTenant()
    }, 500)

    return () => clearTimeout(delay)
  }, [query])

  useEffect(() => {
    fetchTenants()
  }, [])

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.removeTenant,
        data: { tenantId: remove }
      })

      if (response.data.success) {
        toast.success(response.data.message)
        fetchTenants()
        setAction(false)
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const indexOfLastTenant = currentPage * tenantsPerPage
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage
  const currentTenants = data.slice(indexOfFirstTenant, indexOfLastTenant)
  const totalPages = Math.ceil(data.length / tenantsPerPage)

  return (
    <section  className="bg-white h-full overflow-y-auto scrollbar-hidden shadow p-2 w-full container mx-auto  rounded-xl">

      

      {/* SEARCH */}
      <div className='sticky  top-0 p-2 bg-green-50 rounded-t-lg '>
         <h2 className="text-green-500 font-semibold mb-4">All Tenants</h2>
        <div className="flex gap-2  px-2 mb-3 rounded-lg bg-gray-100 ">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by phone, email, or room"
          className="px-3 py-2 outline-none rounded w-full"
        />
        <FaSearch size={20} className='text-green-400 mt-3' />
      </div>
      </div>
       
        

      <div className="grid sticky  bg-green-50 top-23 grid-cols-1 md:grid-cols-3 p-2 gap-4 ">

        <div className="bg-green-50 p-4 rounded-xl shadow border border-green-200">
          <h3 className="text-sm text-gray-600">Total Expected Rent</h3>
          <p className="text-xl font-bold text-green-600">
             {formatCurrency(apartmentSummary.totalExpected)}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl shadow border border-blue-200">
          <h3 className="text-sm text-gray-600">Total Rent Paid</h3>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(apartmentSummary.totalPaid)}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-xl shadow border border-red-200">
          <h3 className="text-sm text-gray-600">Total Unpaid Rent</h3>
          <p className="text-xl font-bold text-red-600">
             {formatCurrency(apartmentSummary.totalUnpaid)}
          </p>
        </div>

      </div>

      
      {data.length === 0 ? (
        <p className="text-gray-500">No tenants yet.</p>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full  text-sm ">
            <thead className="bg-green-300 text-left">
              <tr>
                <th className="px-4 py-2 ">#</th>
                <th className="px-4 py-2 ">Name</th>
                <th className="px-4 py-2  hidden lg:table-cell">Email</th>
                <th className="px-4 py-2  hidden lg:table-cell">Phone</th>
                <th className="px-4 py-2  hidden lg:table-cell">Room</th>
                <th className="px-4 py-2  hidden lg:table-cell">Total Rent</th>
                <th className="px-4 py-2  hidden lg:table-cell">Paid</th>
                <th className="px-4 py-2  hidden lg:table-cell">Balance</th>
                <th className="px-4 py-2  hidden lg:table-cell">Rent Status</th>
                <th className="px-4 py-2  hidden lg:table-cell">Electricity</th>
                <th className="px-4 py-2  hidden lg:table-cell">Water</th>
                <th className="px-4 py-2 bg-red-400">Action (Manage Utilities or Remove tenants)</th>
              </tr>
            </thead>


            <tbody>
              {currentTenants.map((tenant, index) => {

                const totalRent = tenant.payment?.totalRent || 0
                const amountPaid = tenant.payment?.amountPaid || 0
                const balance = totalRent - amountPaid

                const rentStatus =
                  balance <= 0
                    ? "Paid"
                    : amountPaid === 0
                    ? "Unpaid"
                    : "Partially"

                return (
                  <tr key={tenant._id} className="hover:bg-green-50">

                    <td className="px-4 py-2 ">
                      {indexOfFirstTenant + index + 1}
                    </td>

                    <td className="px-4 py-2 ">{tenant.name}</td>
                    <td className="px-4 py-2  hidden lg:table-cell">{tenant.email}</td>
                    <td className="px-4 py-2  hidden lg:table-cell">{tenant.phone}</td>
                    <td className="px-4 py-2  hidden lg:table-cell">{tenant.room}</td>

                    <td className="px-4 py-2  hidden text-green-400 font-semibold lg:table-cell">
                      {formatCurrency(totalRent)}
                    </td>

                    <td className="px-4 py-2 text-blue-400 font-semibold  hidden lg:table-cell">
                      {formatCurrency(amountPaid)}
                    </td>

                    <td className="px-4 py-2  text-red-500 font-semibold hidden lg:table-cell">
                      {formatCurrency(balance)}
                    </td>

                    {/* RENT STATUS */}
                    <td className="px-4 py-2  hidden lg:table-cell">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs ${
                          rentStatus === "Paid"
                            ? "bg-green-500"
                            : rentStatus === "Partial Paid"
                            ? "bg-green-500"
                            : "bg-green-500"
                        }`}
                      >
                        {rentStatus}
                      </span>
                    </td>

                    {/* ELECTRICITY STATUS */}
                    <td className="px-4 py-2 hidden lg:table-cell">
                      <span
                        className="px-3 py-1 rounded-full text-white bg-yellow-500 font-semibold text-xs"
                       >
                        {tenant.utilities?.electricityStatus}
                      </span>
                    </td>

                    {/* WATER STATUS */}
                    <td className="px-4 py-2  hidden lg:table-cell">
                      <span
                        className='px-3 py-1 rounded-full text-white bg-blue-500 text-xs '
                          
                      >
                        {tenant.utilities?.waterStatus}
                      </span>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="px-4 py-2 items-center justify-center flex gap-4">
                      <button
                        onClick={() => {
                          setSelectedTenant(tenant)
                          setManageUtilities(true)
                        }}
                        
                        className="bg-green-50 border rounded border-green-300 text-green-600 px-2 py-1"
                      >
                        Manage
                      </button>

                      <button
                        onClick={() => {
                          setAction(true)
                          setRemove(tenant._id)
                        }}
                        className="bg-red-50 rounded border border-red-300 text-red-600 px-2 py-1"
                      >
                        Remove
                      </button>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-green-300 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-3 py-1 bg-gray-100 rounded">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-green-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

        </div>
      )}

      {/* MODALS */}
      {manageUtilities && (
        <ManageUtilities
          tenant={selectedTenant}
          close={() => setManageUtilities(false)}
          fetch={fetchTenants()}
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
  )
}

export default ViewTenants
