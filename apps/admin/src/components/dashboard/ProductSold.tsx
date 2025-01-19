import { Card, CardContent } from "@/components/ui/card";
import React from "react";

type PerProductSoldType = {
  name: string;
  totalPurchased: number;
  image: string;
  totalSalePrice: number;
};

export default function ProductSold({
  PerProductSold,
}: {
  PerProductSold: PerProductSoldType[];
}) {
  return (
    <Card className="h-full overflow-y-auto">
      <CardContent className="">
        <div className="grid grid-cols-12 items-center gap-2 rounded-lg text-start font-semibold">
          <div className="col-span-3">Logo</div>
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Purchased</div>
          <div className="col-span-2">Price</div>
        </div>
        <br />
        {PerProductSold.map((product) => (
          <div className="hover:bg-content2 grid grid-cols-12 items-center gap-2 rounded-lg p-1">
            <div className="col-span-3">
              <img
                src={product.image}
                alt="product"
                className="h-full w-full rounded-lg"
              />
            </div>
            <div className="col-span-5">{product?.name}</div>
            <div className="col-span-2">{product?.totalPurchased}</div>
            <div className="col-span-2">{product?.totalSalePrice}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
