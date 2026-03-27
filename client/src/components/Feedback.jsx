import React from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";

function Feedback() {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-gray-800 flex items-center gap-2">
          Feedback
          <VscFeedback size={18} className="text-green-500" />
        </p>
      </div>

      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-green-400 transition">
        <input
          type="text"
          placeholder="Share your thoughts..."
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />

        <button className="p-2 rounded-lg bg-green-500 hover:bg-green-600 transition shadow-sm">
          <IoSend className="text-white" size={18} />
        </button>
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
        <IoMdInformationCircleOutline size={18} className="mt-[2px]" />
        <p>
          Only system-related feedback is allowed. For other concerns, please
          contact your landlord directly via chat.
        </p>
      </div>
    </section>
  );
}

export default Feedback;