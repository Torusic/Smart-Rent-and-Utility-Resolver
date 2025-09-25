import React, { useState, useEffect } from 'react'
import Divider from '../Divider'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../../utils/AxiosToastError'
import { FaSearch } from 'react-icons/fa'

const ViewTenants = ({ fetchDashboard }) => {
  const [data, setData] = useState([])
  const [stats, setStats] = useState({})
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ Fetch all tenants initially
  const fetchTenants = async () => {
    try {
      const response = await Axios({ ...SummaryApi.view })
      if (response.data.tenants && response.data.tenants.length > 0) {
        setData(response.data.tenants)
        toast.success(response.data.message || "Tenants loaded")
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
      url: `${SummaryApi.search.url}?query=${query}`, // add query to endpoint
    })

    if (response.data.success) {
      setData(response.data.tenants || [])
      toast.success(response.data.message)
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
    fetchTenants()
    fetchDashboard?.()
  }, [])

  return (
    <section className="bg-white shadow-md p-4 w-full container mx-auto border border-green-400 rounded">
      <h2 className="text-green-500 font-semibold mb-4">All Tenants</h2>

      {/* ✅ Search Input */}
      <div className="flex gap-2 px-2 mb-4 bg-blue-50  border border-blue-50 outline-none ">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by phone, email, or room"
          className=" px-3 py-2 outline-none rounded w-full"
        />
        <button
          onClick={searchTenant}
          disabled={loading}
       
        >
        <FaSearch size={20}  className='text-green-400'/>
        </button>
      </div>

      <span className='text-black'>{stats.rentedRooms}</span>

      {data.length === 0 ? (
        <p className="text-gray-500">No tenants yet.</p>
      ) : (
        <div className=" h-120 overflow-x-auto scrollbar-hidden">
          <table className="w-full border border-green-400 text-sm">
            <thead className="bg-green-300 text-left font-light">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Room</th>
                <th className="px-4 py-2 border">Rent</th>
                <th className="px-4 py-2 border">Water</th>
                <th className="px-4 py-2 border">Electricity</th>
                <th className="px-7 py-2 border bg-red-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tenant, index) => (
                <tr key={tenant._id} className="hover:bg-gray-50 font-light">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{tenant.name}</td>
                  <td className="px-4 py-2 border">{tenant.email}</td>
                  <td className="px-4 py-2 border">{tenant.phone}</td>
                  <td className="px-4 py-2 border">{tenant.room}</td>
                  <td className="px-4 py-2 border">Ksh {tenant.rent}</td>
                  <td className="px-4 py-2 border">{tenant.utilities?.water}</td>
                  <td className="px-4 py-2 border">{tenant.utilities?.electricity}</td>
                  <td className="px-4 py-2 border">
                    <button className="bg-red-300 font-semibold text-red-600 ml-2 px-2 rounded py-1 cursor-pointer">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              
            </tbody>
          </table>
          <h2 className='flex items-center justify-center mt-6 text-red-500 font-light'>No more More tenants...</h2>
        </div>
      )}
    </section>
  )
}

export default ViewTenants
