import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import SummaryApi from '../common/SummaryApi'
import logo from '../assets/smartrent.png'

const Login = () => {
    const [data, setData] = useState({
        phone: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({ ...SummaryApi.login, data: data })
            if (response.data.error) toast.error(response.data.error)
            if (response.data.success) {
                toast.success(response.data.message)
                const userRole = response.data.data?.role
                setData({ phone: "", password: "" })
                if (userRole === "landlord") navigate("/landlorddashboard/landlordstatistics")
                else if (userRole === "tenant") navigate("/tenantdashboard/tenantstatistics")
                else toast.error("Unknown role. Please contact admin.")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white overflow-hidden">
            <div className="bg-white w-auto lg:w-[30vw] p-8 rounded-3xl shadow-xl flex flex-col justify-center">
                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="SmartRent Logo" className="w-24 h-24 mb-3" />
                    <h1 className="text-3xl font-bold text-green-600">Login</h1>
                    <p className="text-sm text-red-600 mt-1 bg-red-100 p-2 rounded w-full text-center">
                        No Account!!! Register With your Landlord
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div className="mt-2 mb-2">
                        <label className="block text-gray-700 font-medium mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={data.phone}
                            onChange={handleChange}
                            placeholder="Enter Phone..."
                            className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                    </div>
                    <div className="mt-2 mb-2">
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-green-300">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Enter Password..."
                                className="w-full outline-none"
                            />
                            <span onClick={() => setShowPassword(prev => !prev)} className="cursor-pointer text-gray-500">
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg mt-2 mb-2 transition-all"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-gray-500 mt-4">
                    Landlord don't have an account? <Link to="/register" className="text-green-500 font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </section>
    )
}

export default Login