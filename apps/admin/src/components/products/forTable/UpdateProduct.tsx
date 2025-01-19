import { putData } from "@/hooks/hook";
import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";

import { toast } from "react-toastify";

export default function UpdateProduct({
    cell,
    needToUpdate,
    productID,
    className,
}) {
    let [value, setValue] = useState(cell);
    let [isFocused, setIsFocused] = useState(false);
    let handleSubmit = async (e) => {
        let valueNumber = Number(value);
        if (isNaN(valueNumber)) {
            toast.error("Please enter a valid number");
            return;
        }
        if (valueNumber < 0) {
            toast.error("Price cannot be less than 0");
            return;
        }
        if (valueNumber === cell) {
            toast.error("Price is already set", { type: "error" });
            return;
        }
        let payload = {
            _id: productID,
        };
        payload[needToUpdate] = valueNumber;
        await putData(`/api/admin/products/product`, payload);
        setIsFocused(false);
    };
    return (
        <div className="flex items-center gap-1">
            <input
                value={value}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setValue(e.target.value)}
                className={` ${className} text-center ${isFocused ? "w-20 rounded-md p-2 outline-none ring-2 ring-primary" : ""}`}
            />

            {isFocused && (
                <>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="rounded-full border border-green-700 p-1 text-white"
                    >
                        <TiTick className="fill-green-500 text-lg" />
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
                </>
            )}
        </div>
    );
}
