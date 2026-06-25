import React, {
  useEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../store/Action/ProductAction";

const ProductFilter = ({
  category,
  setCategory,
  brand,
  setBrand,
  price,
  setPrice,
  setSearch,
}) => {
  const dispatch = useDispatch();

  const products = useSelector(
    (state) => state.product.products
  );

  const productList = Array.isArray(products)
    ? products
    : products?.data || [];

  useEffect(() => {
    if (!productList.length) {
      dispatch(getProduct());
    }
  }, [dispatch, productList.length]);

  const uniqueCateogry = useMemo(() => {
    if (!productList?.length) return [];

    const set = new Set();

    productList.forEach((item) => {
      if (item?.category) set.add(item.category);
    });

    return ["All", ...Array.from(set)];
  }, [productList]);

  const uniqueBrand = useMemo(() => {
    if (!productList?.length) return [];

    const set = new Set();

    productList.forEach((item) => {
      if (item?.brand) set.add(item.brand);
    });

    return ["All", ...Array.from(set)];
  }, [productList]);

  const handleReset = () => {
    setSearch("");
    setCategory("All");
    setBrand("All");
    setPrice([0, 5000]);
  };

  return (
    <div
      className="
      w-full
      lg:w-72
      bg-gray-900
      text-white
      rounded-2xl
      p-6
      shadow-xl
      border
      border-gray-800
      h-max
    "
    >
      <h1 className="text-xl font-bold text-center mb-6">
        Filter Products
      </h1>

      <h2 className="text-red-400 font-semibold mb-3">
        Category
      </h2>

      <div className="flex flex-col gap-2">
        {uniqueCateogry.map((item) => (
          <label
            key={item}
            className="
            flex
            items-center
            gap-3
            cursor-pointer
            hover:text-red-400
          "
          >
            <input
              type="checkbox"
              value={item}
              checked={category === item}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      <h2 className="text-red-400 font-semibold mt-6 mb-3">
        Brand
      </h2>

      <select
        value={brand}
        onChange={(e) =>
          setBrand(e.target.value)
        }
        className="
        w-full
        p-3
        rounded-xl
        bg-gray-800
        border
        border-gray-700
      "
      >
        {uniqueBrand.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>

      <h2 className="text-red-400 font-semibold mt-6 mb-3">
        Price Range
      </h2>

      <div>
        <p className="mb-2">
          ${price[0]} - ${price[1]}
        </p>

        <input
          className="w-full accent-red-500"
          type="range"
          min={0}
          max={5000}
          value={price[1]}
          onChange={(e) =>
            setPrice([
              price[0],
              Number(e.target.value),
            ])
          }
        />
      </div>

      <button
        onClick={handleReset}
        className="
        w-full
        mt-6
        py-3
        rounded-xl
        bg-linear-to-r
        from-red-500
        to-pink-500
        font-semibold
        hover:scale-105
        transition
      "
      >
        RESET
      </button>
    </div>
  );
};

export default ProductFilter;