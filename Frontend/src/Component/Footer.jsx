import React from 'react'
import { Link } from 'react-router-dom'
// import Logo from '../assets/Logo.png'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-200 py-10'>
      <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
        {/*  info */}
        <div className='mb-6 md:mb-0'>
            <Link to='/'>
              {/* <img src={Logo} alt="" className='w-32'/> */}
              <h1 className='text-red-500 text-2xl font-bold'>MARCINO</h1>
            </Link>
            <p className='mt-2 text-sm'>Powering Your World with the Best in Electronics.</p>
            <p className='mt-2 text-sm'>123 Supermart St, Wired City, NY 10001</p>
            <p className='text-sm'>Email: support@MARCINO.com</p>
            <p className='text-sm'>Phone: (123) 983-7890</p>
        </div>
        {/* customer service link */}
        <div className='mb-6 md:mb-0'>
            <h3 className='text-xl font-semibold'>Customer Service</h3>
            <ul className='mt-2 text-sm space-y-2'>
                <li className='cursor-pointer hover:scale-110 hover:-translate-y-1 hover:text-gray-400'>Contact Us</li>
                <li className='cursor-pointer hover:scale-110 hover:-translate-y-1 hover:text-gray-400'>Shipping & Returns</li>
                <li className='cursor-pointer hover:scale-110 hover:-translate-y-1 hover:text-gray-400'>FAQs</li>
                <li className='cursor-pointer hover:scale-110 hover:-translate-y-1 hover:text-gray-400' >Order Tracking</li>
                <li className='cursor-pointer hover:scale-110 hover:-translate-y-1 hover:text-gray-400'>Size Guide</li>
            </ul>
        </div>
        {/* social media links */}
        <div className='mb-6 md:mb-0'>
            <h3 className='text-xl font-semibold'>Follow Us</h3>
            <div className='flex space-x-4 mt-2 cursor-pointer'>
                < FaFacebook className='hover:scale-110  hover:-translate-y-1'/>
                <FaInstagram className='hover:scale-110  hover:-translate-y-1'/>
                <FaTwitterSquare className='hover:scale-110  hover:-translate-y-1 '/>
                <FaPinterest className='hover:scale-110  hover:-translate-y-1' />
            </div>
        </div>
        {/* newsletter subscription */}
        <div>
            <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
            <p className='mt-2 text-sm'>Subscribe to get special offers, free giveaways, and more</p>
            <form action="" className='mt-4 flex'>
                <input 
                type="email" 
                placeholder='Your email address'
                className='w-full p-2 rounded-l-md  text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500'
                />
                <button type='submit' className='bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700'>Subscribe</button>
            </form>
        </div>
      </div>
      {/* bottom section */}
      <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm'>
        <p>&copy; {new Date().getFullYear()} <span className='text-red-500 cursor-pointer'>MARCINO</span>. All rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer