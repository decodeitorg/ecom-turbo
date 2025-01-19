import { useLState } from "@/hooks/hook";
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function FilterByPaymentMethod({ getOrders }) {
  const [paymentMethod, setPaymentMethod] = useLState("orderPaymentMethod", "");

  useEffect(() => {
    if (paymentMethod) {
      getOrders({ paymentMethod });
    }
  }, [paymentMethod, getOrders]);

  const handleReset = () => {
    setPaymentMethod("");
    getOrders({ paymentMethod: "" });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Filter By Payment Method
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-sm text-gray-600"
        >
          Reset
        </Button>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="flex space-x-4"
        >
          {["storePickup", "cashOnDelivery", "onlinePayment"].map((method) => (
            <div key={method} className="flex items-center space-x-2">
              <RadioGroupItem value={method} id={method} />
              <Label htmlFor={method} className="capitalize">
                {method.replace(/([A-Z])/g, " $1").trim()}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
