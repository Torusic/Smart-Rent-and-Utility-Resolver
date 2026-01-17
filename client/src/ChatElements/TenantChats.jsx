import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const TenantChats = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [landlord, setLandlord] = useState(null);

  const messagesEndRef = useRef(null); 

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch tenant dashboard to get landlord info
  useEffect(() => {
    const fetchTenantDashboard = async () => {
      try {
        const { url, method } = SummaryApi.tenantDashboard;
        const { data } = await Axios({ url, method });
        if (data.success && data.data.landlord) {
          setLandlord(data.data.landlord); // landlord has id, name, phone
        }
      } catch (error) {
        console.error("Error fetching tenant dashboard:", error);
      }
    };

    fetchTenantDashboard();
  }, []);

  // Fetch chat history with landlord every 3 seconds
  useEffect(() => {
    if (!landlord?.id) return;

    const fetchMessages = async () => {
      try {
        const { url, method } = SummaryApi.getTenantChats(landlord.id);
        const { data } = await Axios({ url, method });
        if (data.success) {
          setMessages(data.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [landlord]);

  // ✅ Send message to landlord
  const handleSend = async () => {
    if (!landlord?.id || !input.trim()) return; // guard

    try {
      const { url, method } = SummaryApi.sendChatToLandlord(landlord.id);
      const payload = { landlordId: landlord.id, content: input.trim() };

      const response = await Axios({ url, method, data: payload });

      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.data]);
        setInput("");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Failed to send message");
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
    <section className="lg:w-full w-89 flex flex-col rounded shadow-md border border-green-100 inset-0 bg-gradient-to-t from-[#D1FAE5]  h-full">
      <header className="shadow-md bg-green-200 border border-green-100 border-b-green-400 px-2 py-4 h-10 flex items-center font-semibold">
        Chat with
        <h2 className="italic text-sm text-red-400 px-2 font-semibold">
          {landlord.name} (Landlord)
        </h2>
      </header>

     
           <div className="lg:h-120 h-120 overflow-y-auto scrollbar-hidden p-3 bg-green-100  ">
        {messages.length ? (
  messages.map(msg =>
    msg?._id ? (
      <div
        key={msg._id}
        className={`mb-2 p-3 max-w-xs break-words ${
          msg.senderModel === "Tenant"
            ? "bg-green-500  text-white  text-sm font-medium rounded-tl-3xl rounded-tr-3xl rounded-br-3xl lg:ml-auto mr-2 ml-20 shadow"
            : "bg-white text-green-900 text-sm font-medium rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl lg:mr-auto ml-2 mr-20 shadow"
        }`}
      >
        <p className="text-xs text-green-500 italic mb-1">{landlord.name}</p>
        <p>{msg.content}</p>
      </div>
    ) : null
  )
) : (
  <p className="text-gray-400 text-sm italic">No messages yet...</p>
)}
         <div ref={messagesEndRef} /> {/* ✅ Scroll target */}
  
      </div>
            <div className="px-2 bg-green-100 ">
         <div className=" border   border-blue-100 flex my-2  text-gray-700 italic items-center   rounded  bg-blue-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full outline-none  p-2 bg-transparent"
          placeholder="Type something..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2"
          disabled={!input.trim()}
        >
          <IoSend
            size={30}
            className="text-green-500 px-2 cursor-pointer hover:text-green-700"
          />
        </button>
      </div>
       </div>
       
     
    </section>
  );
};

export default TenantChats;
