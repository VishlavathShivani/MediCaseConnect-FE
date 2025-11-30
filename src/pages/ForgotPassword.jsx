import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSignIn, useClerk } from '@clerk/clerk-react'
import { useNavigate , Navigate} from 'react-router-dom'
import { assets } from '../assets/assets'

const ForgotPassword = () => {
  const { signIn, setActive } = useSignIn()
  const navigate = useNavigate()

  const [resetEmail, setResetEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetStep, setResetStep] = useState(1)


  const handleSendResetCode = async (e) => {
    e.preventDefault()
    try {

      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: resetEmail,
      })
      setResetStep(2)
      toast.success('Reset code sent to your email')
    } catch (error) {
      toast.error(error.errors?.[0]?.message || 'Failed to send reset code')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: resetCode,
        password: newPassword,
      })
     if (result.status === 'complete') {
        // IMPORTANT: Set the active session first
        await setActive({ session: result.createdSessionId })
        
        // Small delay to let the session propagate
        await new Promise(resolve => setTimeout(resolve, 200))
        
        toast.success('Password reset successfully!')
        navigate('/home') // Navigate directly to home
      }
    } catch (error) {
      console.log(error)
      toast.error(error.errors?.[0]?.message || 'Failed to reset password', {
        duration: 5000, // Show for longer
        style: {
          maxWidth: '500px', // Increase width
          whiteSpace: 'normal', // Allow text wrapping
        }
      });

    }
  }




  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='flex flex-col items-center justify-center'>
          <img src={assets.logo} alt="logo" className='w-32 mb-4 cursor-pointer' onClick={() => navigate('/')} />
          <div className='w-full text-center'>
            <h1 className='text-3xl font-bold'><span className='text-primary'>Reset</span> Password</h1>
            <p className='font-light text-gray-600'>
              {resetStep === 1 ? 'Enter your email to receive reset code' : 'Enter code and new password'}
            </p>
          </div>

          <form onSubmit={resetStep === 2 ? handleResetPassword : handleSendResetCode} className='mt-6 w-full sm:max-w-md text-gray-600'>
            {resetStep === 1 && (
              <div className='flex flex-col'>
                <label>Email</label>
                <input
                  type='email'
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder='your email'
                  className='border-b-2 border-gray-300 p-2 outline-none mb-6'
                  required
                />
              </div>
            )}

            {resetStep === 2 && (
              <>
                <div className='flex flex-col'>
                  <label>Reset Code</label>
                  <input
                    type='text'
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder='6-digit code from email'
                    className='border-b-2 border-gray-300 p-2 outline-none mb-6'
                    required
                  />
                </div>
                <div className='flex flex-col'>
                  <label>New Password</label>
                  <input
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='your new password'
                    className='border-b-2 border-gray-300 p-2 outline-none mb-6'
                    required
                  />
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => navigate('/login')}
              className='text-sm text-primary hover:underline mb-3'
            >
              Back to Login
            </button>

            <button type='submit' className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all'>
              {resetStep === 1 ? 'Send Reset Code' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword