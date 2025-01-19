import Table from "@/components/common/Table.tsx";
import { postData, putData, useFetchData } from "@/hooks/hook.ts";
import { steadfastStatus } from "@/lib/steadFastStatus.ts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { GiCash } from "react-icons/gi";
import { HiStatusOnline } from "react-icons/hi";

import FilterByOrderStatus from "./FilterByOrderStatus.tsx";
import FilterByPaymentMethod from "./FilterByPaymentMethod.tsx";
import FilterByPaymentStatus from "./FilterByPaymentStatus.tsx";
import FilterBySearch from "./FilterBySearch.tsx";
import { Button } from "@/components/ui/button.tsx";

import { CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { CartItemsType, OrderType } from "@/lib/types.ts";
import PaymentDetails from "@/components/common/PaymentDetails.tsx";
import { IoHomeOutline } from "react-icons/io5";
import { MdLocalShipping } from "react-icons/md";
import { useState } from "react";
import ExcelExportButton from "@/components/common/OrderExcelExportButton.tsx";
import { EditOrder } from "./EditOrder.tsx";

const statusColors = {
  pending: "text-gray-500",
  processing: "text-yellow-500",
  delivered: "text-green-500",
  cancelled: "text-red-500",
  onDelivery: "text-blue-500",
};

export default function Orders({ orders, getOrders }) {
  const [settingData] = useFetchData(`/api/superadmin/settings`);
  const [selectedRow, setSelectedRow] = useState<OrderType[]>([]);

  const [openEditOrder, setOpenEditOrder] = useState(false);
  const [editOrderId, setEditOrderId] = useState("");

  const handleValueChange = async (newStatus, row) => {
    await putData(`/api/admin/orders/${row._id}`, {
      status: newStatus,
    });
    getOrders();
  };

  return (
    <div className="">
      <CardTitle className="iems-center mt-2 flex justify-between">
        <div className="mt-1 text-2xl font-bold">Orders</div>
        <div className="flex items-center justify-end gap-2">
          <ExcelExportButton data={selectedRow} />
          <Dialog>
            <DialogTrigger>
              <Button>Filter Orders</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filter Orders</DialogTitle>
                <DialogDescription>
                  Apply filters to your orders list.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <FilterByPaymentStatus getOrders={getOrders} />
                <FilterByPaymentMethod getOrders={getOrders} />
                <FilterByOrderStatus getOrders={getOrders} />
                {/* <FilterByDate getOrders={getOrders} /> */}
                <FilterBySearch getOrders={getOrders} />
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline">Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardTitle>

      <div>
        <Table
          supportMobile={true}
          data={orders}
          bordered
          onReload={getOrders}
          loading={false}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          columns={[
            {
              name: "Items",
              uid: "cartItems",
              formatter: (cell: any) => {
                return (
                  <div className="min-w-72">
                    {cell?.map((item: CartItemsType, index: number) => {
                      return (
                        <div key={index} className="flex">
                          <a
                            href={`/product/${item.slug}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              loading="lazy"
                              src={item?.image ?? "/images/no-image.png"}
                              alt={item?.name}
                              width={150}
                              height={150}
                              className="aspect-video h-32 w-32 rounded-2xl p-2"
                            />
                          </a>

                          <div>
                            <h4 className="text-wrap text-lg font-semibold">
                              {item?.name}
                            </h4>
                            <p className="">Quantity: {item?.quantity}</p>
                            {item?.hasVariant && (
                              <p>Variants: {item?.nameOfVariant}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              },
            },
            {
              name: "Customer Info",
              uid: "userInfo",
              sortable: true,
              formatter: (cell, row: OrderType) => {
                return (
                  <div className="mb-2 flex w-full flex-col space-y-1 md:w-64">
                    <div className="mt-2 flex items-start justify-start gap-2 rounded-md">
                      <img
                        src={row?.userImage}
                        alt=""
                        className="h-12 w-12 rounded-full"
                      />
                      <div className="overflow-hidden">
                        <p className="truncate font-semibold">
                          {row?.userName}
                        </p>

                        <a
                          href={`tel:${row?.phoneNumber}`}
                          className="block truncate hover:underline"
                        >
                          {row?.phoneNumber}
                        </a>

                        <a
                          href={`mailto:${row?.userEmail}`}
                          className="block truncate hover:underline"
                        >
                          {row?.userEmail}
                        </a>
                      </div>
                    </div>

                    <div className="w-64">
                      <textarea
                        className="scrollbar-hide h-fit w-full overflow-y-auto rounded-md border p-2 dark:bg-slate-900"
                        value={row?.address}
                        style={{ resize: "vertical" }}
                      ></textarea>
                    </div>

                    {row?.fraudStatus &&
                    Object.keys(row.fraudStatus).length > 0 ? (
                      <div className="space-y-1 text-sm">
                        {Object.entries(row.fraudStatus).map(
                          ([courier, stats]: [string, any]) => (
                            <div
                              key={courier}
                              className="grid max-w-64 grid-cols-3"
                            >
                              <span className="capitalize">{courier}:</span>
                              {stats.error ? (
                                <span className="text-yellow-500">(Error)</span>
                              ) : (
                                <>
                                  <span className="text-end text-green-500">
                                    Received: {stats.received}
                                  </span>
                                  <span className="text-end text-red-500">
                                    Return: {stats.return}
                                  </span>
                                  {stats.error && (
                                    <span className="text-yellow-500">
                                      (Error)
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <Button
                        onClick={async () => {
                          await postData(`/api/admin/orders/check-fraud`, {
                            _id: row?._id,
                          });
                          getOrders();
                        }}
                        size="sm"
                        className="w-fit"
                        variant="outline"
                      >
                        Check Fraud
                      </Button>
                    )}
                  </div>
                );
              },
            },
            {
              name: "Order Details",
              uid: "createdAt",
              sortable: true,
              formatter: (cell: any, row: OrderType) => {
                let date = new Date(cell);
                return (
                  <div className="flex flex-col items-start justify-start gap-2">
                    <div>
                      Order Date :{" "}
                      {`Order Date : ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, "0")}${date.getHours() >= 12 ? "PM" : "AM"}`}
                    </div>
                    <div>Invoice : {row._id}</div>
                    <div className="flex items-center gap-2">
                      {row?.paymentMethod === "cashOnDelivery" ? (
                        <div className="flex items-center gap-1">
                          <GiCash className="h-6 w-6 fill-primary" />
                          <p>Cash On Delivery</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <HiStatusOnline className="fill-warning h-6 w-6" />
                          <p>Online Payment</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {row?.isHomeDeliverySelected ? (
                        <div className="flex items-center gap-1">
                          <IoHomeOutline className="h-6 w-6 fill-primary" />
                          <p>Home Delivery</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <MdLocalShipping className="h-6 w-6 fill-primary" />
                          <p>Courier Pickup</p>
                        </div>
                      )}
                    </div>
                    <div className="max-w-80">Note : {row?.note}</div>
                  </div>
                );
              },
            },
            ...(settingData?.steadFast?.isSteadfastEnabled
              ? [
                  {
                    name: "SteadFast",
                    uid: "steadFast",
                    formatter: (cell: any, row: OrderType) => {
                      if (cell?.consignment_id) {
                        return (
                          <div>
                            <div>
                              {cell?.consignment_id
                                ? "ID: " + cell?.consignment_id
                                : "N/A"}
                            </div>
                            <div>
                              {cell?.tracking_code
                                ? "Tracking ID: " + cell?.tracking_code
                                : "N/A"}
                            </div>
                            <div>{cell?.status ? cell?.status : "N/A"}</div>
                          </div>
                        );
                      } else {
                        return (
                          <>
                            <Button
                              onClick={async () => {
                                await postData(
                                  `/api/admin/courier/steadfast/create_order`,
                                  { order_id: row._id }
                                );
                                getOrders();
                              }}
                              color="warning"
                              className="mt-2"
                            >
                              Send to SteadFast
                            </Button>
                          </>
                        );
                      }
                    },
                  },
                ]
              : []),

            {
              name: "Amount",
              uid: "total",
              formatter: (cell: any, row: OrderType) => {
                return (
                  <PaymentDetails
                    total={row?.total}
                    selectedShippingLocationFee={{
                      location: row?.city,
                      fee: row?.shippingCost,
                    }}
                    inTotal={row?.inTotal}
                    takeShippingFeeAdvance={row?.takeShippingFeeAdvance}
                    paymentMethod={row?.paymentMethod}
                    shippingFeeAdvanceForCashOnDelivery={
                      row?.shippingFeeAdvanceForCashOnDelivery
                    }
                    isHomeDeliverySelected={row?.isHomeDeliverySelected}
                    totalPayableWhileDelivery={row?.totalPayableWhileDelivery}
                    totalExtraDeliveryCharge={row?.totalExtraDeliveryCharge}
                  />
                );
              },
            },

            {
              name: "Order Status",
              uid: "status",
              formatter: (cell: OrderType["status"], row: OrderType) => {
                let paymentStatus = row?.paymentStatus;
                let color =
                  paymentStatus === "success"
                    ? "text-green-500"
                    : paymentStatus === "failed"
                      ? "text-red-500"
                      : "text-yellow-500";

                return (
                  <div>
                    {row?.takeShippingFeeAdvance &&
                      row?.paymentMethod === "cashOnDelivery" && (
                        <p className="mb-2">
                          <span className={`${color}`}>
                            Payment {paymentStatus}
                          </span>
                        </p>
                      )}

                    {row?.paymentMethod === "onlinePayment" && (
                      <p className="mb-2">
                        <span className={`${color}`}>
                          Payment {paymentStatus}
                        </span>
                      </p>
                    )}

                    <Select
                      defaultValue={cell}
                      onValueChange={(value) => {
                        handleValueChange(value, row);
                      }}
                    >
                      <SelectTrigger
                        className={`w-32 ${statusColors[cell] || "text-gray-500"}`}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="onDelivery">On Delivery</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    {cell === "onDelivery" && (
                      <div>
                        <p>{row?.steadFast?.status}</p>
                        <p>{steadfastStatus[row?.steadFast?.status]}</p>
                      </div>
                    )}
                  </div>
                );
              },
            },
          ]}
          onEdit={(row) => {
            setEditOrderId(row._id);
            setOpenEditOrder(true);
          }}
        />
      </div>
      {editOrderId && (
        <EditOrder
          key={new Date().getTime().toString()}
          order_id={editOrderId}
          open={openEditOrder}
          setOpen={setOpenEditOrder}
          getOrders={getOrders}
        />
      )}
    </div>
  );
}
