import Orders from "@/components/order/Main.tsx";
import { useFetchData } from "@/hooks/hook";
import {
  $dashboardData,
  $endDate,
  $startDate,
  refetchDashboardData,
} from "@/store/dashBoard";
import { useStore } from "@nanostores/react";
import React, { useEffect } from "react";
import { CartItemsType } from "@/lib/types";
import { useParams, Link } from "react-router-dom";
import Breadcamb from "../layout/Breadcamb";

type OrderStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "onDelivery"
  | "cancelled"
  | undefined;

export default function Order() {
  const { orderStatus } = useParams<{ orderStatus: OrderStatus }>();
  const dashboardData = useStore($dashboardData);
  const dashboardOrderCount = dashboardData?.dashboardOrderCount;

  let startDate = useStore($startDate);
  let endDate = useStore($endDate);

  let [orders, getOrders, setOrders, loading] = useFetchData(
    "/api/admin/orders",
    { orderStatus, startDate, endDate }
  ) as [CartItemsType[], Function, Function, boolean, any, any];

  useEffect(() => {
    getOrders({ startDate, endDate, orderStatus });
  }, [startDate, endDate, orderStatus]);

  const refetchOrdersWithDashboardData = (props) => {
    refetchDashboardData();
    getOrders(props);
  };

  return (
    <div>
      <Breadcamb
        items={[
          { label: "Orders", path: "/admin/orders" },
          ...(orderStatus
            ? [
                {
                  label:
                    orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1),
                },
              ]
            : []),
        ]}
      />
      <div className="sticky top-0 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border bg-background p-2">
        <Link
          className={`${orderStatus === undefined ? "text-blue-500" : ""}`}
          to="/admin/orders"
        >
          All({dashboardOrderCount?.totalOrders?.count || 0})
        </Link>
        <Link
          className={`${orderStatus === "pending" ? "text-blue-500" : ""}`}
          to="/admin/orders/pending"
        >
          Pending({dashboardOrderCount?.pending?.count || 0})
        </Link>
        <Link
          className={`${orderStatus === "processing" ? "text-blue-500" : ""}`}
          to="/admin/orders/processing"
        >
          Processing({dashboardOrderCount?.processing?.count || 0})
        </Link>
        <Link
          className={`${orderStatus === "onDelivery" ? "text-blue-500" : ""}`}
          to="/admin/orders/onDelivery"
        >
          On Delivery({dashboardOrderCount?.onDelivery?.count || 0})
        </Link>
        <Link
          className={`${orderStatus === "delivered" ? "text-blue-500" : ""}`}
          to="/admin/orders/delivered"
        >
          Delivered({dashboardOrderCount?.delivered?.count || 0})
        </Link>
        <Link
          className={`${orderStatus === "cancelled" ? "text-blue-500" : ""}`}
          to="/admin/orders/cancelled"
        >
          Cancelled({dashboardOrderCount?.cancelled?.count || 0})
        </Link>
      </div>
      <Orders getOrders={refetchOrdersWithDashboardData} orders={orders} />
    </div>
  );
}
