"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Ratings from "../ratings";
import {
  MapPin,
  MessageCircleIcon,
  X,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ProductDetailsCard = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

  return (
    <div
      className="fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#0000001d] z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[90%] md:w-[70%] md:mt-14 2xl:mt-0 h-max overflow-y-auto max-h-[90vh] min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col md:flex-row gap-6">
          {/* Left: Image Gallery */}
          <div className="w-full h-full md:w-1/2">
            <Image
              src={data?.images?.[activeImage]?.url}
              alt={data?.images?.[activeImage]?.url || "product image"}
              width={400}
              height={400}
              className="w-full object-contain rounded-lg"
            />
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {data?.images?.map((img: any, index: number) => (
                <div
                  key={index}
                  className={`cursor-pointer border rounded-md ${
                    activeImage === index
                      ? "border-gray-500 scale-105"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={img?.url}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
            {/* Seller Info */}
            <div className="border-b relative pb-4 border-gray-200 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Image
                  src={
                    data?.shop?.avatar ||
                    "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg"
                  }
                  alt="shop logo"
                  width={60}
                  height={60}
                  className="rounded-full w-[60px] h-[60px] object-cover"
                />
                <div>
                  <Link
                    href={`/shop/${data?.shop?.id}`}
                    className="text-lg font-medium hover:underline"
                  >
                    {data?.shop?.name}
                  </Link>
                  <span className="block mt-2">
                    <Ratings ratings={data?.shop?.ratings} />
                  </span>
                  <p className="text-gray-600 mt-1 flex items-center gap-1">
                    <MapPin size={18} />
                    {data?.shop?.address || "Location not available"}
                  </p>
                </div>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
                onClick={() => router.push(`/inbox?shopId=${data?.shop?.id}`)}
              >
                <MessageCircleIcon size={18} /> Chat
              </button>
              <button className="absolute right-[-10px] top-[-10px] text-gray-600 hover:text-black">
                <X size={25} onClick={() => setOpen(false)} />
              </button>
            </div>

            {/* Product Details */}
            <h3 className="text-xl font-semibold mt-4">{data?.title}</h3>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap">
              {data?.short_description}
            </p>
            {data?.brand && (
              <p className="mt-2">
                <strong>Brand:</strong> {data.brand}
              </p>
            )}

            {/* Color & Size */}
            <div className="flex flex-col md:flex-row gap-6 mt-6">
              {data?.colors?.length > 0 && (
                <div>
                  <strong>Color:</strong>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {data.colors.map((color: string, index: number) => (
                      <button
                        key={index}
                        className={`w-8 h-8 rounded-full border transition-transform duration-200 ${
                          selectedColor === color
                            ? "border-gray-500 scale-110 shadow"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {data?.sizes?.length > 0 && (
                <div>
                  <strong>Size:</strong>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {data.sizes.map((size: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 rounded border text-sm font-medium transition-all duration-200 ${
                          selectedSize === size
                            ? "border-gray-500 bg-gray-100"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mt-6 flex items-center gap-4">
              <h3 className="text-2xl font-semibold text-gray-900">
                ${data?.sale_price}
              </h3>
              {data?.regular_price && (
                <h3 className="text-lg text-red-600 line-through">
                  ${data.regular_price}
                </h3>
              )}
            </div>

            {/* Quantity + Cart + Wishlist */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center gap-2">
                <strong>Qty:</strong>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-base font-medium">
                    {quantity}
                  </span>
                  <button
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button className="flex items-center gap-2 px-4 py-2 bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-lg transition">
                <ShoppingCart size={18} /> Add to Cart
              </button>

              {/* Wishlist */}
              <button className="opacity-[0.7] cursor-pointer">
                <Heart size={30} fill="red" color="transparent" />
              </button>
            </div>

            {/* Stock Info */}
            <div className="mt-2">
              {data.stock > 0 ? (
                <span className="text-green-600 font-semibold">In Stock</span>
              ) : (
                <span className="text-red-600 font-semibold">
                  Out of Stock
                </span>
              )}
            </div>
            <div className="mt-3 text-gray-600 text-sm">
              Estimated Delivery{" "}
              <strong>{estimatedDelivery.toDateString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
