import React, { useEffect, useState } from 'react'
import { LuHousePlus } from "react-icons/lu";
import { MdBedroomParent } from "react-icons/md";
import { AiOutlineFileUnknown } from "react-icons/ai";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import {BarChart,  Bar, XAxis,YAxis,  CartesianGrid,Tooltip,  ResponsiveContainer,} from "recharts";
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import Message from '../components/Message';


const LandLordStatistics = () => {
  const[stats,setStats]=useState(null)

useEffect(()=>{
  const fetchDashboard=async()=>{
    try {
      const response=await Axios({
        ...SummaryApi.landlordDashboard,
        
      })
      if(response.data.error){
        toast.error(response.data.error)
      }
      if(response.data.success){
        toast.success(response.data.message)
        setStats(response.data.data)
      }
      
    } catch (error) {
      AxiosToastError(error)
      
    }

  }
  fetchDashboard()
  
},[])

 if (!stats) {
    return <div className="p-6 text-center">Loading statistics...</div>;
  }
  const chartData=[
    {name:"Rent Paid", value:stats.utiliytiesGraph.rent.paid},
    {name:"Rent Unpaid", value:stats.utiliytiesGraph.rent.unpaid},
    {name:"Water Paid", value:stats.utiliytiesGraph.water.paid},
    {name:"Water Unaid", value:stats.utiliytiesGraph.water.unpaid},
    {name:"Electricity Paid", value:stats.utiliytiesGraph.electricity.paid},
    {name:"Electricity Paid", value:stats.utiliytiesGraph.electricity.unpaid},
  ]
  return (
    <div className='bg-white shadow-md p-4 border mx-auto border-green-400 rounded'>
      <div className='lg:flex grid items-center gap-20'>
      <div className='shadow-md gap-3 flex flex-col p-4 rounded items-center  h-50 lg:w-100 w-50  border border-green-400  ' >
      <div className='font-bold'> Number of Rooms</div>
      <div className='font-bold text-3xl justify-center text-green-400'>{stats.totalRooms}</div>
     
       <button className='block w-fit ml-auto  px-3 py-1 '>
            < LuHousePlus size={29} />
         </button>

    </div>
    <div className='shadow-md flex flex-col gap-3 p-4 rounded items-center h-50 lg:w-100 w-50 border border-green-400  ' >
      <div className='font-bold'> Rented Rooms</div>
      <div className='font-bold text-3xl justify-center text-green-400'>{stats.rentedRooms}</div>
       <button className='block w-fit ml-auto  px-3 py-1 '>
            < MdBedroomParent size={29} />
         </button>
     

    </div>
    <div className='shadow-md flex flex-col p-4 rounded gap-3 items-center  h-50 lg:w-100 w-50   border border-green-400' >
      <div className='font-bold'> Vaccant Rooms</div>
      <div className='font-bold text-3xl justify-center text-green-400'>{stats.vacantRooms ||0 }</div>
  
     
         <button className='block w-fit ml-auto  px-3 py-1 '>
            <AiOutlineFileUnknown size={29} />
         </button>
      
     
    </div>


    </div>
    <div className='flex mt-10 gap-4'>
      <div className=' w-full shadow border border-green-300 px-2 rounded '>
      <h2 className='font-semibold py-3'>Utilities Payment Status (%)</h2>
      <ResponsiveContainer width="100%" height={350} >
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis className='font-semibold' dataKey="name"/>
          <YAxis className='font-semibold' unit='%'/>
          <Tooltip/>
          <Bar dataKey="value" fill="#22c55e" width="20" radius={[3,3,0,0]}/>

        </BarChart>

      </ResponsiveContainer>

    </div>
   
   
    </div>
    
    </div>
    

   
   
    
  )
}

export default LandLordStatistics