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

  const messagesEndRef = useRef(null); // ✅ Ref for auto-scroll

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Fetch tenant dashboard to get landlord info
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

  // ✅ Fetch chat history with landlord every 3 seconds
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
    <section className="w-full flex flex-col h-full">
      <header className="shadow-md border border-white border-b-green-400 py-4 h-10 flex items-center font-semibold">
        Chat with
        <h2 className="italic text-sm text-red-400 px-2 font-light">
          {landlord.name}(Landlord)
        </h2>
      </header>

      <div className="h-105 overflow-y-auto scrollbar-hidden text-white font-semibold p-3 bg-white">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 p-2 rounded-ss-xl max-w-xs mr-0 ${
              msg.senderModel === "Tenant"
                ? "bg-green-500 ml-auto "
                : "bg-green-200 text-green-700 mr-auto text-left"
            }`}
          >
            <p className='text-sm text-green-500 italic font-light'>{landlord.name}</p>
            {msg.content}
             
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* ✅ Scroll target */}
      </div>

      <div className="mt-auto border border-blue-50 flex items-center rounded p-2 bg-blue-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full outline-none bg-transparent"
          placeholder="Type something..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2"
          disabled={!input.trim()}
        >
          <IoSend
            size={25}
            className="text-green-500 cursor-pointer hover:text-green-700"
          />
        </button>
      </div>
    </section>
  );
};

export default TenantChats;
