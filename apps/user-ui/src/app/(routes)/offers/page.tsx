"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Range } from "react-range";
import ProductCard from "apps/user-ui/src/shared/product-card";

const MIN = 0;
const MAX = 1199;

const Page = () => {
  const router = useRouter();
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([MIN, MAX]);
  const [tempPriceRange, setTempPriceRange] = useState([MIN, MAX]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const colors = [
    { name: "Red Orange", code: "#FF5733" },
    { name: "Sky Blue", code: "#33B5FF" },
    { name: "Green", code: "#28A745" },
    { name: "Amber", code: "#FFC107" },
    { name: "Purple", code: "#8E44AD" },
    { name: "Pink", code: "#E91E63" },
    { name: "Cyan", code: "#00BCD4" },
    { name: "Red", code: "#F44336" },
    { name: "Lime Green", code: "#4CAF50" },
    { name: "Violet", code: "#9C27B0" },
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // State for categories and subcategories fetched from API
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<Record<string, string[]>>([]);

  // Fetch categories & subCategories once on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axiosInstance.get("/product/api/get-categories");
        setCategories(res.data.categories || []);
        setSubCategories(res.data.subCategories || {});
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    }
    fetchCategories();
  }, []);

  const updateURL = () => {
    const params = new URLSearchParams();
    params.set("priceRange", priceRange.join(","));
    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (selectedColors.length > 0)
      params.set("colors", selectedColors.join(","));
    if (selectedSizes.length > 0) params.set("sizes", selectedSizes.join(","));
    params.set("page", page.toString());
    router.replace(`/offers?${decodeURIComponent(params.toString())}`);
  };

  const fetchFilteredProducts = async () => {
    setIsProductLoading(true);
    try {
      const query = new URLSearchParams();
      query.set("priceRange", priceRange.join(","));
      if (selectedCategories.length > 0)
        query.set("categories", selectedCategories.join(","));
      if (selectedColors.length > 0)
        query.set("colors", selectedColors.join(","));
      if (selectedSizes.length > 0) query.set("sizes", selectedSizes.join(","));
      query.set("page", page.toString());
      query.set("limit", "12");
      const res = await axiosInstance.get(
        `/product/api/get-filtered-offers?${query.toString()}`
      );
      setProducts(res.data.products);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch filtered products", error);
    } finally {
      setIsProductLoading(false);
    }
  };

  useEffect(() => {
    updateURL();
    fetchFilteredProducts();
  }, [priceRange, selectedCategories, selectedColors, selectedSizes, page]);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label)
        ? prev.filter((cat) => cat !== label)
        : [...prev, label]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="w-full bg-[#f5f5f5] pb-10">
      <div className="w-[90%] lg:w-[80%] m-auto">
        <div className="pb-[50px]">
          <h1 className="md:pt-[40px] font-medium text-[44px] leading-1 mb-[14px] font-Poppins">
            All Offers
          </h1>
          <Link href="/" className="text-[#55585b]">
            Home
          </Link>
          <span className="inline-block p-[1.5px] bg-[#a8acb0] rounded-full mx-1"></span>
          <span className="text-[#55585b]">All Products</span>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[270px] !rounded bg-white p-4 space-y-6 shadow-md">
            {/* Price Filter */}
            <h3 className="text-xl font-Poppins font-medium">Price Filter</h3>
            <div className="ml-2">
              <Range
                step={1}
                min={MIN}
                max={MAX}
                values={tempPriceRange}
                onChange={(values) => setTempPriceRange(values)}
                onFinalChange={(values) => setPriceRange(values)}
                renderTrack={({ props, children }) => {
                  const [min, max] = tempPriceRange;
                  const left = ((min - MIN) / (MAX - MIN)) * 100;
                  const right = ((max - MIN) / (MAX - MIN)) * 100;

                  return (
                    <div
                      {...props}
                      className="h-[6px] bg-blue-200 rounded relative"
                    >
                      <div
                        className="absolute h-full bg-blue-600 rounded"
                        style={{
                          left: `${left}%`,
                          width: `${right - left}%`,
                        }}
                      />
                      {children}
                    </div>
                  );
                }}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-[16px] h-[16px] bg-blue-600 rounded-full shadow"
                  />
                )}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <div>
                  <span>${tempPriceRange[0]}</span>-
                  <span>${tempPriceRange[1]}</span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setPriceRange(tempPriceRange);
                      setPage(1);
                    }}
                    className="text-sm px-4 py-1 bg-gray-200 hover:bg-blue-500 hover:text-white transition !rounded"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Categories */}
            <h3 className="pb-1 border-b-slate-300 border-b font-medium font-Poppins text-xl">
              Categories
            </h3>
            <ul className="space-y-2 !mt-3">
              {categories.length === 0 ? (
                <p>Loading categories...</p>
              ) : (
                categories.map((category) => (
                  <li
                    key={category}
                    className="justify-between items-center flex"
                  >
                    <label className="flex items-center gap-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="accent-blue-600"
                      />
                      {category}
                    </label>
                  </li>
                ))
              )}
            </ul>

            {/* Colors */}
            <h3 className="pb-1 border-b-slate-300 border-b font-medium font-Poppins text-xl mt-6">
              Filter by Color
            </h3>
            <ul className="space-y-2 mt-3">
              {colors.map((color) => (
                <li
                  key={color.name}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.name)}
                    onChange={() => toggleColor(color.name)}
                    className="accent-blue-600"
                  />

                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.code }}
                    />
                    <span>{color.name}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Sizes */}
            <h3 className="pb-1 border-b-slate-300 border-b font-medium font-Poppins text-xl mt-6">
              Filter by Size
            </h3>
            <ul className="space-y-2 !mt-3">
              {sizes.map((size) => (
                <li key={size} className="justify-between items-center flex">
                  <label className="flex items-center gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="accent-blue-600"
                    />
                    <span className="font-medium">{size}</span>
                  </label>
                </li>
              ))}
            </ul>
          </aside>
          {/* product grid */}
          <div className="flex-1 px-2 lg:px-3">
            {isProductLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                    {Array.from({length: 10}).map((_, index) => (
                        <div 
                        className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
                        key={index}>
                        </div>
                    ))}
                </div>
            ): products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} isEvent={true} />
                    ))}
                </div>
            ) : (
                <p className="">No products found!</p>
            )}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    {Array.from({length: totalPages}).map((_,i) => (
                        <button
                        key={i}
                        onClick={() => setPage(i +1)}
                        className={`px-3 py-1 !rounded border border-gray-200 text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white text-black"}`}
                        >
                            {i+1}
                        </button>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
