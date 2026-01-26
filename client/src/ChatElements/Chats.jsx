import React, { useState, useEffect } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { FaSearch } from 'react-icons/fa'
import { io } from 'socket.io-client'

const socket = io("http://localhost:8080", { withCredentials: true })

const Chats = ({ onSelectChat, activeChatId }) => {
  const [chats, setChats] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔹 helper to sort chats by latest message
  const sortChats = (list) => {
    return [...list].sort((a, b) => {
      const timeA = new Date(a.lastMessage?.createdAt || 0)
      const timeB = new Date(b.lastMessage?.createdAt || 0)
      return timeB - timeA // latest first
    })
  }

  // Fetch chats
  const fetchChats = async () => {
    try {
      const response = await Axios({ ...SummaryApi.view })
      if (response.data.tenants) {
        // initialize unreadCount
        const tenants = response.data.tenants.map((t) => ({
          ...t,
          unreadCount: 0,
        }))
        setChats(sortChats(tenants))
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // Search tenants
  const searchTenants = async () => {
    if (!query) {
      fetchChats()
      return
    }
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.search,
        url: `${SummaryApi.search.url}?query=${query}`,
      })

      if (response.data.success) {
        const tenants = response.data.tenants.map((t) => ({
          ...t,
          unreadCount: 0,
        }))
        setChats(sortChats(tenants))
      } else {
        setChats([])
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchChats()
  }, [])

  // Search debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      searchTenants()
    }, 500)
    return () => clearTimeout(delay)
  }, [query])

  // Listen for new messages via socket.io
  useEffect(() => {
    socket.on("newMessage", (message) => {
      setChats((prevChats) => {
        const updated = prevChats.map((chat) =>
          chat._id === message.chatId
            ? {
                ...chat,
                lastMessage: message,
                unreadCount:
                  chat._id === activeChatId
                    ? 0
                    : (chat.unreadCount || 0) + 1, // 🔴 increment only if not active
              }
            : chat
        )

        // If new chat not in list
        const exists = updated.find((c) => c._id === message.chatId)
        if (!exists) {
          updated.push({
            _id: message.chatId,
            name: message.senderName || "Unknown",
            lastMessage: message,
            unreadCount: 1,
          })
        }

        return sortChats(updated)
      })
    })

    return () => {
      socket.off("newMessage")
    }
  }, [activeChatId])

  // 🔹 When you click chat, reset unreadCount
  const handleSelectChat = (chat) => {
    setChats((prevChats) =>
      prevChats.map((c) =>
        c._id === chat._id ? { ...c, unreadCount: 0 } : c
      )
    )
    onSelectChat(chat)
  }

  return (
    <div className="lg:shadow-md py-2 rounded  w-100 bg-green-50 lg:px-2 ml-0 ">
      <h2 className="font-bold text-sm p-2 text-green-400">Chats</h2>

      {/* Search */}
      <div className="bg-blue-50 p-1 rounded mt-7 flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tenant by room, phone or email..."
          className="outline-none w-full font-light"
        />
        <button
          onClick={searchTenants}
          disabled={loading}
          className="text-white px-4 cursor-pointer py-2 rounded"
        >
          <FaSearch size={18} className="text-green-400" />
        </button>
      </div>

      {/* Tenant List */}
      <div className="h-120 overflow-y-auto  scrollbar-hidden mt-2">
        {chats.map((chat, index) => (
          <div
            key={chat._id || index}
            onClick={() => handleSelectChat(chat)}
            className="mt-0 px-2 py-4 rounded border-white bg-white border-b-green-200 cursor-pointer  hover:bg-green-100 hover:text-white border flex justify-between items-center mb-1"
          >
            {/* Left side: tenant info */}
            <div className="flex gap-3 items-center">
              <span className="text-black text-sm">{index + 1}</span>
              <div className="px-2 flex flex-col">
                {/* Tenant Name + unread badge */}
                <span className="text-sm font-semibold text-black flex items-center gap-2">
                  {chat.name}
                  {chat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </span>

                {/* Last Message */}
                {chat.lastMessage ? (
                  <span className="text-xs text-gray-500 truncate w-40">
                    {chat.lastMessage.content}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 italic">
                    No messages yet...
                  </span>
                )}
              </div>
            </div>

            {/* Right side: last message timestamp */}
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {chat.lastMessage?.createdAt
                ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>
          </div>
        ))}
        <span className="text-sm flex items-center justify-center font-light p-2">
          No more tenants chats...
        </span>
      </div>
    </div>
  )
}

export default Chats
