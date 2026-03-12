import React, { useState, useEffect } from 'react'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../../utils/AxiosToastError'
import { FaSearch } from 'react-icons/fa'

function View() {

    const [tenantData, setTenantData] = useState([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const tenantsPerPage = 10

    const indexOfLastTenant = currentPage * tenantsPerPage
    const indexOfFirstTenant = indexOfLastTenant - tenantsPerPage
    const currentTenants = tenantData.slice(indexOfFirstTenant, indexOfLastTenant)
    const totalPages = Math.ceil(tenantData.length / tenantsPerPage)

    const fetchTenants = async () => {
        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.view,
            })

            if (response.data.success) {
                setTenantData(response.data.tenants || [])
                toast.success(response.data.message)
            } else {
                toast.error(response.data.error)
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTenants()
    }, [])

    const searchTenant = async () => {

        if (!query) {
            fetchTenants()
            return
        }

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.search,
                url: `${SummaryApi.search.url}?query=${query}`
            })

            if (response.data.success) {
                setTenantData(response.data.tenants || [])
                setCurrentPage(1)
            } else {
                setTenantData([])
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

    return (
        <section className=" p-3 overflow-y-auto scrollbar-hidden  h-full">

            <div className="bg-white    h-full  shadow-sm">

                <div className="p-4 border-b border-gray-100">

                    <h2 className="text-lg font-semibold text-green-500 mb-3">
                        View Tenants
                    </h2>

                    <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 hover:ring-1 hover:ring-green-400 transition">
                        <FaSearch className="text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by room..."
                            className="bg-transparent outline-none ml-3 w-full text-sm"
                        />
                    </div>

                </div>

                <div className="p-4  ">

                    {loading ? (

                        <p className="text-center text-gray-400 py-10 text-sm">
                            Loading tenants...
                        </p>

                    ) : tenantData.length > 0 ? (

                        <div className="overflow-x-auto rounded-2xl border-l-4 border-gray-200 rounded-xl">

                            <table className="w-full  table-fixed border-collapse text-xs">

                                <thead className="bg-gray-200 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 text-left w-16">#</th>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 w-32">Room</th>
                                        <th className="px-4 py-3 w-48">Move-In Date</th>
                                    </tr>
                                </thead>

                                <tbody className="text-sm">

                                    {currentTenants.map((tenant, index) => (
                                        <tr key={tenant._id || index}
                                            className="hover:bg-green-50 transition">

                                            <td className="px-4 py-3 text-gray-500">
                                                {indexOfFirstTenant + index + 1}
                                            </td>

                                            <td className="px-4 py-3 font-medium truncate">
                                                {tenant.name}
                                            </td>

                                            <td className="px-4 py-3 text-green-600 font-medium">
                                                {tenant.room}
                                            </td>

                                            <td className="px-4 py-3 text-gray-500 text-xs">
                                                {new Date(tenant.createdAt).toLocaleString()}
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 ">
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

                    ) : (

                        <p className="text-center text-gray-400 py-10 text-sm">
                            No tenants available
                        </p>
                    )}

                </div>
            </div>
        </section>
    )
}

export default View