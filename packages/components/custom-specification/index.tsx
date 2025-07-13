import { Controller, useFieldArray } from "react-hook-form";
import Input from "../input";
import { PlusCircle, Trash2 } from "lucide-react";

const CustomSpecifications = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_specifications",
  });

  return (
    <div>
      <label htmlFor="" className="block font-semibold text-gray-300 mb-1">
        Custom Specifications
      </label>
      <div className="flex flex-col gap-3">
        {fields?.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Controller
              name={`custom_specifications.${index}.name`}
              control={control}
              rules={{ required: "Specification name is required" }}
              render={({ field }) => (
                <Input
                  label="Specifications Name"
                  placeholder="e.g., Battery Life, Weight, Material"
                  {...field}
                />
              )}
            />
            <Controller
              name={`custom_specifications.${index}.value`}
              control={control}
              rules={{ required: "Value is required" }}
              render={({ field }) => (
                <Input
                  label="Value"
                  placeholder="e.g., 4000mAg, 2.5kg, Plastic"
                  {...field}
                />
              )}
            />
            <button 
            onClick={() => remove(index)}
            className="text-red-500 hover:text-red-700"
            type="button">
                <Trash2 size={20} />
            </button>
          </div>
        ))}
        <button
        onClick={() => append({name: "", value: ""})}
        className="flex items-center gap-2 text-blue-500 hove:text-blue-600"
        >
            <PlusCircle size={20} /> Add Specification
        </button>
      </div>
      {errors.custom_specifications && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.custom_specifications.message as string}
                </p>
              )}
    </div>
  );
};

export default CustomSpecifications;
