import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; 
import { GlobalContext } from "../context/GlobalContext";

export default function HomeScreen() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("Best Sellers");
  const { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Network response was not ok");
        const json = await response.json();
        dispatch({ type: 'SET_PRODUCTS', payload: json });
      } catch (error) {
        console.error("Failed to fetch products: ", error);
      }
    };

    fetchProducts(); // Call the function here
  }, [dispatch]);

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 pl-10 border rounded-md focus:border-2 focus:border-primary-dark focus:outline-none"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>
      {/* Button Group */}
      <div className="flex justify-between border-b-2 border-b-secondary-light-gray text-sm sm:text-xl">
        {["Best Sellers", "Just Arrived", "Trending"].map((label) => (
          <button
            key={label}
            className={`sm:py-2 sm:px-4 ${
              activeButton === label ? "border-b-4 border-b-primary-dark" : "text-secondary-middle-gray"
            }`}
            onClick={() => setActiveButton(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2">
        {state.products.length === 0 ? (
          <p>No items...</p>
        ) : (
          state.products.map((product, index) => (
            <div
              key={product._id} // Use product ID as key
              className={`py-10 cursor-pointer border-b border-gray-300 ${
                index % 2 === 0 ? "border-r border-gray-300" : ""
              }`}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="ml-5">
                <p className="text-lg sm:text-2xl font-light">{product.name}</p>
                <p className="text-md sm:text-lg text-secondary-gray font-semibold">
                  ${product.price}
                </p>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`/assets/${product.images[0]}`}
                    alt={product.name}
                    className="h-28 sm:h-48 object-contain my-2 sm:w-fit"
                  />
                ) : (
                  <p>No image available</p> // Fallback if no images exist
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
