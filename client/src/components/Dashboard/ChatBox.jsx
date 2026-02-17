import React, { useState } from "react";
import Chats from "../../ChatElements/Chats";
import MessageChats from "../../ChatElements/MessageChats";
import { IoMdChatboxes } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";

const ChatBox = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <section className="lg:shadow-md ml-0 bg-white lg:w-full w-84 rounded border border-white lg:border-green-400  py-2 h-full">
      <div className="flex h-full">
        {/*  Chat List */}
        <div
          className={`w-full lg:w-1/3 ${
            selectedChat ? "hidden lg:block" : "block"
          }`}
        >
          <Chats onSelectChat={setSelectedChat} />
        </div>

        {/* Messages */}
        <div
          className={`w-full lg:w-2/3 ${
            selectedChat ? "block" : "hidden lg:flex items-center justify-center"
          }`}
        >
          {selectedChat ? (
            <div className="h-full flex flex-col">
              {/* Back Button for Mobile */}
              <div className="lg:hidden flex items-center gap-2 p-2 ">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="flex items-center text-green-600 font-semibold"
                >
                  <IoArrowBack size={22} className="mr-1" />
                  
                </button>
              </div>

              {/* Message Area */}
              <MessageChats chat={selectedChat} />
            </div>
          ) : (
            <div className="hidden lg:grid animate-bounce text-center w-full">
              <IoMdChatboxes size={200} className="text-green-400 mx-auto" />
              <p className="font-extrabold text-3xl text-gray-500">
                Landlord Chat Centre
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatBox;
