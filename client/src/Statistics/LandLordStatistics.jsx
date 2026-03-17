import React, { useEffect, useState } from 'react';
import { LuHousePlus, LuLoaderCircle } from "react-icons/lu";
import { MdBedroomParent } from "react-icons/md";
import { AiOutlineFileUnknown } from "react-icons/ai";
import { SiSimpleanalytics } from "react-icons/si";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from "recharts";

import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import socket from '../utils/Socket.js';
import AxiosToastError from '../utils/AxiosToastError';
import Divider from '../components/Divider';
import ViewVaccant from '../components/ViewVaccant.jsx';

const LandLordStatistics = () => {

  const [stats, setStats] = useState(null);
  const [scatterData, setScatterData] = useState([]);
  const [viewVaccants, setViewVaccants] = useState(false);

  const updateScatter = (data) => {
    if (!data || !data.utilitiesGraph) return;

    const g = data.utilitiesGraph;

    setScatterData([
      { x: 1, y: g.rent?.paid || 0, z: 200 },
      { x: 2, y: g.rent?.unpaid || 0, z: 200 },
      { x: 3, y: g.water?.paid || 0, z: 200 },
      { x: 4, y: g.water?.unpaid || 0, z: 200 },
      { x: 5, y: g.electricity?.paid || 0, z: 200 },
      { x: 6, y: g.electricity?.unpaid || 0, z: 200 }
    ]);
  };

  const fetchDashboard = async () => {
    try {
      const response = await Axios({ ...SummaryApi.landlordDashboard });
      if (response.data.success) {
        const data = response.data.data;
        setStats(data);
        updateScatter(data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchDashboard();

    socket.on("statusUpdate", (data) => {
      setStats(prev => {
        if (!prev) return prev;

        const newStats = {
          ...prev,
          utilitiesGraph: {
            ...prev.utilitiesGraph,
            ...data.utilitiesGraph
          }
        };

        updateScatter(newStats);
        return newStats;
      });
    });

    socket.on("paymentUpdate", (data) => {
      setStats(prev => {
        if (!prev) return prev;

        const newStats = { ...prev };

        if (data.rentedRooms !== undefined)
          newStats.rentedRooms = data.rentedRooms;
        if (data.vacantRooms !== undefined)
          newStats.vacantRooms = data.vacantRooms;

        if (data.utilitiesGraph?.rent)
          newStats.utilitiesGraph.rent = {
            ...newStats.utilitiesGraph?.rent,
            ...data.utilitiesGraph.rent
          };
        if (data.utilitiesGraph?.water)
          newStats.utilitiesGraph.water = {
            ...newStats.utilitiesGraph?.water,
            ...data.utilitiesGraph.water
          };
        if (data.utilitiesGraph?.electricity)
          newStats.utilitiesGraph.electricity = {
            ...newStats.utilitiesGraph?.electricity,
            ...data.utilitiesGraph.electricity
          };

        setTimeout(() => updateScatter(newStats), 0);
        return newStats;
      });
    });

    return () => {
      socket.off("statusUpdate");
      socket.off("paymentUpdate");
    };
  }, []);

  if (!stats) {
    return (
      <div className="text-center p-10 font-semibold text-green-500">
        <p className="flex justify-center items-center gap-2">
          <LuLoaderCircle size={25} className="animate-spin" />
          Loading statistics...
        </p>
      </div>
    );
  }

  const graph = stats.utilitiesGraph || {};
  const chartData = [
    { name: "Rent Paid", value: graph.rent?.paid || 0 },
    { name: "Rent Unpaid", value: graph.rent?.unpaid || 0 },
    { name: "Water Paid", value: graph.water?.paid || 0 },
    { name: "Water Unpaid", value: graph.water?.unpaid || 0 },
    { name: "Electricity Paid", value: graph.electricity?.paid || 0 },
    { name: "Electricity Unpaid", value: graph.electricity?.unpaid || 0 },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-hidden bg-gradient-to-br from-green-50 via-white to-green-100 p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-600">
            Rental Analytics
          </h1>
          <p className="text-xs text-gray-400">
            Real-time landlord monitoring dashboard
          </p>
        </div>
        <SiSimpleanalytics className="text-green-500 text-2xl" />
      </div>

      {/* KPI Insights */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        


          {/* Occupancy Rate */}
          <div className="bg-white p-4 rounded-2xl border-l-4 border-blue-500 shadow flex flex-col justify-between hover:shadow-xl transition">
            <p className="text-xs text-gray-500">Occupancy Rate</p>
            <h2 className="text-2xl font-bold text-blue-600">
              {((stats.rentedRooms / stats.totalRooms) * 100).toFixed(1)}%
            </h2>
            <p className="text-xs text-gray-400">Rented vs Total Rooms</p>
            <p className="text-xs text-gray-500 mt-2">
              Guide: High occupancy means steady income. Aim to fill vacant rooms quickly.
            
            </p>
          </div>

          {/* Unpaid Risk */}
          <div className="bg-white p-4 rounded-2xl border-l-4 border-red-500 shadow flex flex-col justify-between hover:shadow-xl transition">
            <p className="text-xs text-gray-500">Unpaid Risk</p>
            <h2 className="text-2xl font-bold text-red-600">
              {graph.rent?.unpaid || 0}% 
            </h2>
            <p className="text-xs text-gray-400">Rooms with overdue rent</p>
            <p className="text-xs text-gray-500 mt-2">
              Guide: Follow up quickly on overdue rent to avoid losses. 
            </p>
          </div>

          {/* Animated KPI Counter */}
          <div className="bg-white p-4 rounded-2xl border-l-4 border-yellow-500 shadow flex flex-col justify-between hover:shadow-xl transition">
            <p className="text-xs text-gray-500">Active Utilities</p>
            <h2 className="text-2xl font-bold text-yellow-600">
              <motion.span
                initial={{ count: 0 }}
                animate={{ count: (graph.water?.paid || 0) + (graph.electricity?.paid || 0) }}
                transition={{ duration: 1.5 }}
              >
                {(graph.water?.paid || 0) + (graph.electricity?.paid || 0)}
              </motion.span>
            </h2>
            <p className="text-xs text-gray-400">Paid utility records</p>
            <p className="text-xs text-gray-500 mt-2">
              Guide: Track utilities to avoid billing mistakes.
            </p>
          </div>
      </div>

      <Divider className="py-6" />

   
      <h1 className="p-2 font-semibold text-xs text-green-400 tracking-wide">
        UTILITY DISTRIBUTION ANALYTICS
      </h1>

      <div className="grid lg:grid-cols-2 gap-6 mt-2">

        
        <div className="bg-white border-l-4 rounded-2xl border-green-400 shadow p-6">
          <h2 className="font-semibold text-green-600 mb-4">
            Utilities Payment Bar Chart
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-25} textAnchor="end" />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

       
        <div className="bg-white border-l-4 rounded-2xl shadow border-yellow-400 p-6 h-[48vh]">
          <h2 className="font-semibold text-yellow-600 mb-4">
            Utilities Line Graph
          </h2>

          <ResponsiveContainer width="100%" height="100%">
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

      </div>
      
       

      {viewVaccants && (
        <ViewVaccant close={() => setViewVaccants(false)} />
      )}

    </div>
  );
};

export default LandLordStatistics;