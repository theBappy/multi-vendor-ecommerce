"use client";
import {
  AlignLeft,
  ChevronDown,
  HeartIcon,
  ShoppingCart,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavItems } from "../../configs/constants";
import Link from "next/link";
import useUser from "../../hooks/useUser";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, isLoading } = useUser();

  //track the scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
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
        {/* all dropdown */}
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
        {/* dropdown menu */}
        {show && (
          <div
            className={`absolute left-0 ${
              isSticky ? "top-[70px]" : "top-[50px]"
            } w-[260px] h-[400px] bg-[#f5f5f5]`}
          ></div>
        )}
        {/* navigation link */}
        <div className="flex items-center">
          {NavItems.map((item: NavItemsTypes, index: number) => (
            <Link
              key={item.title}
              href={item.href}
              className="px-5 font-medium text-lg"
            ></Link>
          ))}
        </div>
        <div>
          {isSticky && (
            <div className="flex items-center gap-8">
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

              <div className="flex items-center gap-5">
                <Link href={"/wishlist"} className="relative">
                  <HeartIcon />
                  <div className="w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                    <span className="text-white font-medium text-sm">0</span>
                  </div>
                </Link>
                <Link href={"/cart"} className="relative">
                  <ShoppingCart />
                  <div className="w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]">
                    <span className="text-white font-medium text-sm">0</span>
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
