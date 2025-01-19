import { useLState } from "@/hooks/hook";

import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function FilterByPaymentStatus({ getOrders }) {
  let [paymentStatus, setPaymentStatus] = useLState("orderPaymentStatus", "");

  useEffect(() => {
    switch (paymentStatus) {
      case "Success":
        getOrders({
          paymentStatus: "Success",
        });
        break;

      case "Pending":
        getOrders({
          paymentStatus: "Pending",
        });

        break;

      case "Failed":
        getOrders({
          paymentStatus: "Failed",
        });
        break;
    }
  }, [paymentStatus]);

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex w-full justify-between">
            <h4>Filter By Payment Status</h4>
            <button
              onClick={() => {
                setPaymentStatus("");
                getOrders({
                  paymentStatus: "",
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
            value={paymentStatus}
            onValueChange={setPaymentStatus}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Success" id="Success" />
              <Label htmlFor="Success">Success</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Pending" id="Pending" />
              <Label htmlFor="Pending">Pending</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Failed" id="Failed" />
              <Label htmlFor="Failed">Failed</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
