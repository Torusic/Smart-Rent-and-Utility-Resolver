import React, { useEffect, useState } from 'react'
import { LuHousePlus } from "react-icons/lu";
import { MdBedroomParent } from "react-icons/md";
import { AiOutlineFileUnknown } from "react-icons/ai";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import socket from '../utils/Socket.js';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis,
  Line
} from "recharts";
import { Link } from 'react-router-dom';
import { SiSimpleanalytics } from "react-icons/si";
import logo from '../assets/rent.png'
import Divider from '../components/Divider';
import ViewVaccant from '../components/ViewVaccant.jsx';

const LandLordStatistics = () => {
  const [stats, setStats] = useState(null);
  const [viewVaccants, setViewVaccants] = useState(false)
useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const response = await Axios({ ...SummaryApi.landlordDashboard })
      if (response.data.success) setStats(response.data.data)
    } catch (error) {
      AxiosToastError(error)
    }
  };

  fetchDashboard();

  socket.on("statusUpdate", () => {
    fetchDashboard(); // refresh charts live
  });

  socket.on("paymentUpdate", () => {
    fetchDashboard();
  });

  return () => {
    socket.off("statusUpdate");
    socket.off("paymentUpdate");
  };
}, []);


  if (!stats) return <div className=" text-center">Loading statistics...</div>;

  const chartData = [
    { name: "Rent Paid", value: stats.utiliytiesGraph.rent.paid },
    { name: "Rent Unpaid", value: stats.utiliytiesGraph.rent.unpaid },
    { name: "Water Paid", value: stats.utiliytiesGraph.water.paid },
    { name: "Water Unpaid", value: stats.utiliytiesGraph.water.unpaid },
    { name: "Electricity Paid", value: stats.utiliytiesGraph.electricity.paid },
    { name: "Electricity Unpaid", value: stats.utiliytiesGraph.electricity.unpaid },
  ]

  const scatterData = [
    { x: 1, y: stats.utiliytiesGraph.rent.paid, z: 200, name: "Rent Paid" },
    { x: 2, y: stats.utiliytiesGraph.rent.unpaid, z: 200, name: "Rent Unpaid" },
    { x: 3, y: stats.utiliytiesGraph.water.paid, z: 200, name: "Water Paid" },
    { x: 4, y: stats.utiliytiesGraph.water.unpaid, z: 200, name: "Water Unpaid" },
    { x: 5, y: stats.utiliytiesGraph.electricity.paid, z: 200, name: "Electricity Paid" },
    { x: 6, y: stats.utiliytiesGraph.electricity.unpaid, z: 200, name: "Electricity Unpaid" },
  ]

  return (
    <div className='bg-green-50     flex justify-between  h-full scrollbar-hidden rounded  overflow-x-auto '>
     
      {/* Summary Cards */}
      <div className='flex  items-center  justify-between bg-gradient-to-t from-[#D1FAE5] via-transparent'>
        <div className='grid '>
          <div className='lg:flex grid  justify-between bg-gradient-to-t from-[#D1FAE5] via-transparent items-center py-18 px-5 gap-6 lg:gap-35'>
            
            <div className='bg-green-200 flex flex-col p-4 rounded items-center h-35 w-80'>
          <div className='font-semibold text-sm text-green-400'>Rooms</div>
          <div className='font-bold text-2xl text-green-400'>{stats.totalRooms}</div>
          <Link to="/landlorddashboard/update"><LuHousePlus className='text-green-400' /></Link>
        </div>

        <div className='bg-green-200 flex flex-col p-4 rounded items-center h-35 w-80'>
          <div className='font-semibold text-sm text-green-400'>Rented</div>
          <div className='font-bold text-2xl text-green-400'>{stats.rentedRooms}</div>
          <MdBedroomParent className='text-green-400' />
        </div>

        <div className='bg-green-200 flex flex-col p-4 rounded items-center h-35 w-80'>
          <button className='font-semibold text-sm text-green-400' onClick={() => setViewVaccants(true)}>Vacants</button>
          <div className='font-bold text-2xl text-green-400'>{stats.vacantRooms}</div>
          <AiOutlineFileUnknown className='text-green-400' />
        </div>
          </div>
          
        <Divider />

      {/* Bar Chart */}
      <p className='text-green-400  w-fit p-2 ml-auto'> <SiSimpleanalytics  /></p>
      <div className='flex justify-between p-3  gap-3'>
       
        <div className='mt-8 bg-gradient-to-t w-full h-75 from-[#D1FAE5] via-transparentp-4 rounded shadow'>
        <h2 className='font-semibold mb-3 flex justify-between'>
          Utilities Payment Bar Chart 
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" tick={{ fontSize: 10 }} />
            <YAxis unit="%" />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" radius={[5,5,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter Chart */}
      <div className='mt-8 bg-gradient-to-t w-full h-75 from-[#D1FAE5] via-transparent p-4 rounded shadow'>
        <h2 className='font-semibold mb-3'>Utilities Scatter Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Utility Index" />
            <YAxis type="number" dataKey="y" name="Payment %" unit="%" />
            <ZAxis type="number" dataKey="z" range={[100, 400]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Payments" data={scatterData} fill="#22c55e" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      </div>
      

      {viewVaccants && <ViewVaccant close={() => setViewVaccants(false)} />}
        </div>
        
      </div>

      
    </div>
  )
}

export default LandLordStatistics
