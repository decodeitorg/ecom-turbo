import { putData } from "@/hooks/hook";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";

export default function UpdateProductVariant({
  cell,
  variantId,
  needToUpdate,
  productID,
  className,
}) {
  let [value, setValue] = useState(cell);
  let [isFocused, setIsFocused] = useState(false);
  let handleSubmit = async (e) => {
    let valueNumber = Number(value);
    if (isNaN(valueNumber)) {
      toast("Please enter a valid number", { type: "error" });
      return;
    }
    if (valueNumber < 0) {
      toast("Price cannot be less than 0", { type: "error" });
      return;
    }
    if (valueNumber === cell) {
      toast("Price is already set", { type: "error" });
      return;
    }
    let payload = {
      _id: productID,
      variantId: variantId,
    };
    payload[needToUpdate] = valueNumber;
    let res = await putData(`/api/admin/products/product/variant`, payload);
    setIsFocused(false);
  };
  return (
    <div className="flex items-center justify-start gap-1">
      <input
        value={value}
        onFocus={() => setIsFocused(true)}
        onChange={(e) => setValue(e.target.value)}
        className={` ${className} text-center ${isFocused ? "relative z-50 w-20 rounded-md outline-none ring-2 ring-primary" : ""}`}
      />

      {isFocused && (
        <div className="relative z-50">
          <button
            type="submit"
            onClick={handleSubmit}
            className="rounded-full border border-green-700 p-1 text-white"
          >
            <TiTick className="bg-white fill-green-500 text-lg" />
          </button>

          <button
            onClick={() => {
              setValue(cell);
              setIsFocused(false);
            }}
            className="rounded-full border border-red-700 p-1 text-lg text-white"
          >
            <ImCross className="fill-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
