"use client";

import {
  AlignLeft,
  ChevronDown,
  ChevronRight,
  HeartIcon,
  ShoppingCart,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavItems } from "../../configs/constants";
import Link from "next/link";
import useUser from "../../hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../../store";
import axiosInstance from "../../utils/axiosInstance";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, isLoading } = useUser();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const wishlist = useStore((state: any) => state.wishlist);
  const cart = useStore((state: any) => state.cart);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-categories");
      return res.data.categories;
    },
  });

  // Handle sticky scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"
      }`}
    >
      <div
        className={`w-[80%] relative m-auto flex items-center justify-between ${
          isSticky ? "pt-3" : "py-0"
        }`}
      >
        {/* All Departments dropdown button */}
        <div
          className={`w-[260px] ${
            isSticky && "-mb-2"
          } cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489ff]`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="white" />
            <span className="text-white font-medium">All Departments</span>
          </div>
          <ChevronDown color="white" />
        </div>

        {/* Dropdown category menu */}
        {show && (
          <div
            className={`absolute left-0 ${
              isSticky ? "top-[70px]" : "top-[50px]"
            } w-[260px] z-100 max-h-[400px] bg-[#f5f5f5] overflow-y-auto shadow-md text-black`}
          >
            {categoriesData?.map((category: any, index:number) => (
              <div
                key={index}
                className="group relative text-black px-5 py-3 hover:bg-[#e4e4e4] cursor-pointer"
                onMouseEnter={() => setExpandedCategory(category.name)}
                onMouseLeave={() => setExpandedCategory(null)}
              >
                <div className="flex justify-between items-center text-black">
                  <span className="text-black">{category.name}</span>
                  {category.subCategories?.length > 0 && (
                    <ChevronRight size={18} />
                  )}
                </div>
                {/* Subcategories */}
                {expandedCategory === category.name &&
                  category.subCategories?.length > 0 && (
                    <div className="absolute top-0 left-[260px] w-[200px] bg-white text-black shadow-md z-50">
                      {category.subCategories.map((sub: string, i: number) => (
                        <Link
                          key={i}
                          href={`/products?category=${category.name}&sub=${sub}`}
                          className="block text-black px-4 py-2 hover:bg-gray-100"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* Main navigation links */}
        <div className="flex items-center">
          {NavItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="px-5 font-medium text-lg"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Sticky profile and icons */}
        <div>
          {isSticky && (
            <div className="flex items-center gap-8">
              {/* Profile/Login */}
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

              {/* Wishlist and Cart */}
              <div className="flex items-center gap-5">
                <Link href={"/wishlist"} className="relative">
                  <HeartIcon />
                  <div className="w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                    <span className="text-white font-medium text-sm">
                      {wishlist?.length || 0}
                    </span>
                  </div>
                </Link>
                <Link href={"/cart"} className="relative">
                  <ShoppingCart />
                  <div className="w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                    <span className="text-white font-medium text-sm">
                      {cart?.length || 0}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
