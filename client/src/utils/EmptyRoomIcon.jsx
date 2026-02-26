import React from "react";
const EmptyRoomIcon = () => {
  return (
    <div className="flex flex-col items-center justify-center text-gray-400 p-6">

      <svg
        width="120"
        height="120"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-70"
      >
        <path d="M3 21h18" />
        <path d="M6 21V9" />
        <path d="M18 21V9" />
        <path d="M6 9l6-4 6 4" />
        <path d="M10 21v-6h4v6" />
        <path d="M14 5.5V3h2v1.5" />
      </svg>

      <p className="mt-3 text-sm text-gray-400 font-medium">
        No vacant rooms available
      </p>

    </div>
  );
};

export default EmptyRoomIcon;