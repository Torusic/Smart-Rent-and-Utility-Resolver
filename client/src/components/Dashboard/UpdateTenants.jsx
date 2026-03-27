import React, { useEffect, useState } from 'react'
import { IoClose, IoInformationCircle, IoSyncCircleSharp } from 'react-icons/io5'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import toast from 'react-hot-toast'
import { motion } from "framer-motion";
import { LuLoader, LuLoaderCircle } from 'react-icons/lu'
import { MdMarkEmailRead } from 'react-icons/md'
import { FaHouseUser } from 'react-icons/fa'

function UpdateTenants({ tenant, close, fetch }) {

    const tenantId = tenant?._id
    const [loading, setLoading] = useState(false)

    const [tenantData, setTenantData] = useState({
        name: "",
        email: "",
        phone: "",
        room: "",
    })

    useEffect(() => {
        if (tenant) {
            setTenantData({
                name: tenant.name || "",
                email: tenant.email || "",
                phone: tenant.phone || "",
                room: tenant.room || "",
            })
        }
    }, [tenant])

    const handleChange = (e) => {
        const { name, value } = e.target
        setTenantData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await Axios({
                url: `/api/LandLord/tenant/${tenantId}`,
                method: "put",
                data: tenantData,
                withCredentials: true
            })

            toast.success("Tenant updated successfully")
            close && close()

        } catch (error) {
            toast.error("Failed to update tenant")
        } finally {
            setLoading(false)
        }
    }

    if (fetch) fetch()

    return (
        <div className='fixed z-70 inset-0 backdrop-blur-sm flex justify-center items-center p-2 bg-gray-900/70'>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className='max-w-4xl w-full rounded-lg p-4 bg-white'>

                <div className='flex justify-between items-center'>
                    <h1 className="lg:text-xl text-sm  text-green-400 font-bold">
                        Update tenant in room: {tenantData.room}
                    </h1>

                    <button onClick={close} className="text-xl">
                        <IoClose className='cursor-pointer' />
                    </button>
                </div>

                <div className='bg-green-50 border border-green-200 text-gray-700 text-xs p-3 rounded mt-3 space-y-1'>
                    <p className='flex items-center gap-1'><IoInformationCircle size={16} className='text-green-500'/> Updating tenant details will immediately reflect in rent tracking and reports.</p>
                    <p className='flex items-center gap-1'><MdMarkEmailRead size={16} className='text-green-500' />Changing email or phone may affect notifications and communication.</p>
                    <p className='flex items-center gap-1'><FaHouseUser size={16} className='text-green-500'/> Changing room number will update room occupancy records.</p>
                    <p className='flex items-center gap-1'><IoSyncCircleSharp size={16} className='text-green-500'/> Ensure all information is correct before saving changes.</p>
                </div>

                <form className='mt-4 p-2' onSubmit={handleSubmit}>

                    <div className='grid grid-cols-2 gap-3 lg:text-sm text-xs font-semibold text-gray-700'>

                        <div className='grid gap-2'>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={tenantData.name}
                                onChange={handleChange}
                                className='px-2 py-3 border border-gray-200 font-normal bg-gray-50 rounded-lg text-gray-600 outline-none'
                            />
                        </div>

                        <div className='grid gap-2'>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={tenantData.email}
                                onChange={handleChange}
                                className='px-2 py-3 border border-gray-200 font-normal bg-gray-50 rounded-lg text-gray-600 outline-none'
                            />
                        </div>

                        <div className='grid gap-2'>
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={tenantData.phone}
                                onChange={handleChange}
                                className='px-2 py-3 border border-gray-200 font-normal bg-gray-50 rounded-lg text-gray-600 outline-none'
                            />
                        </div>

                        <div className='grid gap-2'>
                            <label>Room</label>
                            <input
                                type="text"
                                name="room"
                                value={tenantData.room}
                                onChange={handleChange}
                                className='px-2 py-3 border border-gray-200 font-normal bg-gray-50 rounded-lg text-gray-600 outline-none'
                            />
                        </div>

                    </div>

                    <div className='w-full mt-5 flex justify-center '>
                        <button className='bg-gradient-to-r from-green-500 flex justify-center items-center to-emerald-500 w-full p-3 cursor-pointer font-semibold text-white rounded-lg'>
                            {loading ? <LuLoader size={26} className='animate-spin flex justify-center items-center' /> : "Update Tenant"}
                        </button>
                    </div>

                </form>

            </motion.div>
        </div>
    )
}

export default UpdateTenants