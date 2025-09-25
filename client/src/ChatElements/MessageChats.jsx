import React, { useEffect, useState, useRef } from 'react';
import { IoSend } from 'react-icons/io5';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

const MessageChats = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // ✅ Ref for auto-scroll

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages if chat exists
  useEffect(() => {
    if (!chat?._id) return;

    const fetchMessages = async () => {
      try {
        const response = await Axios(SummaryApi.getChat(chat._id));
        if (response.data.success) {
          setMessages(response.data.data);
        }
      } catch (error) {
        AxiosToastError(error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chat]);

  // Send message
  const handleSend = async () => {
    if (!chat || !chat._id || !input.trim()) return;

    try {
      let url, method, payload;

      if (chat.role === "tenant") {
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
    <section className="w-full flex flex-col h-full">
      <header className="shadow-md border border-white border-b-green-400 py-4 h-10 flex items-center font-semibold">
        Chat with {chat.name}{' '}
        <h2 className="italic text-sm text-red-400 px-2 font-light">
          ({chat.role})
        </h2>
      </header>

      <div className="h-105 overflow-y-auto scrollbar-hidden p-3  ">
        {messages.length ? (
          messages.map(msg =>
            msg?._id ? (
              <div
                key={msg._id}
                className={`mb-2 p-2 rounded-ss-xl max-w-xs ${
                  msg.sender === chat._id
                    ? 'bg-green-100 text-black self-start'
                    : 'bg-green-400 text-white ml-auto self-end'
                }`}
              >
                <p className='text-sm text-green-400 italic font-light'>{chat.name}</p>
                {msg.content}
              </div>
            ) : null
          )
        ) : (
          <p className="text-gray-400 text-sm italic">No messages yet...</p>
        )}
        <div ref={messagesEndRef} /> {/* ✅ Scroll target */}
      </div>

      <div className="mt-auto border border-blue-50 flex items-center rounded p-2 bg-blue-50">
        <input
          type="text"
          className="w-full outline-none bg-transparent"
          placeholder="Type something..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
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

export default MessageChats;
