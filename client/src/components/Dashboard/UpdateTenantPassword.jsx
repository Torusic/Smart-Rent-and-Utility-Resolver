import React, { useState } from 'react'
import AxiosToastError from '../../utils/AxiosToastError'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import { LuLoaderCircle } from 'react-icons/lu'
import { IoEye, IoEyeOff } from 'react-icons/io5'

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
    const password = tenantUpdatePassword.newPassword

    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*]/.test(password)
    const isLongEnough = password.length >= 8

    const score = [hasUpper, hasLower, hasNumber, hasSpecial, isLongEnough]
      .filter(Boolean).length

    if (score >= 5) return "Strong"
    if (score >= 3) return "Medium"
    if (score >= 1) return "Weak"
    return ""
  }

  const strength = passwordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!tenantUpdatePassword.currentPassword ||
        !tenantUpdatePassword.newPassword ||
        !tenantUpdatePassword.confirmNewPassword) {
      toast.error("All fields are required")
      return
    }

    if (tenantUpdatePassword.currentPassword === tenantUpdatePassword.newPassword) {
      toast.error("New password cannot be same as current password")
      return
    }

    if (tenantUpdatePassword.newPassword !== tenantUpdatePassword.confirmNewPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (strength === "Weak") {
      toast.error("Password is too weak")
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
        toast.success("Password updated successfully")

        setTenantUpdatePassword({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        })

        setTimeout(() => {
          
          window.location.href = "/login"
        }, 1500)
      } else {
        toast.error(responseData.message)
      }

    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="h-full overflow-y-auto z-40 scrollbar-hidden flex justify-center items-center p-6 bg-white">

      <div className="w-full max-w-3xl mt-15    backdrop-blur-xl rounded-2xl border-l-4 border-gray-500 bg-white  overflow-hidden">

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
            Update Your Account Password
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Keep your account secure by choosing a strong and unique password that protects your personal and financial information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6">

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={tenantUpdatePassword.currentPassword}
              onChange={handleChange}
              className="peer w-full h-12 px-4 pt-4 border border-gray-300 rounded-xl focus:border-green-500 outline-none transition-all duration-300"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 peer-focus:text-green-500">
              Current Password
            </label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={tenantUpdatePassword.newPassword}
              onChange={handleChange}
              className="peer w-full h-12 px-4 pt-4 border border-gray-300 rounded-xl focus:border-green-500 outline-none transition-all duration-300"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 peer-focus:text-green-500">
              New Password
            </label>

            <p className="text-xs text-gray-500 mt-2">
              Password must contain at least 8 characters including uppercase letters, lowercase letters, numbers and special symbols.
            </p>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmNewPassword"
              value={tenantUpdatePassword.confirmNewPassword}
              onChange={handleChange}
              className="peer w-full h-12 px-4 pt-4 border border-gray-300 rounded-xl focus:border-green-500 outline-none transition-all duration-300"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-xs text-gray-500 peer-focus:text-green-500">
              Confirm New Password
            </label>

            {tenantUpdatePassword.confirmNewPassword &&
             tenantUpdatePassword.newPassword !== tenantUpdatePassword.confirmNewPassword && (
              <p className="text-xs text-red-500 mt-2">
                The passwords entered do not match. Please ensure both fields are identical.
              </p>
            )}
          </div>

          {tenantUpdatePassword.newPassword && (
            <div className="text-xs font-medium">
              <span className={
                strength === "Strong" ? "text-green-600" :
                strength === "Medium" ? "text-yellow-500" :
                "text-red-500"
              }>
                Password Strength: {strength}
              </span>

              <div className="h-2 mt-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${
                  strength === "Strong" ? "w-full bg-green-500" :
                  strength === "Medium" ? "w-2/3 bg-yellow-500" :
                  "w-1/3 bg-red-500"
                }`} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="accent-green-500"
              />
              Show Passwords
            </label>

            <div className="flex items-center gap-1 text-gray-500">
              {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
              <span>Visibility</span>
            </div>
          </div>

          <button
            disabled={
              loading ||
              !tenantUpdatePassword.currentPassword ||
              !tenantUpdatePassword.newPassword ||
              !tenantUpdatePassword.confirmNewPassword ||
              strength === "Weak"
            }
            className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] text-white shadow-md"
            }`}
          >
            {loading ? (
              <LuLoaderCircle className="animate-spin" size={22} />
            ) : "Update Password Securely"}
          </button>

        </form>

        <div className="px-10 pb-8 text-center text-xs text-gray-500">
          After updating your password, you will automatically be logged out to ensure your account remains secure. 
          Always keep your credentials confidential and avoid sharing your login details with anyone.
        </div>

      </div>
    </section>
  )
}

export default UpdateTenantPassword