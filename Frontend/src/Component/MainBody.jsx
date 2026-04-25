

const banner= "https://sanity-cdn.fabfitfun.com/images/q4cs1xgp/production/a035c1337c0a854694a3b9957cf613d6ff88603d-2200x990.png?fm=webp&q=100&w=1920&width=1920"

function MainBody() {
  return (
    <div className="h-fit">

      <div className="relative">
        <img src={banner} alt="" />
        <div className="absolute top-50 left-25">
          <h1 className="text-lg font-extralight ">BEST SALE OF THE YEAR</h1>
        <h1 className="text-5xl line-clamp-2 w-[52%] m-0.5 font-extralight">GET FREE BONUS BOX ($240 VALUE)</h1>
        <p className="text-xl my-2 font-normal line-clamp-2 w-[60%]">Get curated boxes of your favorite brands up to 70% off, plus a FREE $250 Bonus Box!</p>
        <button className=" hover:translate-y-2 hover:translate-x-2 bg-amber-600 hover:bg-linear-to-r from-red-500 to-purple-500 text-white p-2 rounded-md hover:scale-110 border border-amber-700 transition-all shadow-2xl shadow-amber-200 cursor-pointer">GET STARTED</button>
        </div>
      </div>

           
    </div>
  )
}

export default MainBody