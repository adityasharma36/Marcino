

import React, { useMemo } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from 'react-redux'
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai'

const SampleNextArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{ ...style, display: "block", zIndex: 5, right: "25px" }}
      onClick={onClick}
    >
      <AiOutlineArrowRight
        className="arrows"
        style={{
          borderRadius: "50px",
          background: "#f53347",
          color: "white",
          padding: "6px",
          fontSize: "32px",
        }}
      />
    </div>
  );
};
const SamplePrevArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{ ...style, display: "block", zIndex: 5, left: "20px" }}
      onClick={onClick}
    >
      <AiOutlineArrowLeft
        className="arrows"
        style={{
          borderRadius: "50px",
          background: "#f53347",
          color: "white",
          padding: "6px",
          fontSize: "32px",
        }}
      />
    </div>
  );
};

const Carosol = () => {

  const products = useSelector((state)=>state.product.products);
  console.log(products);




    const setting = {
        dots:false,
        autoplay:true,
        infinite:true,
        speed:500,
        autoplaySpeed:2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    }

    const uniqueProduct = useMemo(() => {
      const productList = Array.isArray(products) ? products : products?.data;

      if (!Array.isArray(productList)) return [];

      return productList.slice(0, 7);
    }, [products])

  return (
     <div>
      {uniqueProduct.length > 0 ? (
      <Slider {...setting}>
        {uniqueProduct.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-linear-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] mt-20"
          >
            <div className="flex gap-10 justify-center h-150 items-center px-4">
              <div className="space-y-6">
                <h3 className="text-red-500 font-semibold font-sans text-sm">
                  Power Your World with the best in Electronic
                </h3>

                <h1 className="text-white text-4xl font-bold line-clamp-3 uppercase w-125">
                  {item.title}
                </h1>

                <p className="text-gray-300 text-xl font-semibold pr-7 line-clamp-4 w-125">
                  {item.description}
                </p>

                <button className="bg-linear-to-r from-red-500 to-purple-500 mt-2 text-white px-3 py-3 rounded-md cursor-pointer">
                  Shop Now
                </button>
              </div>

              <div>
                <img
                  src={item?.images?.[0]?.url || item?.images?.[0] || item?.image || ""}
                  alt={item.title}
                  className="rounded-full bg-white w-100 hover:scale-105 transition-all shadow-2xl shadow-red-400"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
      ) : (
        <div className="flex h-96 items-center justify-center text-xl text-gray-400">
          Loading carousel...
        </div>
      )}
    </div>
  )
}

export default Carosol