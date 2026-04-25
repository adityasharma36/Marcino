import React from 'react'

const cirImg = "https://sanity-cdn.fabfitfun.com/images/q4cs1xgp/production/f8a1988cc0c5d872f5644240f5b6ab8444720886-400x400.png?fm=webp&q=100&w=1200&width=1200"
const mainImg = 'https://sanity-cdn.fabfitfun.com/images/q4cs1xgp/production/26759c6cbed845be0e1f3f3d4d1ffd01a46bba5d-988x658.jpg?fm=webp&q=100&w=1920&width=1920'
const Section2 = () => {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>

        <div className='w-full flex items-center justify-center'>
            <h1 className='font-extralight text-xl text-red-400 '>HOW IT WORK</h1>
        </div>
        <div className='w-full flex justify-center items-center'>
            <h1 className='w-[25%]  text-center line-clamp-3 text-4xl'>Amazing Brands . Huge Saving . All Year Long .</h1>
        </div>
        <div className='w-full flex p-10'>
            <div className='flex flex-col w-1/2'>
                <h1 className='text-2xl bg-blue-300 text-center font-light'>Free Bonus Box With Annual Plan ($250 Values)</h1>
                <div className='h-fit relative'>
                    <img src={cirImg} alt="" className='h-[25%] w-[15%] absolute top-[10%] left-[5%] object-fill'/>
                    <img src={mainImg} alt='' className='h-full w-full'/>
                </div>
            </div>
            <div className='flex flex-col items-center justify-center  w-1/2'>
                <div className='flex flex-col m-5  justify-center items-start'>
                    <h1 className='text-amber-600'><i class="ri-gift-line"></i>Today</h1>
                    <p className=' text-xl text-start'>Choose six full-size products from premium brands you love.<br/> Get up to $350 of value for as low as $65.</p>
                </div>
                 <div className='flex flex-col m-5  justify-center'>
                    <h1 className='text-amber-600'><i class="ri-calendar-line"></i>Every 3 Months</h1>
                    <p className=' text-xl text-start'>Every season, select your products from 100+  freshly  curated <br/> options. Swap for store credit any time.</p>
                </div>
                 <div className='flex flex-col  m-5 justify-center '>
                    <h1 className='text-amber-600'><i class="ri-flashlight-fill"></i>Weekly Sales</h1>
                    <p className=' text-xl text-start '>Access our weekly flash sales and save up to 70% off top brands.</p>
                </div>
            </div>
        </div>

        <div className='w-full flex justify-center '>
            <button className='px-5 py-2 text-center rounded-xl border hover:-translate-x-2 hover:text-black border-amber-600 cursor-pointer hover:scale-110 transition hover:-translate-y-2 bg-linear-to-r from-orange-300 to-yellow-500'>GET STARTED</button>
        </div>


    </div>
  )
}

export default Section2