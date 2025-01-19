import { useLState } from "@/hooks/hook";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function FilterByOrderStatus({ getOrders }) {
  let [orderStatus, setOrderStatus] = useLState("orderOrderStatus", "");

  useEffect(() => {
    switch (orderStatus) {
      case "Pending":
        getOrders({
          orderStatus: "Pending",
        });
        break;

      case "Processing":
        getOrders({
          orderStatus: "Processing",
        });

        break;

      case "Delivered":
        getOrders({
          orderStatus: "Delivered",
        });
        break;
      case "Cancel":
        getOrders({
          orderStatus: "Cancel",
        });
        break;
    }
  }, [orderStatus]);

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex w-full justify-between">
            <h4>Filter By Order Status</h4>
            <button
              onClick={() => {
                setOrderStatus("");
                getOrders({
                  orderStatus: "",
                });
              }}
              className="text-sm text-gray-600"
            >
              Reset
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue={orderStatus}
            onValueChange={setOrderStatus}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Pending" id="Pending" />
              <Label htmlFor="Pending">Pending</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Processing" id="Processing" />
              <Label htmlFor="Processing">Processing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Delivered" id="Delivered" />
              <Label htmlFor="Delivered">Delivered</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Cancel" id="Cancel" />
              <Label htmlFor="Cancel">Cancel</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
