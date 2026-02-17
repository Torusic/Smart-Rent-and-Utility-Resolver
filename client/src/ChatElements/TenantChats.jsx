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

  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Fetch landlord info
  useEffect(() => {
    const fetchTenantDashboard = async () => {
      try {
        const { url, method } = SummaryApi.tenantDashboard;
        const { data } = await Axios({ url, method });
        if (data.success && data.data.landlord) {
          setLandlord(data.data.landlord);
        }
      } catch (error) {
        console.error("Error fetching tenant dashboard:", error);
      }
    };
    fetchTenantDashboard();
  }, []);

  // Fetch chat history every 3 seconds
  useEffect(() => {
    if (!landlord?.id) return;
    const fetchMessages = async () => {
      try {
        const { url, method } = SummaryApi.getTenantChats(landlord.id);
        const { data } = await Axios({ url, method });
        if (data.success) setMessages(data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [landlord]);

  const handleSend = async () => {
    if (!landlord?.id || !input.trim()) return;
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
      <div className="p-4 text-gray-500 italic">Loading chat with your landlord...</div>
    );
  }

  return (
    <section className="max-w-9xl mx-auto mt-4 flex flex-col mb-6 h-[600px] rounded-2xl shadow-lg border border-green-200 overflow-hidden bg-gradient-to-t from-[#D1FAE5]">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-green-100 border-b border-green-300 px-4 py-3 flex items-center font-semibold shadow-sm">
        Chat with <span className="italic text-red-500 ml-2">{landlord.name} (Landlord)</span>
      </header>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-green-50 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-100"
      >
        {messages.length ? (
          messages.map((msg) =>
            msg?._id ? (
              <div
                key={msg._id}
                className={`p-3 max-w-xs break-words text-sm font-medium ${
                  msg.senderModel === "Tenant"
                    ? "bg-green-500 text-white rounded-tr-3xl rounded-tl-3xl rounded-br-3xl ml-auto shadow"
                    : "bg-white text-green-900 rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl mr-auto shadow"
                }`}
              >
                {msg.senderModel !== "Tenant" && (
                  <p className="text-xs italic text-green-500 mb-1">{landlord.name}</p>
                )}
                <p>{msg.content}</p>
              </div>
            ) : null
          )
        ) : (
          <p className="text-gray-400 italic text-sm">No messages yet...</p>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-green-100 p-3 flex items-center gap-2 border-t border-green-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2 rounded-full bg-green-200 hover:bg-green-300 transition disabled:opacity-50"
        >
          <IoSend size={25} className="text-green-600 hover:text-green-800" />
        </button>
      </div>
    </section>
  );
};

export default TenantChats;
