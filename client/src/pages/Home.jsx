import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url(assets/bg_img.png)] bg-cover bg-center'>
    <Header/>
    <Navbar/>
    {/* <Login/> */}
    </div>
  )
}

export default Home
