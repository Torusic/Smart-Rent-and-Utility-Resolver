import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import logo from '../assets/smartrent.png'

const RegisterPage = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        totalRooms: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        try {
            const response = await Axios({ ...SummaryApi.register, data: data })
            if (response.data.error) toast.error(response.data.error)
            if (response.data.success) {
                toast.success(response.data.message)
                setData({ name: "", email: "", phone: "", password: "", confirmPassword: "", totalRooms: "" })
                navigate('/login')
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="w-full h-screen flex items-center justify-center p-3 bg-gradient-to-br from-green-50 to-white overflow-hidden">
            <div className="bg-white w-auto lg:max-w-2xl p-8 rounded-3xl shadow-xl flex flex-col justify-center h-full">
                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="SmartRent Logo" className="w-20 h-20 mb-2" />
                    <h1 className="text-2xl font-bold text-green-600">Landlord Registration</h1>
                    <p className="text-sm text-gray-500 mt-1">Only landlords can register</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-hidden">
                    <div className="mt-2 mb-2 mr-1 ml-1">
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                    </div>
                    <div className="mt-2 mb-2 mr-1 ml-1">
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                    </div>
                    <div className="mt-2 mb-2 mr-1 ml-1">
                        <label className="block text-gray-700 font-medium mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={data.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-2 border rounded-lg border-gray-300  focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-2 mb-2 mr-1 ml-1">
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-1">Password</label>
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-300">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className="w-full outline-none"
                                />
                                <span onClick={() => setShowPassword(prev => !prev)} className="cursor-pointer text-gray-500">
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-300">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    className="w-full outline-none"
                                />
                                <span onClick={() => setShowConfirmPassword(prev => !prev)} className="cursor-pointer text-gray-500">
                                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 mb-2 mr-1 ml-1">
                        <label className="block text-gray-700 font-medium mb-1">Total Rooms</label>
                        <input
                            type="text"
                            name="totalRooms"
                            value={data.totalRooms}
                            onChange={handleChange}
                            placeholder="Enter total rooms"
                            className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all mt-2 mb-2"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-gray-500 mt-4">
                    Already have an account? <Link to="/login" className="text-green-500 font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </section>
    )
}

export default RegisterPage