import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSignIn, useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import useAuthStore from '../../stores/AuthStore'

const Login = () => {
  const { signIn, setActive, isSignedIn, isLoaded } = useSignIn()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { signOut } = useClerk();
  

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async(e) => {
    e.preventDefault()
    
    if (!isLoaded) {
      return
    }

    setIsLoading(true)
    
    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      })
      
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        const userData = result.userData
        setUser(userData)
        
        toast.success('Login successful')
        navigate('/')
      }
    } catch (error) {
      toast.error(error.errors?.[0]?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
  try {
    // Sign out first to clear any existing session
    await signOut();
    
    // Small delay to ensure session is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Then navigate to forgot password
    navigate('/forgot-password');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};




  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='flex flex-col items-center justify-center'>
          <img src={assets.logo} alt="logo" className='w-32 mb-4 cursor-pointer'/>
          <div className='w-full text-center'>
            <h1 className='text-3xl font-bold'><span className='text-primary'>User</span> Login</h1>
            <p className='font-light text-gray-600'>Enter your credentials to access</p>
          </div>
          
          <form onSubmit={handleLogin} className='mt-6 w-full sm:max-w-md'>
            <div className='flex flex-col'>
              <label> Email </label>
              <input 
                onChange={e=>setEmail(e.target.value)} 
                value={email} 
                type='email' 
                required 
                placeholder='your email id' 
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>
            <div className='flex flex-col'>
              <label> Password </label>
              <input 
                type="password" 
                onChange={e=>setPassword(e.target.value)} 
                value={password} 
                required 
                placeholder='your password' 
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>
            <button 
              type="button"
              onClick={handleForgotPassword}
              className='text-sm text-primary hover:underline mb-3'
            >
              Forgot Password?
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !isLoaded}
              className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            > 
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login