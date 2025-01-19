import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderType } from "@/lib/types";
import * as XLSX from "xlsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ExcelExportButtonProps {
  data: OrderType[];
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({ data }) => {
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    let selectedRows = data.map((order) => {
      return {
        invoice: order._id,
        name: order.userName,
        address: order.address,
        phone: order.phoneNumber,
        inTotal: order.inTotal,
        items: order.cartItems.reduce((acc, item, index) => {
          return `${acc} ${index + 1}. ${item.name}- Quantity: ${item.quantity}- ${
            item?.hasVariant ? item?.nameOfVariant : ""
          };\n`;
        }, ""),
      };
    });
    setSelectedData(selectedRows);
  }, [data]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders_export.xlsx");
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
              Export your orders list to Excel.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={exportToExcel}>Export to Excel</Button>
          <div className="mt-4 max-h-[60vh] overflow-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(selectedData[0] || {}).map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 p-2 text-left"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedData.map((row, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    {Object.values(row).map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 p-2"
                      >
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </td>
                    ))}
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

export default ExcelExportButton;
