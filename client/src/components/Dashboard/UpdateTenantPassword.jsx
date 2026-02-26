import React, { useState } from 'react'
import AxiosToastError from '../../utils/AxiosToastError'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import { LuLoaderCircle } from 'react-icons/lu'

const UpdateTenantPassword = () => {

  const [tenantUpdatePassword, setTenantUpdatePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setTenantUpdatePassword(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const passwordStrength = () => {
    const length = tenantUpdatePassword.newPassword.length

    if (length > 10) return "Strong"
    if (length > 6) return "Medium"
    if (length > 0) return "Weak"
    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (tenantUpdatePassword.newPassword !== tenantUpdatePassword.confirmNewPassword) {
      toast.error("Password dont match")
      return
    }

    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.updateTenantPassword,
        data: tenantUpdatePassword
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)

        setTenantUpdatePassword({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        })
      }

    } catch (error) {
      AxiosToastError(error)

    } finally {
      setLoading(false)
    }
  }

  const strength = passwordStrength()

  return (
    <section className="h-full overflow-y-auto scrollbar-hidden flex justify-center items-center p-6 bg-gradient-to-br bg-white animate-gradient">

      <div className="w-full max-w-4xl backdrop-blur-xl mt-10 rounded-2xl border-l-4 border-gray-400 bg-white/70 
        overflow-hidden transition-all duration-500">

        {/* Header */}
        <div className="p-6 bg-gradient-to-r  text-gray-800 text-center">
          <h2 className="text-xl font-bold  tracking-wide">
            Update Your Password
          </h2>
          <p className="text-sm opacity-80 mt-1">
            Secure your account with a strong password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Current Password */}
          <div className="relative group">

            <input
              type="text"
              name="currentPassword"
              value={tenantUpdatePassword.currentPassword}
              onChange={handleChange}
              className="peer w-full h-12 px-4 pt-4 bg-transparent border border-gray-200 rounded-xl
              focus:border-green-400 outline-none transition-all duration-300"
              placeholder=" "
            />

            <label className="absolute left-4 top-2 text-xs text-gray-500
            peer-focus:text-green-500 transition-all duration-300">
              Current Password
            </label>
          </div>

          {/* New Password */}
          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={tenantUpdatePassword.newPassword}
              onChange={handleChange}
              className="peer w-full h-12 px-4 pt-4 bg-transparent border border-gray-200 rounded-xl
              focus:border-green-400 outline-none transition-all duration-300"
              placeholder=" "
            />

            <label className="absolute left-4 top-2 text-xs text-gray-500
            peer-focus:text-green-500">
              New Password
            </label>
          </div>

          {/* Confirm Password */}
          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              name="confirmNewPassword"
              value={tenantUpdatePassword.confirmNewPassword}
              onChange={handleChange}
              className="peer w-full h-12 px-4 pt-4 bg-transparent border border-gray-200 rounded-xl
              focus:border-green-400 outline-none transition-all duration-300"
              placeholder=" "
            />

            <label className="absolute left-4 top-2 text-xs text-gray-500
            peer-focus:text-green-500">
              Confirm Password
            </label>
          </div>

          {/* Password Strength Indicator */}
          {tenantUpdatePassword.newPassword && (
            <div className="text-xs font-medium">

              <span className={
                strength === "Strong" ? "text-green-600" :
                  strength === "Medium" ? "text-yellow-500" :
                    "text-red-500"
              }>
                Password Strength: {strength}
              </span>

              <div className="h-1 mt-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${
                  strength === "Strong" ? "w-full bg-green-500" :
                    strength === "Medium" ? "w-2/3 bg-yellow-500" :
                      "w-1/3 bg-red-500"
                }`} />
              </div>
            </div>
          )}

          {/* Show Password */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-green-500 transition">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="accent-green-500"
            />
            Show Passwords
          </label>

          {/* Submit Button */}
          <button
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl
            font-semibold transition-all duration-300 shadow-lg
            ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-[1.02] text-white"
              }`}
          >
            {loading ? (
              <LuLoaderCircle className="animate-spin" size={22} />
            ) : "Update Password"}
          </button>

        </form>
      </div>
    </section>
  )
}

export default UpdateTenantPassword