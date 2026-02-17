import React, { useEffect, useState } from 'react';
import { LuHousePlus, LuLoaderCircle } from "react-icons/lu";
import { MdBedroomParent } from "react-icons/md";
import { AiOutlineFileUnknown } from "react-icons/ai";
import { SiSimpleanalytics } from "react-icons/si";
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis,
  PieChart, Pie, Cell, Legend,
  LineChart,
  Line
} from "recharts";

import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import socket from '../utils/Socket.js';
import AxiosToastError from '../utils/AxiosToastError';
import Divider from '../components/Divider';
import ViewVaccant from '../components/ViewVaccant.jsx';

const COLORS = ["#22c55e", "#dc2626", "#3b82f6", "#f59e0b", "#2563eb", "#eab308"];

const LandLordStatistics = () => {
  const [stats, setStats] = useState(null);
  const [scatterData, setScatterData] = useState([]);
  const [viewVaccants, setViewVaccants] = useState(false);

  // Function to update scatter chart
  const updateScatter = (data) => {
    if (!data || !data.utiliytiesGraph) return;
    setScatterData([
      { x: 1, y: data.utiliytiesGraph.rent.paid, z: 200 },
      { x: 2, y: data.utiliytiesGraph.rent.unpaid, z: 200 },
      { x: 3, y: data.utiliytiesGraph.water.paid, z: 200 },
      { x: 4, y: data.utiliytiesGraph.water.unpaid, z: 200 },
      { x: 5, y: data.utiliytiesGraph.electricity.paid, z: 200 },
      { x: 6, y: data.utiliytiesGraph.electricity.unpaid, z: 200 },
    ]);
  };

  // Fetch initial dashboard data
  const fetchDashboard = async () => {
    try {
      const response = await Axios({ ...SummaryApi.landlordDashboard });
      if (response.data.success) {
        setStats(response.data.data);
        updateScatter(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchDashboard();

    // ================= REAL-TIME UPDATES =================
    socket.on("statusUpdate", (data) => {
      setStats(prev => {
        if (!prev) return prev;
        const newStats = { ...prev };
        if (data.electricity) newStats.utiliytiesGraph.electricity = data.electricity;
        if (data.water) newStats.utiliytiesGraph.water = data.water;
        updateScatter(newStats);
        return newStats;
      });
    });

    socket.on("paymentUpdate", (data) => {
      setStats(prev => {
        if (!prev) return prev;
        const newStats = { ...prev };
        if (data.rentedRooms !== undefined) newStats.rentedRooms = data.rentedRooms;
        if (data.vacantRooms !== undefined) newStats.vacantRooms = data.vacantRooms;
        if (data.utiliytiesGraph?.rent) newStats.utiliytiesGraph.rent = data.utiliytiesGraph.rent;
        updateScatter(newStats);
        return newStats;
      });
    });

    return () => {
      socket.off("statusUpdate");
      socket.off("paymentUpdate");
    };
  }, []);

  if (!stats) return (
    <div className="text-center p-10 font-semibold text-green-500">
      <p className='flex itc justify-center gap-2'><LuLoaderCircle size={25}/> Loading statistics...</p>
    </div>
  );

  // Prepare chart data dynamically
  const chartData = [
    { name: "Rent Paid", value: stats.utiliytiesGraph.rent.paid },
    { name: "Rent Unpaid", value: stats.utiliytiesGraph.rent.unpaid },
    { name: "Water Paid", value: stats.utiliytiesGraph.water.paid },
    { name: "Water Unpaid", value: stats.utiliytiesGraph.water.unpaid },
    { name: "Electricity Paid", value: stats.utiliytiesGraph.electricity.paid },
    { name: "Electricity Unpaid", value: stats.utiliytiesGraph.electricity.unpaid },
  ];

  
  return (
    <div className="h-full overflow-y-auto scrollbar-hidden bg-gradient-to-br from-green-50 via-white to-green-100 p-3">
      <div className='grid'>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-600">Rental Analytics</h1>
          <SiSimpleanalytics className="text-green-500 text-2xl" />
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Total Rooms */}
          <div className="bg-green-50 rounded-xl shadow-md hover:shadow-xl p-6 border border-green-200">
            <p className="text-sm text-gray-500">Total Rooms</p>
            <h2 className="text-3xl font-bold text-green-600">{stats.totalRooms}</h2>
            <Link to="/landlorddashboard/update" className="flex justify-end mt-4">
              <LuHousePlus className="text-green-500 hover:scale-110 transition" size={28} />
            </Link>
          </div>

          {/* Rented Rooms */}
          <div className="bg-blue-50 rounded-xl shadow-md hover:shadow-xl transition p-6 border border-blue-200">
            <p className="text-sm text-gray-500">Rented Rooms</p>
            <h2 className="text-3xl font-bold text-blue-600">{stats.rentedRooms}</h2>
            <div className="flex justify-end mt-4">
              <MdBedroomParent className="text-blue-500" size={40} />
            </div>
          </div>

          {/* Vacant Rooms */}
          <div className="bg-red-50 rounded-xl shadow-md hover:shadow-xl transition p-6 border border-red-200">
            <button
              onClick={() => setViewVaccants(true)}
              className="text-sm text-gray-500 hover:text-green-600"
            >
              Vacant Rooms
            </button>
            <h2 className="text-3xl font-bold text-red-600">{stats.vacantRooms}</h2>
            <div className="flex justify-end mt-4">
              <AiOutlineFileUnknown className="text-red-500" size={40} />
            </div>
          </div>
        </div>

        <Divider className='py-5' />

        {/* Charts Section */}
        <h1 className='p-2 font-semibold text-sm text-green-400'>UTILITY DISTRIBUTION</h1>
        <div className="grid lg:grid-cols-2 justify-between gap-6 mt-2 ">
          

          {/* Bar Chart */}
          <div className="bg-green-50 rounded-xl shadow-md hover:shadow-xl transition p-6 border border-green-200">
            <h2 className="font-semibold text-green-600 mb-4">
              Utilities Payment Bar Chart
            </h2>
            <ResponsiveContainer width="100%" height={260} className={`py-9 text-xs`}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
              <div className="bg-yellow-50 rounded-xl shadow-md hover:shadow-xl transition px-6 py-4 border border-yellow-200 mt-2 h-[49vh]">
                <h2 className="font-semibold text-yellow-600 mb-4">Utilities Line Graph</h2>
                <ResponsiveContainer width="100%" height="100%" className={`p-6.5 text-xs outline-none border border-none`}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-25} textAnchor="end" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>


          {/* Scatter Chart 
             <div className="bg-blue-50 rounded-xl shadow-md hover:shadow-xl transition p-6 border border-blue-200">
            <h2 className="font-semibold text-blue-600 mb-4">
              Utilities Scatter Distribution
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" />
                <YAxis type="number" dataKey="y" unit="%" />
                <ZAxis type="number" dataKey="z" range={[100, 400]} />
                <Tooltip />
                <Scatter data={scatterData} fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          */}
       
        </div>
      </div>

      {/* Vacant Modal */}
      {viewVaccants && <ViewVaccant close={() => setViewVaccants(false)} />}
    </div>
  );
};

export default LandLordStatistics;
