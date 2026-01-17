import React, { useEffect, useState } from 'react'
import { LuHousePlus } from "react-icons/lu";
import { MdBedroomParent } from "react-icons/md";
import { AiOutlineFileUnknown } from "react-icons/ai";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
import { Link } from 'react-router-dom';
import { FaArrowRight, FaRobot } from "react-icons/fa";
import Message from '../components/Message';
import Divider from '../components/Divider';
import { SiSimpleanalytics } from "react-icons/si";
import logo from '../assets/rent.png'
import About from '../components/About';
import ViewVaccant from '../components/ViewVaccant.jsx';



const LandLordStatistics = () => {
  const [stats, setStats] = useState(null);
  const[viewVaccants,setViewVaccants]=useState(false)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.landlordDashboard,

        })
        if (response.data.error) {
          toast.error(response.data.error)
        }
        if (response.data.success) {
          toast.success(response.data.message)
          setStats(response.data.data)
        }

      } catch (error) {
        AxiosToastError(error)

      }

    }
    fetchDashboard()

  }, [])

  if (!stats) {
    return <div className="p-6 text-center">Loading statistics...</div>;
  }
  const chartData = [
    { name: "Rent Paid", value: stats.utiliytiesGraph.rent.paid },
    { name: "Rent Unpaid", value: stats.utiliytiesGraph.rent.unpaid },
    { name: "Water Paid", value: stats.utiliytiesGraph.water.paid },
    { name: "Water Unpaid", value: stats.utiliytiesGraph.water.unpaid },
    { name: "Electricity Paid", value: stats.utiliytiesGraph.electricity.paid },
    { name: "Electricity Unpaid", value: stats.utiliytiesGraph.electricity.unpaid },
  ]
  return (
    <div className='bg-green-50  p-4 h-full overflow-x-auto  scrollbar-hidden rounded '>
     <img src={logo} alt="" className='mt-2 py-2 lg:hidden rounded-2xl'/>
      <div className='flex items-center p-2 lg:gap-20 gap-5 inset-0 bg-gradient-to-t from-[#D1FAE5] via-transparent '>
        <div className='shadow-sm bg-green-200 lg:gap-3 gap-2 flex flex-col p-4 rounded items-center  lg:h-40 h-27 lg:w-90 w-100    ' >
          <div className='lg:font-bold font-semibold text-sm text-green-400 hover:bg-green-200 rounded cursor-pointer p-1'> Rooms</div>
          <div className='font-bold lg:text-3xl text-sm justify-center text-green-400'>{stats.totalRooms}</div>

            <Link className='block w-fit ml-auto   px-3 py-1 ' to={"/landlorddashboard/update"}>< LuHousePlus className='text-green-400'  /></Link>
        

        </div>
        <div className='shadow-sm bg-green-200  lg:gap-3 gap-2 flex flex-col p-4 rounded items-center  lg:h-40 h-27 lg:w-90  ' >
          <div className='lg:font-bold font-semibold text-sm text-green-400 hover:bg-green-200 rounded cursor-pointer p-1'> Rented</div>
          <div className='font-bold lg:text-3xl text-sm justify-center text-green-400'>{stats.rentedRooms}</div>

          <button className='block w-fit ml-auto  px-3 py-1 '>
            < MdBedroomParent className='text-green-400'  />
          </button>

        </div>
        <div className='shadow-sm bg-green-200  lg:gap-3 gap-2 flex flex-col p-4 rounded items-center  lg:h-40  h-27 lg:w-90    ' >
          <button className='lg:font-bold font-semibold text-sm text-green-400 hover:bg-green-200 rounded cursor-pointer p-1' onClick={()=>setViewVaccants(true)}> Vaccants</button>
          <div className='font-bold lg:text-3xl text-sm justify-center text-green-400'>{stats.vacantRooms}</div>

          <button className='block w-fit ml-auto  px-3 py-1 '>
            < AiOutlineFileUnknown className='text-green-400'  />
          </button>

        </div>


      </div>
      <div className='mt-3 border border-white'>
        <Divider/>
      </div>
      <div className='bg-green-50 '>
      
        
           <div className='flex mt-10 font-extralight inset-0 bg-gradient-to-t from-[#D1FAE5] via-transparent   gap-4'>
        <div className='w-900 lg:w-full  lg:shadow border border-white lg:border-green-100 lg:px-2 rounded '>
          <h2 className='font-semibold py-3 flex justify-between'>Utilities Payment Status (%) <SiSimpleanalytics className='text-green-400' /></h2>
          <ResponsiveContainer width="100%" height={400}>
  <BarChart data={chartData} className="border border-white">
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      dataKey="name"
      className="font-extralight text-sm"
      interval={0}               
      tick={{ fontSize: 9}}    
      angle={-30}               
      textAnchor="end"          
    />
    <YAxis className="font-extralight text-sm" unit="%" />
    <Tooltip />
    <Bar dataKey="value" fill="#22c55e" radius={[3, 3, 0, 0]} />

  </BarChart>
</ResponsiveContainer>


        </div>


      </div>
      </div>
   
      {
        viewVaccants && (
          <ViewVaccant close={()=>setViewVaccants(false)}/>
        )
      }
      

    </div>
    





  )
}

export default LandLordStatistics