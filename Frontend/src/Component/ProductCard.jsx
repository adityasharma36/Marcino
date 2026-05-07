import { IoCartOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getProductById } from "../store/Action/ProductAction";
import { addProInCart } from "../store/Action/CartAction";
// import useCart from "../Context/useCart";

const ProductCard = ({ data }) => {

  
  const dispatch = useDispatch();


  return (

    <div className="border relative border-gray-100 rounded-2xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all p-2 h-max">

      {/* ✅ Only image/title area clickable */}
      <Link to={`/Product/${data._id}`}>
        <img
          src={data.images?.[0].url || data.thumbnail}
          alt={data.thumbnail}
          className="bg-gray-100 aspect-square"
        />

        <h1 className="line-clamp-2 p-1 font-semibold">
          {data.title}
        </h1>

        <p className="my-1 text-lg text-gray-800 font-bold">
          ${data.price.amount}
        </p>
      {/* </Link> */}

      {/* ✅ Cart Button */}
      <button
        onClick={(e) => {
          e.preventDefault();   // stops Link navigation

          dispatch(getProductById(data));
          console.log(data)
          
          dispatch(addProInCart(data));
        }}
        className="bg-red-500 px-3 py-2 text-lg rounded-md text-white w-full cursor-pointer flex gap-2 items-center justify-center font-semibold"
      >
        <IoCartOutline className="w-6 h-6" />
        Add To Cart
      </button>
      </Link>

    </div>
  );
};

export default ProductCard;
