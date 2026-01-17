import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const ViewVaccant = ({ close }) => {
  const [vacant, setVacant] = useState([]);

  const fetchVacant = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getVaccantRooms,
      });

      if (response.data.success) {
        setVacant(response.data.vacantRooms); // updated key
        toast.success(response.data.message);
      } else if (response.data.error) {
        toast.error(response.data.message || "No vacant rooms found");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchVacant();
  }, []);

  return (
    <section className='top-0 bottom-0 left-0 right-0 flex items-center justify-center fixed z-50 bg-neutral-950/60'>
      <div className='bg-white w-88 lg:max-w-md rounded p-2'>
        <div className='flex justify-between'>
          <h2 className='font-semibold text-sm text-green-400 py-2'>Vacant Rooms</h2>
          <button onClick={close} className='cursor-pointer'><IoClose /></button>
        </div>

        <div className='h-160 overflow-y-auto scrollbar-hidden'>
          {vacant.map((room, index) => (
            <div
              key={index}
              className='border border-white p-2 hover:bg-green-300 cursor-pointer rounded border-b-green-300'
            >
              <p className='text-sm font-semibold italic'>{room}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ViewVaccant;
