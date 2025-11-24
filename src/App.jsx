import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useEffect } from "react"
import Home from './pages/Home'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddReport from './pages/admin/AddReport'
import ListReports from './pages/admin/ListReports'
import Departments from './pages/admin/Departments';
import Users from './pages/admin/Users';
import Login from './pages/Login'
import Loader from './components/Loader'
import ForgotPassword from './pages/ForgotPassword'
import 'quill/dist/quill.snow.css'
import { Toaster } from 'react-hot-toast'
import { useUser, useAuth } from '@clerk/clerk-react'
import useAuthStore from './stores/AuthStore'
import { setTokenGetter } from './utils/axios'

const App = () => {

  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const { setUser, clearUser, isAdmin } = useAuthStore()

  useEffect(() => {
    if (isLoaded) {
      // Set user in AuthStore
      user ? setUser(user) : clearUser()
      
      // Set token getter for axios
      setTokenGetter(getToken)
    }
  }, [user, isLoaded, getToken])

  // const {token} = useAppContext()

  return (
    <div>
      <Toaster />

      <Routes>
        {/* Root redirect */}
        <Route
          path='/'
          element={
            !isLoaded ? (
              <Loader />
            ) : user ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Login - redirect if already authenticated */}
        <Route
          path='/login'
          element={
            !isLoaded ? (
              <Loader />
            ) : !user ? (
              <Login />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Forgot Password - redirect if already authenticated */}
        <Route
          path='/forgot-password'
          element={
            !isLoaded ? (
              <Loader />
            ) : !user ? (
              <ForgotPassword />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Home - protected route */}
        <Route
          path='/home'
          element={
            !isLoaded ? (
              <Loader />
            ) : user ? (
              <Home />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Blog - protected route */}
        {/* <Route
          path='/blog/:id'
          element={
            !isLoaded ? (
              <Loader />
            ) : user ? (
              <Blog />
            ) : (
              <Navigate to="/login" />
            )
          }
        /> */}

        {/* Admin - protected for admins only */}
        <Route
          path='/admin'
          element={
            !isLoaded ? (
              <Loader />
            ) : !user ? (
              <Navigate to="/login" />
            ) : isAdmin() ? (
              <Layout />
            ) : (
              <div className="flex items-center justify-center h-screen">
                <div className="text-center p-8 bg-red-50 rounded border border-red-200">
                  <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
                  <p className="text-gray-700">Only admins can access this page.</p>
                  <button
                    onClick={() => window.location.href = '/home'}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='addReport' element={<AddReport />} />
          <Route path='listReports' element={<ListReports />} />
          <Route path='departments' element={<Departments />} />
          <Route path='users' element={<Users />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App



