import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = () => {
  return (
    <div className='flex flex-col border-r border-gray-200 min-h-full pt-6'>

      <NavLink end={true} to='/admin' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.home_icon} alt="" className='min-w-4 w-5 ' />
        <p className='hidden md:inline-block'>Dashboard</p>
      </NavLink>

      <NavLink to='/admin/addReport' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.add_icon} alt="" className='min-w-4 w-5 ' />
        <p className='hidden md:inline-block'>Add Report</p>
      </NavLink>

      <NavLink to='/admin/listReports' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.list_icon} alt="" className='min-w-4 w-5 ' />
        <p className='hidden md:inline-block'>List Reports</p>
      </NavLink>

      {/* <NavLink to='/admin/comments' className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.comment_icon} alt="" className='min-w-4 w-5 '/>
        <p className='hidden md:inline-block'>Comments</p>
        </NavLink> */}

        
      <NavLink to='/admin/departments' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.list_icon} alt="" className='min-w-4 w-5 ' />
        <p className='hidden md:inline-block'>Departments</p>
      </NavLink>

      <NavLink to='/admin/users' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`}>
        <img src={assets.user_icon} alt="" className='min-w-6 w-6' />
        <p className='hidden md:inline-block'>Users</p>
      </NavLink>

    </div>
  )
}

export default Sidebar
