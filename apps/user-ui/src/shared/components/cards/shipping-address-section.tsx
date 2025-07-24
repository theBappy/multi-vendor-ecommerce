"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";

import { countries } from "apps/user-ui/src/configs/countries";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";

type AddressFormData = {
  label: "Home" | "Work" | "Other";
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  isDefault: string; // will convert to boolean later
};

export const ShippingAddressSection = () => {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      label: "Home",
      name: "",
      street: "",
      city: "",
      zip: "",
      country: "Bangladesh",
      isDefault: "false",
    },
  });

  const { mutate: addAddress } = useMutation({
    mutationFn: async (payload: Omit<AddressFormData, "isDefault"> & { isDefault: boolean }) => {
      const res = await axiosInstance.post("/api/add-address", payload);
      return res.data.address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-addresses"] });
      reset();
      setShowModal(false);
    },
  });

  const onSubmit = (data: AddressFormData) => {
    addAddress({
      ...data,
      isDefault: data.isDefault === "true",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Saved Address</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {/* Address list (to be implemented later) */}
      <div>{/* Map addresses here */}</div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Address</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Label */}
              <select {...register("label")} className="form-input w-full">
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>

              {/* Name */}
              <input
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
                className="form-input w-full"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

              {/* Street */}
              <input
                placeholder="Street"
                {...register("street", { required: "Street is required" })}
                className="form-input w-full"
              />
              {errors.street && <p className="text-red-500 text-xs">{errors.street.message}</p>}

              {/* City */}
              <input
                placeholder="City"
                {...register("city", { required: "City is required" })}
                className="form-input w-full"
              />
              {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}

              {/* Zip */}
              <input
                placeholder="Zip Code"
                {...register("zip", { required: "Zip Code is required" })}
                className="form-input w-full"
              />
              {errors.zip && <p className="text-red-500 text-xs">{errors.zip.message}</p>}

              {/* Country */}
              <select {...register("country")} className="form-input w-full">
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              {/* Default Address */}
              <select {...register("isDefault")} className="form-input w-full">
                <option value="true">Set as Default</option>
                <option value="false">Not Default</option>
              </select>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
