import { Outlet } from "react-router-dom";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Socket } from "socket.io-client";
import Tenant from "./role/Tenant";


function App() {

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.id) {
      Socket.emit("joinUser", user.id);
      console.log("Joined socket room:", user.id);
    }
  }, []);

  return (
    <>
      <main>
        <Outlet />
      
      </main>
      
      <Toaster />
    </>
  );
}

export default App;