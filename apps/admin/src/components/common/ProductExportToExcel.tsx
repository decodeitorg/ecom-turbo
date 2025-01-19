import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "@nanostores/react";
import { $siteSettingData } from "@/store/frontend";
import { getApiUrl } from "@/lib/utils";

//id	title	description	availability	condition	price	link	image_link	brand

interface ExcelExportButtonProps {
    data: any[];
}

const ProductExcelExportButton: React.FC<ExcelExportButtonProps> = ({
    data,
}) => {
    const Frontend = useStore($siteSettingData);
    console.log("🚀 ~ Frontend:", Frontend);
    const [selectedData, setSelectedData] = useState([]);

    useEffect(() => {
        let selectedRows = data?.map((row) => {
            return {
                id: row?.slug,
                title: row?.name,
                description: row?.shortDescription || "",
                availability: "in stock",
                condition: "new",
                sale_price: row?.hasVariants
                    ? row?.variants[0]?.salePrice
                    : row?.salePrice,
                price: row?.hasVariants ? row?.variants[0]?.price : row?.price,
                link: getApiUrl() + "/product/" + row?.slug,
                image_link: row?.hasVariants
                    ? row?.variants[0]?.images[0]
                    : row?.images[0],
                brand: Frontend?.name,
            };
        });
        setSelectedData(selectedRows);
    }, [data]);

    const exportToExcel = useCallback(() => {
        const worksheet = XLSX.utils.json_to_sheet(selectedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
        XLSX.writeFile(workbook, "products_export.xlsx");
    }, [selectedData]);

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <Button>Export to Excel</Button>
                </DialogTrigger>
                <DialogContent className="max-w-[1024px]">
                    <DialogHeader>
                        <DialogTitle>Export to Excel</DialogTitle>
                        <DialogDescription>
                            Export your Product list to Excel.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={exportToExcel}>Export to Excel</Button>
                    <div className="mt-4 max-h-[60vh] overflow-auto">
                        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    {Object.keys(selectedData?.[0] || {}).map(
                                        (key) => (
                                            <th
                                                key={key}
                                                className="border border-gray-300 p-2 text-left dark:border-gray-700"
                                            >
                                                {key}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {selectedData?.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="even:bg-gray-50 dark:even:bg-gray-800"
                                    >
                                        {Object.values(row).map(
                                            (value, cellIndex) => (
                                                <td
                                                    key={cellIndex}
                                                    className="border border-gray-300 p-2 dark:border-gray-700"
                                                >
                                                    {typeof value === "object"
                                                        ? JSON.stringify(value)
                                                        : String(value)}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>{" "}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductExcelExportButton;
