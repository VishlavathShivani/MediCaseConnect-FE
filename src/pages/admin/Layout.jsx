import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from '../../components/Navbar.jsx'

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className='flex h-[calc(100vh-70px)]'>
        <Sidebar />
        <Outlet />
      </div> 
    </>
  )
}

export default Layout