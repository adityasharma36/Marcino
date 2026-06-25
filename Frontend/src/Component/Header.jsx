import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUser, logoutUser } from "../store/Action/UserAction";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = useSelector((state) => state?.user?.user);

  useEffect(() => {
    if (!user) {
      dispatch(currentUser());
    }
  }, [dispatch, user]);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full backdrop-blur-md bg-gray-900/80 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
        
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="
            text-2xl
            lg:text-4xl
            font-extrabold
            cursor-pointer
            bg-linear-to-r
            from-red-500
            via-orange-400
            to-purple-500
            bg-clip-text
            text-transparent
            hover:scale-105
            transition-all
            duration-300
          "
        >
          MARCINO
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-lg font-semibold text-white">
          
          {user?.role !== "user" && (
            <li
              onClick={() => navigate("/DashBoard")}
              className="
                cursor-pointer
                relative
                hover:text-red-400
                transition-all
                duration-300
                hover:-translate-y-1
                after:absolute
                after:left-0
                after:-bottom-1
                after:w-0
                after:h-0.5
                after:bg-red-500
                after:transition-all
                after:duration-300
                hover:after:w-full
              "
            >
              Dashboard
            </li>
          )}

          <li
            onClick={() => navigate("/")}
            className="
              cursor-pointer
              relative
              hover:text-red-400
              transition-all
              duration-300
              hover:-translate-y-1
              after:absolute
              after:left-0
              after:-bottom-1
              after:w-0
              after:h-0.5
              after:bg-red-500
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Home
          </li>

          <li
            onClick={() => navigate("/Product")}
            className="
              cursor-pointer
              relative
              hover:text-red-400
              transition-all
              duration-300
              hover:-translate-y-1
              after:absolute
              after:left-0
              after:-bottom-1
              after:w-0
              after:h-0.5
              after:bg-red-500
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Product
          </li>

          <li
            onClick={() => navigate("/About")}
            className="
              cursor-pointer
              relative
              hover:text-red-400
              transition-all
              duration-300
              hover:-translate-y-1
              after:absolute
              after:left-0
              after:-bottom-1
              after:w-0
              after:h-0.5
              after:bg-red-500
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            About
          </li>

          <li
            onClick={() => navigate("/Contact")}
            className="
              cursor-pointer
              relative
              hover:text-red-400
              transition-all
              duration-300
              hover:-translate-y-1
              after:absolute
              after:left-0
              after:-bottom-1
              after:w-0
              after:h-0.5
              after:bg-red-500
              after:transition-all
              after:duration-300
              hover:after:w-full
            "
          >
            Contact
          </li>

          <li
            onClick={handleLogout}
            className="
              px-5
              py-2
              rounded-xl
              cursor-pointer
              bg-linear-to-r
              from-red-500
              to-purple-600
              hover:scale-105
              hover:shadow-lg
              hover:shadow-red-500/30
              transition-all
              duration-300
              font-bold
            "
          >
            Logout
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            md:hidden
            p-2
            rounded-xl
            bg-gray-800
            hover:bg-gray-700
            transition-all
            duration-300
          "
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 px-6 py-5 flex flex-col gap-5 text-white font-semibold">
          
          {user?.role !== "user" && (
            <li
              onClick={() => handleNavigate("/DashBoard")}
              className="cursor-pointer hover:text-red-400 transition-all duration-300"
            >
              Dashboard
            </li>
          )}

          <li
            onClick={() => handleNavigate("/")}
            className="cursor-pointer hover:text-red-400 transition-all duration-300"
          >
            Home
          </li>

          <li
            onClick={() => handleNavigate("/Product")}
            className="cursor-pointer hover:text-red-400 transition-all duration-300"
          >
            Product
          </li>

          <li
            onClick={() => handleNavigate("/About")}
            className="cursor-pointer hover:text-red-400 transition-all duration-300"
          >
            About
          </li>

          <li
            onClick={() => handleNavigate("/Contact")}
            className="cursor-pointer hover:text-red-400 transition-all duration-300"
          >
            Contact
          </li>

          <li
            onClick={handleLogout}
            className="
              text-center
              py-3
              rounded-xl
              bg-linear-to-r
              from-red-500
              to-purple-600
              hover:scale-105
              transition-all
              duration-300
            "
          >
            Logout
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;