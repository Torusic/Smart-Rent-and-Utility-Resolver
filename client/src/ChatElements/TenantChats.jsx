import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Feedback from "../components/Feedback";
import Divider from "../components/Divider";

const TenantChats = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("");
  const [landlord, setLandlord] = useState(null);

  const scrollRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch tenant dashboard (get landlord info)
  useEffect(() => {
    const fetchTenantDashboard = async () => {
      try {
        const { url, method } = SummaryApi.tenantDashboard;

        const { data } = await Axios({ url, method });

        if (data.success && data.data.landlord) {
          setLandlord(data.data.landlord);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTenantDashboard();
  }, []);

  // Fetch chat messages (category mandatory)
  useEffect(() => {
    if (!landlord?.id) return;

    const fetchMessages = async () => {
      try {
        const { url, method } = SummaryApi.getTenantChats(
          landlord.id,
          category || "All"
        );

        const { data } = await Axios({ url, method });

        if (data.success && Array.isArray(data.data)) {
          setMessages(data.data.filter(m => m && m._id));
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);

  }, [landlord, category]);

  // Send message
  const handleSend = async () => {

    if (!category) {
      toast.error("Please select category first");
      return;
    }

    if (!input.trim() || !landlord?.id) return;

    try {
      const api = SummaryApi.sendChatToLandlord;

      const response = await Axios({
        url: api.url,
        method: api.method,
        data: {
          landlordId: landlord.id,
          content: input.trim(),
          category
        }
      });

      if (response?.data?.success) {
        setMessages(prev => [...prev, response.data.data]);
        setInput("");
        toast.success(response.data.message);
      } else {
        toast.error(response?.data?.message || "Failed to send");
      }

    } catch (error) {
      AxiosToastError(error);
    }
  };

  if (!landlord) {
    return (
      <div className="p-4 text-gray-500 italic">
        Loading chat with your landlord...
      </div>
    );
  }

  return (
  <section className="max-w-9xl mx-auto mt- ml-2 overflow-y-auto scrollbar-hidden  mr-1 flex flex-col h-full rounded-2xl shadow-lg bg-gradient-to-t from-[#D1FAE5] overflow-hidden">

    {/* HEADER */}
    <header className="sticky top-0 bg-white px-4 py-3 font-semibold shadow-sm z-10">
      Chat with
      <span className="italic text-red-500 ml-2">
        {landlord.name} (Landlord)
      </span>
    </header>

    {/* CATEGORY */}
    <div className="bg-white p-3">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-3 rounded-xl bg-gray-100 outline-none"
      >
        <option value=""> Select Category (Required)</option>
        <option value="General">General</option>
        <option value="Rent">Rent</option>
        <option value="Electricity">Electricity</option>
        <option value="Water">Water</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Announcement">Announcement</option>
      </select>
    </div>

  
    <div className="flex flex-1 overflow-hidden ">

      
      <div className="flex flex-col flex-1 h-full border-r-4 rounded-2xl border-gray-400  overflow-y-auto scrollbar-hidden">

        {/* MESSAGES */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-green-50 scrollbar-hidden"
        >
          {messages.length ? (
            messages.map(msg => {
              if (!msg?._id) return null;

              return (
                <div
                  key={msg._id}
                  className={`p-3 max-w-xs break-words text-sm shadow ${
                    msg.senderModel === "Tenant"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white ml-auto rounded-2xl"
                      : "bg-white text-green-900 mr-auto rounded-2xl"
                  }`}
                >
                  <span className="text-[10px] px-2 py-1 bg-black/10 rounded-full">
                    {msg.category || "General"}
                  </span>

                  <p className="mt-1">{msg.content}</p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 italic text-sm">
              No messages yet...
            </p>
          )}
        </div>

        {/* INPUT */}
        <div className="bg-white p-3 flex gap-2">
          <input
            type="text"
            value={input}
            disabled={!category}
            onChange={(e) => setInput(e.target.value)}
            placeholder={category ? "Type message..." : "Select category first"}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || !category}
            className="p-2 rounded-full bg-green-200 hover:bg-green-300 transition disabled:opacity-50"
          >
            <IoSend size={25} className="text-green-600" />
          </button>
        </div>

      </div>
      

      {/* FEEDBACK SECTION */}
      <div className="w-[280px]  bg-white p-3 overflow-y-auto hidden md:block">
        <Feedback />
      </div>

    </div>

  </section>
);
};

export default TenantChats;