import React from "react";
import useUserLocation from "../Utils/useUserLocation";
import { useSelector } from "react-redux";
import { MapPin, Search } from "lucide-react";
import { CgClose } from "react-icons/cg";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LiaRobotSolid } from "react-icons/lia";
import { useChatbot } from "../Chatbot/ChatbotContext";

const ProductHeader = ({ search, setSearch }) => {
  const { setOpenBox, openBox, getLocation } = useUserLocation();
  const { openChatbot } = useChatbot();

  const navigate = useNavigate();

  const address =
    useSelector((state) => state?.address?.addresses) || [];

  const currentAddress = address[0];

  const toggleDownOpen = () => {
    setOpenBox(!openBox);
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row items-center gap-4">

          {/* Logo */}
          <div
            onClick={() => navigate("/Main")}
            className="cursor-pointer"
          >
            <h1 className="text-3xl font-bold">
              <span className="text-red-500">M</span>arcino
            </h1>
          </div>

          {/* Location */}
          <div
            className="
            flex items-center gap-2
            bg-gray-900
            px-4 py-2
            rounded-xl
            border border-gray-800
            cursor-pointer
            hover:border-red-500
            transition
            "
          >
            <MapPin className="text-red-500 w-5 h-5" />

            <div className="text-sm">
              {currentAddress ? (
                <>
                  <p>{currentAddress?.country}</p>
                  <p className="text-gray-400">
                    {currentAddress?.city}
                  </p>
                </>
              ) : (
                <p>Add Location</p>
              )}
            </div>

            <FaCaretDown
              className="cursor-pointer"
              onClick={toggleDownOpen}
            />
          </div>

          {/* Search */}
          <div className="relative w-full lg:flex-1">
            <Search
              className="absolute left-4 top-3 text-gray-400"
              size={18}
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Products..."
              className="
              w-full
              pl-11
              pr-4
              py-3
              rounded-xl
              bg-gray-900
              border
              border-gray-800
              focus:outline-none
              focus:ring-2
              focus:ring-red-500
              "
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-3">

            <button
              onClick={() => navigate("/Order")}
              className="
              px-5
              py-2
              rounded-xl
              bg-gray-900
              border
              border-gray-800
              hover:border-red-500
              transition
              "
            >
              Order
            </button>

            <button
              onClick={() => navigate("/Cart")}
              className="
              px-5
              py-2
              rounded-xl
              bg-gray-900
              border
              border-gray-800
              hover:border-red-500
              transition
              "
            >
              Cart
            </button>

            <LiaRobotSolid
              onClick={openChatbot}
              className="
              h-14
              w-14
              p-3
              rounded-2xl
              bg-linear-to-r
              from-pink-500
              to-purple-600
              cursor-pointer
              hover:scale-110
              transition
              "
            />
          </div>
        </div>
      </div>

      {/* Location Popup */}
      {openBox && (
        <div
          className="
          fixed
          top-24
          left-1/2
          -translate-x-1/2
          w-[90%]
          md:w-100
          bg-white
          text-black
          rounded-xl
          shadow-2xl
          z-50
          p-5
          "
        >
          <h1 className="flex justify-between text-xl font-semibold mb-4">
            Change Location

            <CgClose
              onClick={toggleDownOpen}
              className="cursor-pointer"
            />
          </h1>

          <button
            onClick={getLocation}
            className="
            bg-red-500
            text-white
            px-4
            py-2
            rounded-lg
            hover:bg-red-400
            transition
            "
          >
            Detect My Location
          </button>
        </div>
      )}
    </>
  );
};

export default ProductHeader;