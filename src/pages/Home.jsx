import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import ReportList from '../components/ReportList'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Navbar/>
      <Header/>
      <ReportList/>
      {/* <Newsletter/> */}
      <Footer/>
    </>
  )
}

export default Home
