import { $SettingData, $SettingDataLoading } from "@/store/settings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { putData, useFetchData, useLState } from "@/hooks/hook";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { FaPhoneAlt, FaUser } from "react-icons/fa";

export function EditOrder({
  order_id,
  open,
  setOpen,
  getOrders,
}: {
  order_id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  getOrders: () => void;
}) {
  const [selectedShippingLocationFee, setSelectedShippingLocationFee] =
    useState();
  const [order, gerOrder, setOrder, loading] = useFetchData(
    `/api/admin/orders/order`,
    {
      order_id,
    }
  );

  const settingData = useStore($SettingData);
  console.log("🚀 ~ settingData:", order);
  const settingDataLoading = useStore($SettingDataLoading);

  useEffect(() => {
    if (settingData && order && !settingDataLoading && !loading) {
      setSelectedShippingLocationFee(order?.shippingLocation);
    }
  }, [settingData, order, settingDataLoading, loading]);

  function changeItemQuantity(index: number, quantity: number) {
    if (quantity < 1) {
      quantity = 1;
    }
    let cartItems = [...order?.cartItems];
    cartItems[index].quantity = quantity;
    let total = cartItems.reduce(
      (total, item) => total + item.salePrice * item?.quantity,
      0
    );

    let inTotal =
      total +
      order?.shippingCost +
      (order?.isHomeDeliverySelected ? order?.totalExtraDeliveryCharge : 0);
    setOrder({ ...order, cartItems, total, inTotal });
  }

  function changeItemPrice(index: number, price: number) {
    let cartItems = [...order?.cartItems];
    cartItems[index].salePrice = Number(price);

    let total = cartItems.reduce(
      (total, item) => total + item.salePrice * item?.quantity,
      0
    );
    let inTotal =
      total +
      order?.shippingCost +
      (order?.isHomeDeliverySelected ? order?.totalExtraDeliveryCharge : 0);
    setOrder({ ...order, cartItems, total, inTotal });
  }

  function removeItem(index: number) {
    let cartItems = [...order?.cartItems];
    cartItems.splice(index, 1);
    let total = cartItems.reduce(
      (total, item) => total + item.salePrice * item?.quantity,
      0
    );
    let inTotal =
      total +
      order?.shippingCost +
      (order?.isHomeDeliverySelected ? order?.totalExtraDeliveryCharge : 0);
    setOrder({ ...order, cartItems, total, inTotal });
  }

  useEffect(() => {
    let extraDeliveryCharge = order?.isHomeDeliverySelected
      ? order?.totalExtraDeliveryCharge
      : 0;
    let inTotal = order?.total + order?.shippingCost + extraDeliveryCharge;
    setOrder({ ...order, inTotal });
  }, [
    order?.isHomeDeliverySelected,
    order?.totalExtraDeliveryCharge,
    order?.total,
    order?.shippingCost,
  ]);

  if (loading || settingDataLoading) return <>Loading...</>;

  async function saveOrder() {
    let response = await putData(`/api/admin/orders/order`, order);
    console.log("🚀 ~ saveOrder ~ response:", response);
    getOrders();
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="mx-auto w-full justify-center space-y-12 md:relative md:flex md:gap-7 md:space-y-0">
            <div className="w-full md:w-4/12">
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Billing details
              </h3>

              {/* User Details */}
              <div className="mb-6 space-y-4">
                <div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FaUser />
                    </span>
                    <Input
                      id="userName"
                      type="text"
                      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="আপনার নাম লিখুন *"
                      pattern=".{3,}"
                      required
                      value={order?.userName}
                      onChange={(e) =>
                        setOrder({ ...order, userName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <FaPhoneAlt />
                  </span>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="আপনার মোবাইল নম্বর লিখুন *"
                    pattern="01[0-9]{9}"
                    required
                    value={order?.phoneNumber}
                    onChange={(e) =>
                      setOrder({ ...order, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Input
                    id="address"
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={order?.address}
                    onChange={(e) =>
                      setOrder({ ...order, address: e.target.value })
                    }
                    placeholder="সম্পূর্ণ ঠিকানা (জেলা সহ)*"
                  />
                </div>
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Add Order Notes
                  </summary>
                  <div className="mt-2">
                    <Textarea
                      id="note"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={order?.note}
                      onChange={(e) =>
                        setOrder({ ...order, note: e.target.value })
                      }
                      placeholder="Notes about your order, e.g. special instructions for the delivery"
                    />
                  </div>
                </details>
              </div>
            </div>

            <div className="w-full md:w-8/12">
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Your order
              </h3>
              {/* cart items  */}
              {order?.cartItems.map((item, index: number) => {
                return (
                  <div
                    key={index}
                    className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2"
                  >
                    <div className="flex items-center">
                      <img
                        width={80}
                        height={80}
                        src={item?.image ?? "/images/no-image.png"}
                        alt={item.name}
                        className="mr-4 h-20 w-20 rounded-md object-cover"
                      />
                      <div>
                        <h2 className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-200">
                          {item.name}
                        </h2>
                        {item?.nameOfVariant && (
                          //   <p className="text-xs text-gray-600">
                          //     {item.nameOfVariant}
                          //   </p>
                          <Input
                            type="text"
                            className="w-fit"
                            value={item.nameOfVariant}
                            onChange={(e) =>
                              setOrder({
                                ...order,
                                cartItems: order?.cartItems.map((p) =>
                                  p._id === item._id
                                    ? { ...p, nameOfVariant: e.target.value }
                                    : p
                                ),
                              })
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center rounded-md border border-gray-300">
                        <button
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() =>
                            changeItemQuantity(index, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <input
                          className="w-16 border-x border-gray-300 py-1 text-center text-sm dark:bg-gray-800"
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) =>
                            changeItemQuantity(index, parseInt(e.target.value))
                          }
                        />
                        <button
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          onClick={() =>
                            changeItemQuantity(index, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* <p className="ml-4 text-sm font-medium">
                        {item.salePrice} BDT
                      </p> */}
                      <Input
                        type="number"
                        className="w-20"
                        value={item.salePrice}
                        onChange={(e) =>
                          changeItemPrice(index, Number(e.target.value))
                        }
                        placeholder="Price"
                      />
                      <button
                        className="ml-4 text-sm text-red-500 hover:text-red-700"
                        onClick={() => removeItem(index)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="space-y-5">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="font-semibold text-slate-500">
                    {order?.total} BDT
                  </p>
                </div>

                <div className="border-t border-gray-200"></div>

                <div className="flex items-center justify-between">
                  <div>Shipping Cost</div>
                  <Input
                    type="number"
                    className="w-32"
                    value={order?.shippingCost}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        shippingCost: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between space-y-2">
                  <div>Delivery Method</div>
                  <div className="flex flex-col items-end">
                    <label className="mb-2 flex items-center space-x-2">
                      <div className="inline-flex items-center space-x-2">
                        <p>Home Delivery</p>
                        <Input
                          type="number"
                          className="w-24"
                          value={order?.totalExtraDeliveryCharge}
                          onChange={(e) => {
                            setOrder({
                              ...order,
                              totalExtraDeliveryCharge: Number(e.target.value),
                            });
                          }}
                        />
                        BDT
                      </div>
                      <input
                        type="radio"
                        name="pickupPoint"
                        value={"Home Delivery"}
                        checked={order?.isHomeDeliverySelected}
                        onChange={() =>
                          setOrder({
                            ...order,
                            isHomeDeliverySelected: true,
                          })
                        }
                        className="form-radio text-blue-600"
                      />
                    </label>

                    <label className="mb-2 flex items-center space-x-2">
                      <p>
                        Courier Office Pickup
                        <span className="ml-3 text-end font-semibold text-slate-500">
                          0 BDT
                        </span>
                      </p>
                      <input
                        type="radio"
                        name="pickupPoint"
                        value={"Courier Pickup"}
                        checked={!order?.isHomeDeliverySelected}
                        onChange={() =>
                          setOrder({
                            ...order,
                            isHomeDeliverySelected: false,
                          })
                        }
                        className="form-radio text-blue-600"
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                <div className="flex items-center justify-between font-semibold">
                  <div>Total</div>
                  <div>
                    {order?.inTotal}
                    BDT
                  </div>
                </div>
              </div>

              {/* <PaymentDetails
                paymentMethod={paymentMethod}
                selectedShippingLocationFee={selectedShippingLocationFee}
                total={total}
                inTotal={inTotal}
                takeShippingFeeAdvance={takeShippingFeeAdvance}
                shippingFeeAdvanceForCashOnDelivery={
                  shippingFeeAdvanceForCashOnDelivery
                }
                totalPayableWhileDelivery={totalPayableWhileDelivery}
                totalExtraDeliveryCharge={totalExtraDeliveryCharge}
              /> */}

              <br />

              {/* Payment Details */}
              {/* <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-700">
                  Payment Method
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cashOnDelivery"
                      checked={paymentMethod === 'cashOnDelivery'}
                      onChange={() => setPaymentMethod('cashOnDelivery')}
                      className="form-radio text-blue-600"
                    />
                    <span>Cash On Delivery</span>
                  </label>
                  {paymentMethod === 'cashOnDelivery' &&
                    takeShippingFeeAdvance && (
                      <p className="ml-6 text-sm text-gray-600">
                        Pay{' '}
                        <span className="font-bold text-blue-600">
                          {shippingFeeAdvanceForCashOnDelivery}
                        </span>{' '}
                        Taka to confirm cash on delivery order
                      </p>
                    )}
                  {isPaymentEnabled && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="onlinePayment"
                        checked={paymentMethod === 'onlinePayment'}
                        onChange={() => setPaymentMethod('onlinePayment')}
                        className="form-radio text-blue-600"
                      />
                      <span>Mobile Banking / Card Payment / EMI</span>
                    </label>
                  )}
                </div>
              </div> */}

              {/* Submit Button */}
              {/* <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleOrderSubmit}
                className={`flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-white transition duration-300 hover:bg-blue-700 ${
                  isSubmitting ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {takeShippingFeeAdvance
                  ? `Pay ${shippingFeeAdvanceForCashOnDelivery} Taka to Confirm Order`
                  : isSubmitting
                    ? 'Confirming Order...'
                    : 'Confirm Order'}
                {isSubmitting && (
                  <span className="ml-2">
                    <FaSpinner className="animate-spin" />
                  </span>
                )}
              </button> */}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveOrder}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
