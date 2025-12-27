import { GetProductByHandleQuery } from "@/types/shopify-graphql";
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

type ProductOptionsProps = {
  options: NonNullable<GetProductByHandleQuery["product"]>["options"];
  variants: NonNullable<GetProductByHandleQuery["product"]>["variants"]["edges"];
  selectedOptions?: Record<string, string>;
  setSelectedOptions?: (options: Record<string, string>) => void;
};

const ProductOptions = ({
  options,
  variants,
  selectedOptions = {},
  setSelectedOptions,
}: ProductOptionsProps) => {
  const handleOptionChange = (optionName: string, value: string) => {
    const updatedOptions = {
      ...selectedOptions,
      [optionName]: value,
    };
    setSelectedOptions?.(updatedOptions);
  };

  const renderOptionUI = (
    option: NonNullable<GetProductByHandleQuery["product"]>["options"][0]
  ) => {
    return (
      <div className="flex flex-wrap gap-3">
        {option.optionValues.map((value) => {
          const isSelected = selectedOptions[option.name] === value.name;
          const isColor = option.name.toLowerCase().includes("color") ||
            option.name.toLowerCase().includes("colour");

          if (isColor) {
            // Find a variant that has this color to show its image
            const variantWithImage = variants.find(v =>
              v.node.selectedOptions.some(opt => opt.name === option.name && opt.value === value.name) &&
              (v.node as any).image?.url
            );

            return (
              <button
                key={value.id}
                onClick={() => handleOptionChange(option.name, value.name)}
                className={cn(
                  "relative w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center p-0.5 overflow-visible",
                  isSelected
                    ? "ring-2 ring-black bg-white"
                    : "border border-gray-100 hover:border-gray-300 bg-gray-50"
                )}
                title={value.name}
              >
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  {(variantWithImage?.node as any)?.image?.url ? (
                    <Image
                      src={(variantWithImage?.node as any).image.url}
                      alt={value.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: value.name.toLowerCase() }}
                    />
                  )}
                </div>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 bg-black text-white rounded-full p-0.5 border-2 border-white">
                    <Check className="w-2 h-2" strokeWidth={4} />
                  </div>
                )}
              </button>
            );
          }

          return (
            <button
              key={value.id}
              onClick={() => handleOptionChange(option.name, value.name)}
              className={cn(
                "flex items-center justify-center min-w-[50px] h-[40px] px-4 rounded-full border text-sm font-medium transition-all duration-300",
                isSelected
                  ? "border-black bg-white text-black shadow-sm"
                  : "border-gray-100 bg-gray-50/50 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {value.name}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {options.map((option) => (
        <div key={option.name} className="flex flex-col gap-3">
          <label className="text-sm font-bold text-gray-900">
            {option.name} <span className="text-gray-500 font-medium ml-1">{selectedOptions[option.name]}</span>
          </label>
          {renderOptionUI(option)}
        </div>
      ))}
    </div>
  );
};

export default ProductOptions;

