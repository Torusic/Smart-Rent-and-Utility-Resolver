
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from 'react-router-dom'
import React from 'react'
import router from './route'


createRoot(document.getElementById('root')).render(

  <RouterProvider router={router}/>
)
