import React, { useState } from 'react'
import Chats from '../../ChatElements/Chats'
import MessageChats from '../../ChatElements/MessageChats'
import { IoMdChatboxes } from "react-icons/io"

const ChatBox = () => {
  const [selectedChat, setSelectedChat] = useState(null) 

  return (
   <section className='shadow-md bg-white rounded border border-green-400 p-4'>
    <div className='flex gap-4'>
     
      <div className=''>
        <Chats onSelectChat={setSelectedChat} />
      </div>
      
     
      <div className='w-full flex items-center justify-center'>
        {selectedChat ? (
          <MessageChats chat={selectedChat} />
        ) : (
          <div className='grid animate-bounce text-center'>
            <IoMdChatboxes size={200} className='text-green-400 mx-auto'/>
            <p className='font-extrabold text-3xl text-gray-500'>
              Landlord Chat Centre
            </p>
          </div>
        )}
      </div>
    </div>
   </section>
  )
}

export default ChatBox
