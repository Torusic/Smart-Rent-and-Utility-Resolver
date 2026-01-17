import React, { useState, useEffect } from 'react'
import Divider from '../Divider'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../../utils/AxiosToastError'
import { FaSearch } from 'react-icons/fa'
import Action from '../Action'

const ViewTenants = ({ fetchDashboard }) => {
  const [data, setData] = useState([])
  const [stats, setStats] = useState({})
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState(false)
  const [remove, setRemove] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const tenantsPerPage = 10

  //  Fetch all tenants initially
  const fetchTenants = async () => {
    try {
      const response = await Axios({ ...SummaryApi.view })
      if (response.data.tenants && response.data.tenants.length > 0) {
        setData(response.data.tenants)
        if (response.data.stats) setStats(response.data.stats)
      } else if (response.data.error) {
        toast.error(response.data.message || "No tenants found")
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // ✅ Search Tenant by query
  const searchTenant = async () => {
    if (!query) {
      fetchTenants() // reload all tenants if search is empty
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
        setCurrentPage(1) // reset page when search happens
      } else {
        setData([])
        toast.error(response.data.message || "Tenant not found")
        setCurrentPage(1)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // Run search automatically when query changes (debounced)
  useEffect(() => {
    const delay = setTimeout(() => {
      searchTenant()
    }, 500)

    return () => clearTimeout(delay)
  }, [query])

  useEffect(() => {
    fetchTenants()
    //fetchDashboard?.()
  }, [])

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.removeTenant,
        data: { tenantId: remove }
      })
      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        fetchTenants()
        setAction(false)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // Pagination calculations
  const indexOfLastTenant = currentPage * tenantsPerPage
  const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage
  const currentTenants = data.slice(indexOfFirstTenant, indexOfLastTenant)
  const totalPages = Math.ceil(data.length / tenantsPerPage)

  return (
    <section className="bg-green-100 lg:shadow-md p-4 w-full container mx-auto border border-white lg:border-green-400 rounded">
      <h2 className="text-green-500 font-semibold mb-4">All Tenants</h2>

      {/* Search Input */}
      <div className="flex gap-2 px-2 mb-4 bg-blue-50 border border-blue-50 outline-none ">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by phone, email, or room"
          className="px-3 py-2 outline-none rounded w-full"
        />
        <FaSearch size={20} className='text-green-400 mt-3' />
      </div>

      <span className='text-black'>{stats.rentedRooms}</span>

      {data.length === 0 ? (
        <p className="text-gray-500">No tenants yet.</p>
      ) : (
        <div className="h-132.5 overflow-x-auto scrollbar-hidden">
          <table className="w-full rounded border border-green-400  text-sm">
            <thead className="bg-green-300 rounded text-left font-light">
  <tr>
    <th className="px-4 py-2 border border-green-100">#</th>
    <th className="px-4 py-2 border border-green-100">Name</th>
    <th className="px-4 py-2 border border-green-100 hidden lg:table-cell">Email</th>
    <th className="px-4 py-2 border border-green-100 hidden lg:table-cell">Phone</th>
    <th className="px-4 py-2 border border-green-100 hidden lg:table-cell">Room</th>
    <th className="px-4 py-2 border border-green-100 hidden lg:table-cell">Total Rent (KES)</th>
    <th className="px-4 py-2 border border-green-100 hidden lg:table-cell">Amount Paid (KES)</th>
    <th className="px-4 py-2 border border-green-100 hidden lg:table-cell">Rent Balance (KES)</th>
    <th className="px-4 py-2 border border-green-100 hidden lg:table-cell">Rent Status</th>
    <th className="px-4 py-2 border border-green-100 hidden lg:table-cell">Water</th>
    <th className="px-4 py-2 border border-green-100 hidden lg:table-cell">Electricity</th>
    <th className="px-7 py-2 border border-green-100 bg-red-400">Action</th>
  </tr>
</thead>
<tbody>
  {currentTenants.map((tenant, index) => (
    <tr key={tenant._id} className="hover:bg-green-200 text-sm font-semibold">
      <td className="px-4 py-2 border border-green-100">{indexOfFirstTenant + index + 1}</td>
      <td className="px-4 py-2 border border-green-100">{tenant.name}</td>
      <td className="px-4 py-2 border border-green-100 hidden lg:table-cell">{tenant.email}</td>
      <td className="px-4 py-2 border border-green-100 hidden lg:table-cell">{tenant.phone}</td>
      <td className="px-4 py-2 border border-green-100 hidden lg:table-cell">{tenant.room}</td>

      {/* Payment Details */}
      <td className="px-4 py-2 border border-green-100 hidden lg:table-cell">{tenant.payment?.totalRent || tenant.rent}</td>
      <td className="px-4 py-2 border border-green-100 hidden lg:table-cell">{tenant.payment?.amountPaid || 0}</td>
      <td className="px-4 py-2 border border-green-100 hidden lg:table-cell text-red-500 font-bold">{tenant.payment?.balance}</td>
      <td className="px-4 py-2 border border-green-100 font-bold text-green-400 hidden lg:table-cell">{tenant.rentStatus}</td>

      {/* Utilities */}
      <td className="px-4 py-2 border border-green-100 hidden font-bold text-yellow-400  lg:table-cell">{tenant.utilities?.waterStatus || 0}</td>
      <td className="px-4 py-2 border border-green-100 hidden font-bold text-blue-400  lg:table-cell">{tenant.utilities?.electricityStatus|| 0}</td>

      {/* Action */}
      <td className="px-4 py-2 border border-green-100">
        <button
          onClick={() => {
            setAction(true)
            setRemove(tenant._id)
          }}
          className="bg-red-300 font-semibold text-red-600 ml-2 px-2 rounded py-1 cursor-pointer"
        >
          Remove
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-green-300 cursor-pointer rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-3 py-1 bg-gray-100 rounded">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-green-300 rounded cursor-pointer disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
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
