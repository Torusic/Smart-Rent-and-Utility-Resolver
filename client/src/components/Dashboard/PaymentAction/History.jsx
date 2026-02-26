import React, { useEffect, useState } from "react"
import Axios from "../../../utils/Axios.js"
import SummaryApi from "../../../common/SummaryApi.js"
import Divider from "../../Divider"
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa"
import AxiosToastError from "../../../utils/AxiosToastError"

const History = () => {

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount || 0)
  }

  
  const formatDate = (date) => {
    if (!date) return "N/A"

    return new Date(date).toLocaleString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status = "") => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return <FaCheckCircle className="text-green-500" />

      case "FAILED":
        return <FaTimesCircle className="text-red-500" />

      default:
        return <FaClock className="text-yellow-500" />
    }
  }

  const getStatusColor = (status = "") => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return "text-green-600 bg-green-100"

      case "FAILED":
        return "text-red-600 bg-red-100"

      default:
        return "text-yellow-600 bg-yellow-100"
    }
  }

  // Fetch Payment History (Backend Source)
  const fetchHistory = async () => {
    setLoading(true)

    try {
      const response = await Axios({
        ...SummaryApi.tenantDashboard
      })

      if (response.data.success) {
        const paymentHistory =
          response.data.data?.payment?.history || []

        setHistory(Array.isArray(paymentHistory) ? paymentHistory : [])
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
  )

  return (
    <section className="p-6 bg-white h-full overflow-y-auto scrollbar-hidden">

      <div className="bg-white shadow-lg rounded-xl p-5 max-w-7xl mx-auto">

        <h2 className="text-2xl font-bold mb-2">
          Payment History
        </h2>

        <Divider />

        {loading && (
          <p className="text-gray-500 animate-pulse">
            Loading payment history...
          </p>
        )}

        {!loading && sortedHistory.length === 0 && (
          <p className="text-gray-500">
            No payment history available
          </p>
        )}

        {!loading && sortedHistory.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mt-4 max-h-[600px] overflow-y-auto pr-2 p-3">

            {sortedHistory.map((item, index) => (
              <div
                key={index}
                className="border-l-4 rounded-2xl  border-gray-400 p-4 shadow-md hover:shadow-md transition bg-gray-50"
              >

                <div className="flex justify-between items-center mb-2">

                  <p className="text-sm font-semibold">
                    {item?.description || "Rent Payment"}
                  </p>

                  <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(item?.status)}`}>
                    {getStatusIcon(item?.status)}
                    {(item?.status || "PENDING").toUpperCase()}
                  </span>

                </div>

                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(
                    item?.amount ||
                    item?.amountPaid ||
                    item?.lastPaidAmount
                  )}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(item?.date)}
                </p>

                {item?.transactionId && (
                  <p className="text-xs text-gray-400 mt-2">
                    Transaction ID: {item.transactionId}
                  </p>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  )
}

export default History