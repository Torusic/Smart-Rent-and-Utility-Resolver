
import { Outlet } from 'react-router-dom'
import React from 'react'
import { Toaster } from 'react-hot-toast'
function App() {
 

  return (
    <>
     
     <main>
      <Outlet/>
     </main>
     <Toaster/>
   
     
    </>
  )
}

export default App
