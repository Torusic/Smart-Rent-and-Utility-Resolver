// src/ChatElements/ChatLayout.jsx
import React, { useState } from "react";
import Chats from "./Chats";
import MessageChats from "./MessageChats";
import { IoMdChatboxes } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";

const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <section className="lg:shadow-md ml-0 mr-0 bg-green-100 my-auto container lg:w-full w-84 rounded border border-green-100 0 py-2 px-3 h-full">
      <div className="flex h-full">
        {/* LEFT: Chat List */}
        <div
          className={`w-full lg:w-1/3 ${
            selectedChat ? "hidden lg:block" : "block"
          }`}
        >
          <Chats onSelectChat={setSelectedChat} activeChatId={selectedChat?._id} />
        </div>

        {/* RIGHT: Chat Window */}
        <div
          className={`w-full lg:w-2/3 ${
            selectedChat ? "block" : "hidden lg:flex items-center justify-center"
          }`}
        >
          {selectedChat ? (
            <div className="h-full flex flex-col">
              {/* Mobile Back Button */}
              <div className="lg:hidden flex items-center gap-2 p-2">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="flex items-center text-green-600 font-semibold"
                  aria-label="Back to chat list"
                >
                  <IoArrowBack size={22} className="mr-1" /> Back
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto ">
                <MessageChats chat={selectedChat} />
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center w-full h-full animate">
              <IoMdChatboxes size={200} className="text-green-400 mx-auto" />
              <p className="font-extrabold text-3xl text-gray-500 mt-4">
                Landlord Chat Centre
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatLayout;
