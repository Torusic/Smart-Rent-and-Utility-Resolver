import React, { useEffect, useState } from 'react';
import Message from '../Message';
import AxiosToastError from '../../utils/AxiosToastError';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import toast from 'react-hot-toast';
import Divider from '../Divider';

const UpdateLandLordProfile = ({ dark }) => {
  const [landlordData, setLandlordData] = useState({
    name: '',
    email: '',
    phone: '',
    totalRooms: ''
  });
  const[nameText,setNameText]=useState(false)
   const[phoneText,setPhoneText]=useState(false)
    const[emailText,setEmailText]=useState(false)
     const[roomText,setRoomText]=useState(false)

  useEffect(() => {
    const fetchLandlordDetails = async () => {
      try {
        const response = await Axios({ ...SummaryApi.landlord });
        const { data: responseData } = response;

        if (responseData.success) {
          toast.success(responseData.message);
          setLandlordData(responseData.data);
        }
      } catch (error) {
        AxiosToastError(error);
      }
    };
    fetchLandlordDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLandlordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.update,
        data: landlordData
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (responseData.data) setLandlordData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
 

  

  return (
    <section className="overflow-y-auto scrollbar-hidden p-4 bg-gray-50 h-full">
      <div className={`max-w-7xl mx-auto bg-white  rounded-2xl p-8 
                      transition-all duration-500 `}>
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
          Update My Profile
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name + Email */}
          <div className="flex flex-col md:flex-row text-gray-400 gap-6">
            <div className="flex flex-col flex-1">
              <label className="font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={landlordData.name}
                onChange={handleChange}
                 onClick={()=>setNameText(true)}
                className={`p-3 ${nameText? "text-black":"text-gray-400"} rounded-lg border  bg-gray-100 border-gray-300 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition w-full`}
                placeholder="Enter your name"
              />
            </div>

            <div className="flex flex-col flex-1 text-gray-400">
              <label className="font-medium  text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={landlordData.email}
                onChange={handleChange}
                onClick={()=>setEmailText(true)}
                className={`p-3 ${emailText? "text-black":"text-gray-400"} rounded-lg border  bg-gray-100 border-gray-300 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition w-full`}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Phone + Total Rooms */}
          <div className="flex flex-col md:flex-row text-gray-400 gap-6">
            <div className="flex flex-col flex-1">
              <label className="font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={landlordData.phone}
                onChange={handleChange}
                 onClick={()=>setPhoneText(true)}
                className={`p-3 ${phoneText? "text-black":"text-gray-400"} rounded-lg border  bg-gray-100 border-gray-300 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition w-full`}
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex flex-col flex-1 text-gray-400">
              <label className="font-medium text-gray-700 mb-1">Number of Rooms</label>
              <input
                type="number"
                name="totalRooms"
                value={landlordData.totalRooms}
                onChange={handleChange}
           
                onClick={()=>setRoomText(true)}
                className={`p-3 ${roomText? "text-black":"text-gray-400"} rounded-lg border  bg-gray-100 border-gray-300 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500 transition w-full`}
                placeholder="Enter total rooms"
              />
            </div>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="bg-green-600 text-white font-semibold py-3 rounded-lg w-full 
                       hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                       onClick={()=>{
                        setNameText(false)
                        setEmailText(false)
                        setPhoneText(false)
                        setRoomText(false)
                       }}
          >
            Update Profile
          </button>
        </form>
      </div>
      <Divider />

      {/* Messages Section */}
      <div className="mt-8">
        <Message />
      </div>
    </section>
  );
};

export default UpdateLandLordProfile;
