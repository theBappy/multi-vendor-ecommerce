"use client";

import Link from "next/link";
import { Search, User, HeartIcon, ShoppingCart } from "lucide-react";
import HeaderBottom from "./header-bottom";
import useUser from "../../hooks/useUser";
import { useStore } from "../../store";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Header = () => {
  const { user, isLoading } = useUser();
  const wishlist = useStore((state: any) => state.wishlist);
  const cart = useStore((state: any) => state.cart);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleSearchClick = async () => {
    if (!searchQuery.trim()) return;

    setLoadingSuggestions(true);
    try {
      const res = await axiosInstance.get(
        `/product/api/search-products?q=${encodeURIComponent(searchQuery)}`
      );
      setSuggestions(res.data.products.slice(0, 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="w-full bg-white relative z-50">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link href="/">
            <span className="text-2xl font-[500]">E-shop</span>
          </Link>
        </div>

        {/* Search Input */}
        <div className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 font-poppins font-medium border-[2.5px] border-[#3489ff] outline-none h-[55px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div
            onClick={handleSearchClick}
            className="w-[60px] cursor-pointer flex items-center justify-center h-[55px] absolute top-0 right-0 bg-[#3489ff]"
          >
            <Search color="#fff" />
          </div>

          {/* Suggestion Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute w-full top-[60px] bg-white border border-gray-300 shadow z-50">
              {suggestions.map((item) => (
                <Link
                  href={`/product/${item.slug}`}
                  key={item.id}
                  onClick={() => {
                    setSuggestions([]);
                    setSearchQuery("");
                  }}
                  className="block px-4 py-2 text-sm hover:bg-blue-100"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
          {loadingSuggestions && (
            <div className="absolute w-full top-[60px] bg-white border-gray-200 shadow-md">
              Searching...
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-8">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Link
              href={user ? "/profile" : "/login"}
              className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
            >
              <User size={22} />
            </Link>
            <div className="leading-4">
              <span className="block text-sm font-medium">Hello,</span>
              <span className="text-sm font-semibold">
                {isLoading
                  ? "..."
                  : user
                  ? user.name?.split(" ")[0]
                  : "Sign In"}
              </span>
            </div>
          </div>

          {/* Wishlist & Cart */}
          <div className="flex items-center gap-5">
            <Link href="/wishlist" className="relative">
              <HeartIcon />
              {wishlist?.length > 0 && (
                <div className="w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                  <span className="text-white font-medium text-sm">
                    {wishlist.length}
                  </span>
                </div>
              )}
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart />
              {cart?.length > 0 && (
                <div className="w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                  <span className="text-white font-medium text-sm">
                    {cart.length}
                  </span>
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Divider + Bottom Header */}
      <div className="border-b border-b-[#99999938]" />
      <HeaderBottom />
    </div>
  );
};

export default Header;
