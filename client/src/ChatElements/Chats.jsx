import React, { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { FaSearch } from "react-icons/fa";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { getRandomBG } from "../utils/getRandomBG";

const socket = io("http://localhost:8080", { withCredentials: true });

const Chats = ({ onSelectChat, activeChatId }) => {
  const [chats, setChats] = useState([]);
  const [query, setQuery] = useState();
  const [loading, setLoading] = useState(false);
  const location=useLocation()
  const[status,setStatus]=("chat")

  const isActive=(path)=>location.pathname===path



  //  Sort chats by latest message
  const sortChats = (list) =>
    [...list].sort(
      (a, b) =>
        new Date(b.lastMessage?.createdAt || 0) -
        new Date(a.lastMessage?.createdAt || 0)
    );

  // Fetch initial chat list
  const fetchChats = async () => {
    try {
      const response = await Axios(SummaryApi.view);
      if (response.data.tenants) {
        const tenants = response.data.tenants.map((t) => ({
          ...t,
          unreadCount: 0,
        }));
        setChats(sortChats(tenants));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Search tenants
  const searchTenants = async () => {
    if (!query) return fetchChats();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.search,
        url: `${SummaryApi.search.url}?query=${query}`,
      });

      if (response.data.success) {
        const tenants = response.data.tenants.map((t) => ({
          ...t,
          unreadCount: 0,
        }));
        setChats(sortChats(tenants));
      } else {
        setChats([]);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchChats();
  }, []);

  // Search debounce
  useEffect(() => {
    const delay = setTimeout(searchTenants, 500);
    return () => clearTimeout(delay);
  }, [query]);

  // Socket listener for new messages
  useEffect(() => {
    socket.on("newMessage", (message) => {
      setChats((prevChats) => {
        let exists = false;

        const updated = prevChats.map((chat) => {
          if (chat._id === message.chatId) {
            exists = true;
            return {
              ...chat,
              lastMessage: message,
              unreadCount:
                chat._id === activeChatId
                  ? 0
                  : (chat.unreadCount || 0) + 1,
            };
          }
          return chat;
        });

        if (!exists) {
          updated.push({
            _id: message.chatId,
            name: message.senderName || "Unknown",
            lastMessage: message,
            unreadCount: 1,
          });
        }

        return sortChats(updated);
      });
    });

    return () => socket.off("newMessage");
  }, [activeChatId]);

  // Handle chat click
  const handleSelectChat = (chat) => {
    setChats((prevChats) =>
      prevChats.map((c) =>
        c._id === chat._id ? { ...c, unreadCount: 0 } : c
      )
    );
    onSelectChat(chat);
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.length > 1
      ? names[0][0] + names[1][0]
      : names[0][0];
  };

  return (
    <div className="lg:shadow-md py-1 z-50 rounded-t-2xl w-90 rounded-b-2xl   border-t-5 border-b-5 border-green-500 h-full bg-white  lg:px-2 ml-0">
      <h2 className="font-bold text-sm p-2 text-green-400">Chats</h2>

      {/* Search */}
      <div className="bg-gray-100 p-2 rounded-xl mt-2 flex items-center text-gray-500">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tenant by room, phone or email..."
          className="outline-none w-full font-light text-black"
        />
        <button
          onClick={searchTenants}
          disabled={loading}
          className="px-2 cursor-pointer"
        >
          <FaSearch size={18} className="text-green-400" />
        </button>
      </div>

      {/* Tenant List */}
      <div className="h-129 overflow-y-auto  scrollbar-hidden mt-2">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() =>{handleSelectChat(chat)
                setStatus("chat")
              }}
              className={`  px-2- py-3 rounded border-white  border-b-green-200 cursor-pointer  px-2 hover:bg-green-300 flex justify-between items-center ${
                activeChatId === chat._id ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white" : "bg-white"
              }`}
            >
              <div className="flex gap-3 items-center">
                <div style={{backgroundColor:getRandomBG()}} className="w-10 h-10 flex items-center justify-center bg-green-400 rounded-full text-white font-semibold text-sm">
                  {getInitials(chat.name)} 
                </div>
                <div className="px-2 flex flex-col">
                  
                  <span className="text-sm font-semibold text-black flex items-center  gap-2">
                    {chat.name} 
                    {chat.unreadCount > 0 && (
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    )}
                  </span>
                  {chat.lastMessage ? (
                    <span className="text-xs text-gray-700 truncate w-40">
                      {chat.lastMessage.content}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      No messages yet...
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-700 whitespace-nowrap">
                {chat.lastMessage?.createdAt
                  ? new Date(chat.lastMessage.createdAt).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  : ""}
              </div>
            </div>
          ))
        ) : (
          <span className="text-sm flex items-center justify-center font-light p-2">
            No tenant chats found...
          </span>
        )}
      </div>
    </div>
  );
};

export default Chats;
