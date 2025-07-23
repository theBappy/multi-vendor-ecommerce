import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

interface ShopCardProps {
  shop: {
    id: string;
    name: string;
    description?: string;
    avatar: string;
    coverBanner?: string;
    address?: string;
    followers?: [];
    rating?: number;
    category?: string;
  };
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  return (
    <div className="w-full rounded-md cursor-pointer bg-white border border-gray-200 shadow-sm overflow-hidden transition">
      {/* Cover banner */}
      <div className="h-[120px] w-full relative">
        <Image
          src={shop?.coverBanner || "/shop-banner.jpg"}
          alt={shop?.name + " banner" || "banner"}
          fill
          className="object-cover w-full h-full"
        />
      </div>

      {/* Avatar */}
      <div className="relative flex justify-center -mt-8">
        <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow bg-white relative">
          <Image
            src={shop?.avatar || "/shop-avatar.jpg"}
            alt={shop?.name + " avatar" || "avatar"}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* shop info */}
      <div className="px-4 pb-4 pt-2 text-center">
        <h3 className="text-base font-semibold text-gray-800">{shop?.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {shop?.followers?.length ?? 0} Followers
        </p>
        {/* shop address and rating */}
        <div className="flex  items-center justify-center text-xs text-gray-500 mt-2">
          {shop?.address && (
            <span className="flex items-center gap-1 max-w-[120px]">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="truncate">{shop?.address}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{" "}
            {shop?.rating ?? "N/A"}
          </span>
        </div>
        {/* category */}
        {shop?.category && (
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
            <span className="bg-blue-50 capitalize text-blue-600 px-2 py-0.5 rounded-full font-medium">
              {shop?.category}
            </span>
          </div>
        )}
        {/* visit button */}
        <div className="mt-4">
          <Link
            href={`/shop/${shop.id}`}
            className="inline-flex items-center text-sm text-blue-600 font-medium hover:underline hover:text-blue-700 transtion"
          >
            Visit Shop
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
