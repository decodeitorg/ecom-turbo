import React from "react";
import { putData } from "@/hooks/hook";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useCallback } from "react";

const statusColors = {
    upcoming: "text-yellow-700 bg-yellow-200",
    inStock: "text-green-700 bg-green-200",
    outOfStock: "text-red-700 bg-red-200",
};

const items = Object.keys(statusColors);

interface IProps {
    cell: string;
    variantId?: string;
    productID: string;
    className?: string;
}

export default function UpdateStatus({
    cell,
    variantId,
    productID,
    className,
}: IProps) {
    const [value, setValue] = useState(cell);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = useCallback(
        async (newValue: string) => {
            const payload: any = {
                _id: productID,
                status: newValue,
            };

            if (variantId) {
                payload.variantId = variantId;
            }

            const endpoint = variantId
                ? "/api/admin/products/product/variant"
                : "/api/admin/products/product";

            const res = await putData(endpoint, payload);
            if (!res.error) {
                setValue(newValue);
            }
            setIsOpen(false);
        },
        [productID, variantId]
    );

    return (
        <div className="flex cursor-pointer flex-col">
            <Select
                value={value}
                onValueChange={handleSubmit}
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <SelectTrigger
                    className={`${statusColors[value as keyof typeof statusColors]} ${className}`}
                >
                    <SelectValue placeholder="Select status">
                        {value || "Select status"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {items.map((item) => (
                        <SelectItem key={item} value={item}>
                            <div
                                className={`rounded-md p-1 ${statusColors[item as keyof typeof statusColors]}`}
                            >
                                {item}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
