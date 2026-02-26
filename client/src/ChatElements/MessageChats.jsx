import React, { useEffect, useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

const MessageChats = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("General");
  const [filterCategory, setFilterCategory] = useState("All");
  const scrollRef = useRef(null);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  
  useEffect(() => {
    if (!chat?._id) return;

    const fetchMessages = async () => {
      try {
        const response = await Axios(
          SummaryApi.getChat(chat._id, filterCategory)
        );

        if (response?.data?.success) {
          setMessages(response.data.data || []);
        }
      } catch (error) {
        AxiosToastError(error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chat, filterCategory]);

 
  useEffect(() => {
    if (!chat?._id) return;

    const markAsRead = async () => {
      try {
        await Axios({
          ...SummaryApi.markTenantMessagesAsRead,
          data: { tenantId: chat._id },
        });
      } catch (error) {
        console.error("Mark read error:", error);
      }
    };

    markAsRead();
  }, [chat]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (!chat?._id || !input.trim()) return;

    try {
      let apiConfig;
      let payload;

      if (chat.role === "tenant") {
        // Landlord → Tenant
        apiConfig = SummaryApi.sendChat;
        payload = {
          tenantId: chat._id,
          content: input.trim(),
          category,
        };
      } else {
        // Tenant → Landlord
        apiConfig = SummaryApi.sendChatToLandlord;
        payload = {
          landlordId: chat._id,
          content: input.trim(),
          category,
        };
      }

      const response = await Axios({
        ...apiConfig,
        data: payload,
      });

      if (response?.data?.success) {
        setMessages((prev) => [...prev, response.data.data]);
        setInput("");
      } else {
        toast.error(response?.data?.message || "Failed to send");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };


  if (!chat?._id) {
    return (
      <div className="p-4 text-gray-500 italic">
        Select a tenant to start chatting.
      </div>
    );
  }

  return (
    <section className="w-full h-[630px] ml-6 flex flex-col border-r-4 rounded-2xl border-gray-400   rounded-2xl overflow-hidden bg-gradient-to-t from-green-100 to-green-50 shadow">
     
        <header className="sticky top-0 z-10 bg-white  px-4 py-3 flex flex-col gap-1 shadow-sm">
        <div className="font-semibold">
          Chat with{" "}
          <span className="italic text-red-500">{chat?.name}</span>
          <span className="text-sm text-gray-600 ml-2">
            ({chat?.role})
          </span>
          <p className="text-gray-500 text-xs italic">
            Room {chat?.room}
          </p>
        </div>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-xs p-1 rounded-lg  outline-none bg-gray-100  w-40"
        >
          <option value="All">All</option>
          <option value="General">General</option>
          <option value="Rent">Rent</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Announcement">Announcement</option>
        </select>
      </header>

    
      <div
        ref={scrollRef} 
        className="flex-1 space-y-3  overflow-y-auto p-4 h-full bg-green-50 scrollbar-hidden scrollbar-thumb-green-300 scrollbar-track-green-100"
      >
        {messages?.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center">
            Start the conversation by sending a massage to your tenant. You can filter messages by category using the dropdown above...
          </p>
        ) : (
          messages?.map((msg) => {
            if (!msg?._id) return null;

            const isTenantMessage =
              msg?.senderModel === "Tenant";

            return (
              <div
                key={msg._id}
                className={`p-3 max-w-xs break-words text-sm font-medium shadow ${
                  isTenantMessage
                    ? "bg-gradient-to-r from-gray-50 to-white  text-green-900 py-4 border-l-4 rounded-2xl border-gray-400 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl mr-auto"
                    : "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-l-4 rounded-2xl border-green-600 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl ml-auto"
                }`}
              >
                {/* Category Badge */}
                <span className="text-[10px] px-2 py-1 rounded-full bg-black/10 mb-1 inline-block">
                  {msg?.category || "General"}
                </span>

                <p>{msg?.content}</p>
                <p className="text-xs text-gray-600 mt-1 w-fit ml-auto">
                 {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  : ""}
                </p>
              </div>
            );
          })
        )}
      </div>

      
      <div className="bg-white  p-2       flex flex-col gap-2">

        {/* Category Selector */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 rounded bg-gray-100 outline-none text-sm"
        >
          <option value="General">General</option>
          <option value="Rent">Rent</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Announcement">Announcement</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-3 rounded-xl bg-gray-100  outline-none focus:ring-2 focus:ring-green-300"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 rounded-full bg-green-300 hover:bg-green-400 transition disabled:opacity-50"
          >
            <IoSend size={22} className="text-green-700" />
          </button>
        </div>
      </div>
   

    
      
    </section>
  );
};

export default MessageChats;