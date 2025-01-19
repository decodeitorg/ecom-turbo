import { useLState } from "@/hooks/hook";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label";

export default function ({ getOrders }) {
  let [search, setSearch] = useLState("orderSearch", "_id");

  let handleSubmit = (e) => {
    e.preventDefault();
    let value = e.target[0].value;

    switch (search) {
      case "_id":
        let isIdValid = mongoose.Types.ObjectId.isValid(value);
        if (isIdValid) {
          getOrders({
            search,
            order_id: value,
          });
        } else {
          toast.success("Please enter a valid Order ID", {
            type: "error",
          });
        }
        break;
      case "customer_name":
        getOrders({
          search,
          customer_name: value,
        });
        break;
      case "customer_phone":
        getOrders({
          search,
          customer_phone: value,
        });
        break;
      case "customer_email":
        getOrders({
          search,
          customer_email: value,
        });
        break;
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex w-full justify-between">
            <h4>Filter By Search</h4>
            <button
              onClick={() => {
                setSearch("");
                getOrders({
                  search: "",
                });
              }}
              className="text-sm text-gray-600"
            >
              Reset
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <RadioGroup orientation="horizontal" value={search}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="_id">Order ID</RadioGroupItem>
              <Label htmlFor="_id">Order ID</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="customer_name">
                Customer Name
              </RadioGroupItem>
              <Label htmlFor="customer_name">Customer Name</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="customer_phone">
                Customer Phone
              </RadioGroupItem>
              <Label htmlFor="customer_phone">Customer Phone</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="customer_email">
                Customer Email
              </RadioGroupItem>
              <Label htmlFor="customer_email">Customer Email</Label>
            </div>
          </RadioGroup>
          <br />
          <form className="flex justify-between gap-2" onSubmit={handleSubmit}>
            <Input placeholder="Search by Product ID" />
            <Button color="primary" variant="bordered" type="submit">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
