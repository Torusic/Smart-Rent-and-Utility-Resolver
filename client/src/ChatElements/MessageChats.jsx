import React, { useEffect, useState, useRef } from 'react';
import { IoSend } from 'react-icons/io5';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

const MessageChats = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Fetch messages
  useEffect(() => {
    if (!chat?._id) return;

    const fetchMessages = async () => {
      try {
        const response = await Axios(SummaryApi.getChat(chat._id));
        if (response.data.success) setMessages(response.data.data);
      } catch (error) {
        AxiosToastError(error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chat]);

  // Mark messages as read
  useEffect(() => {
    if (!chat?._id) return;

    const markAsRead = async () => {
      try {
        await Axios({
          url: SummaryApi.markTenantMessagesAsRead.url,
          method: SummaryApi.markTenantMessagesAsRead.method,
          data: { tenantId: chat._id },
        });
      } catch (error) {
        console.error('Error marking messages as read', error);
      }
    };

    markAsRead();
  }, [chat]);

  // Send message
  const handleSend = async () => {
    if (!chat || !chat._id || !input.trim()) return;

    try {
      let url, method, payload;

      if (chat.role === 'tenant') {
        // Landlord sending to tenant
        ({ url, method } = SummaryApi.sendChat(chat._id));
        payload = { tenantId: chat._id, content: input.trim() };
      } else {
        // Tenant sending to landlord
        ({ url, method } = SummaryApi.sendChatToLandlord(chat._id));
        payload = { landlordId: chat._id, content: input.trim() };
      }

      const response = await Axios({ url, method, data: payload });

      if (response.data.success) {
        setMessages(prev => [...prev, response.data.data]);
        setInput('');
        toast.success(response.data.message);
      } else if (response.data.error) {
        toast.error(response.data.message);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  if (!chat) {
    return (
      <div className="p-4 text-gray-500 italic">
        Select a tenant to start chatting.
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col h-155 rounded-2xl   overflow-hidden bg-gradient-to-t from-green-100 to-green-50">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-green-200 border-b border-green-300 px-4 py-3 flex items-center justify-between font-semibold shadow-sm">
        <div>
          Chat with <span className="italic text-red-500">{chat.name}</span>
          <span className="text-sm text-gray-600 ml-2">({chat.role})</span>
          <p className="text-gray-400 text-xs font-normal italic ">room {chat.room}</p> 
          
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto scrollbar-hidden  overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-100"
      >
        {messages.length ? (
          messages.map(msg =>
            msg?._id ? (
              <div
                key={msg._id}
                className={`p-3 max-w-xs break-words text-sm font-medium shadow ${
                  msg.senderModel === 'Tenant'
                    ? 'bg-white text-green-900 py-5 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl mr-auto'
                    : 'bg-green-500 text-white rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl ml-auto'
                }`}
              >
                {msg.senderModel !== 'Tenant' && (
                  <p className="text-xs text-green-200 italic mb-1">{chat.name}</p>
                )}
                <p>{msg.content}</p>
              </div>
            ) : null
          )
        ) : (
          <p className="text-gray-400 text-sm italic">No messages yet...</p>
        )}
      </div>

      {/* Input */}
      <div className="bg-green-200 p-3  border-t border-green-50 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 p-3 rounded-xl border border-gray-400 outline-none focus:ring-2 focus:ring-green-300 focus:border-green-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2 rounded-full bg-green-300 hover:bg-green-400 transition disabled:opacity-50"
        >
          <IoSend size={25} className="text-green-700 hover:text-green-900" />
        </button>
      </div>
    </section>
  );
};

export default MessageChats;
