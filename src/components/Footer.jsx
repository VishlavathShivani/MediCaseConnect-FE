import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3'>

      <div className='flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500'>

        <div className='max-w-md'>
          <img src={assets.logo} alt="logo" className='w-32 sm:w-44' />
          <p className='mt-6 text-sm leading-relaxed'>
            MediCaseConnect streamlines medical report management and analysis, 
            enabling healthcare professionals to efficiently store, search, and 
            retrieve patient diagnostic reports with advanced AI-powered insights.
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='font-semibold text-base text-gray-900 mb-2'>Developed By</h3>
          <p className='text-sm'>Shivani Vishlavath</p>
          <p className='text-sm text-gray-400'>Full Stack Developer</p>
          <p className='text-sm text-gray-400'>vishlavathshivani@gmail.com</p>
        </div>

      </div>

      <p className='py-4 text-center text-sm md:text-base text-gray-500/80'>
        Copyright 2025 © MediCaseConnect - All Rights Reserved.
      </p>

    </div>
  )
}

export default Footer