import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'
import useAuthStore from '../stores/AuthStore'
import toast from 'react-hot-toast'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()
  const { isAdmin, isClinician, clearUser } = useAuthStore()
  const { signOut } = useClerk()

  const isAdminRoute = location.pathname.startsWith('/admin')

  const handleLogout = async () => {
    try {
      await signOut()
      clearUser()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  return (
    <div className={`flex items-center justify-between ${
      isAdminRoute 
        ? 'py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200' 
        : 'py-5 mx-8 sm:mx-20 xl:mx-32'
    }`}>
      <img 
        onClick={() => navigate('/')} 
        src={assets.logo} 
        alt="logo" 
        className='w-32 sm:w-44 cursor-pointer'
      />

      <div className='flex items-center gap-3'>
        {/* Profile Icon with Tooltip */}
        {user && (
          <div className='relative group'>
            <div className='w-9 h-9 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition-colors'>
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            {/* Tooltip */}
            <div className='absolute right-0 top-11 bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20'>
              {user?.emailAddresses?.[0]?.emailAddress}
            </div>
          </div>
        )}

        {/* Admin Dashboard Button (only show on non-admin routes for admins) */}
        {user && isAdmin() && !isAdminRoute && (
          <button 
            onClick={() => navigate('/admin')} 
            className='flex items-center gap-2 bg-primary text-white rounded-full px-8 py-2.5 text-sm font-medium transition-colors hover:bg-primary/90'
          >
            Dashboard
            <img src={assets.arrow} alt="arrow" className='w-3' />
          </button>
        )}

        {/* Logout Button */}
        {user && (isAdminRoute || isClinician()) && (
          <button 
            onClick={handleLogout} 
            className='bg-primary text-white rounded-full px-8 py-2.5 text-sm font-medium transition-colors hover:bg-primary/90'
          >
            Logout
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar