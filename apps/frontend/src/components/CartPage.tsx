import PaymentDetails from '@/common/components/PaymentDetails';
import { CartType, CartItemsType } from '@/common/types';
import { userAddressAndPaymentMethodValidation } from '@/utils/userAddressAndPaymentMethodValidation.ts';
import { useStore } from '@nanostores/react';

import React, { useEffect, useState } from 'react';
import { FaPhoneAlt, FaSpinner, FaUser } from 'react-icons/fa';
import { $userData } from '@/common/store/user';

type CartPageProps = {
  shippingLocationFee: {
    location: string;
    fee: number;
  }[];
  takeShippingFeeAdvance: boolean;
  isPaymentEnabled: boolean;
};

export default function CartPage({
  shippingLocationFee,
  takeShippingFeeAdvance,
  isPaymentEnabled,
}: CartPageProps) {
  let [cartItems, setCartItems] = React.useState<[CartItemsType]>(
    JSON.parse(localStorage.getItem('cart') ?? '[]') || [],
  );

  const [paymentMethod, setPaymentMethod] = useLState(
    'paymentMethod',
    'cashOnDelivery',
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const userData = useStore($userData);

  const [userName, setuserName] = useLState('userName', '');
  const [phoneNumber, setPhoneNumber] = useLState('phoneNumber', '');

  useEffect(() => {
    if (userData?.name) setuserName(userData?.name);
    if (userData?.phone?.number) setPhoneNumber(userData?.phone?.number);
  }, [userData]);

  const [selectedShippingLocationFee, setSelectedShippingLocationFee] =
    useState(shippingLocationFee?.[0]);
  const [address, setAddress] = useLState('address', '');
  const [note, setNote] = useLState('note', '');

  const [isHomeDeliverySelected, setisHomeDeliverySelected] = useState(true);

  const [checkBox, setCheckBox] = useState(false);

  let total = cartItems.reduce(
    (total, item) => total + item.salePrice * item?.quantity,
    0,
  );
  // Check if any item has isHomeDeliveryFree property
  let isHomeDeliveryFree = cartItems.reduce(
    (acc, item) =>
      acc || !!item.isHomeDeliveryFree || !!item.variant?.isHomeDeliveryFree,
    false,
  );
  console.log('🚀 ~ isHomeDeliveryFree:', isHomeDeliveryFree);
  let shippingCost = isHomeDeliveryFree ? 0 : selectedShippingLocationFee?.fee;
  const totalExtraDeliveryCharge = isHomeDeliveryFree
    ? 0
    : cartItems.reduce(
        (total, item) =>
          total +
          (item.hasVariant && Number(item.variant?.extraDeliveryCharge)
            ? Number(item.variant?.extraDeliveryCharge)
            : 0),
        0,
      );
  let inTotal =
    total +
    shippingCost +
    (isHomeDeliverySelected ? totalExtraDeliveryCharge : 0);
  //this is needed if we want to take advance for cash on delivery
  let shippingFeeAdvanceForCashOnDelivery = selectedShippingLocationFee?.fee;
  let totalPayableWhileDelivery = inTotal - shippingFeeAdvanceForCashOnDelivery;

  useEffect(() => {
    trackInitiateCheckoutEvent({
      content_ids: cartItems.map((item) => item.slug),
      content_type: 'product',
      contents: cartItems.map((item) => ({
        _id: item.slug,
        _quantity: item.quantity,
      })),
      value: Number(inTotal.toFixed(2)),
      currency: 'BDT',
    });
  }, [cartItems, inTotal]);

  const handleOrderSubmit = async () => {
    setIsSubmitting(true);

    let payload: CartType = {
      city: selectedShippingLocationFee?.location,
      address,
      note,
      isHomeDeliverySelected,
      isHomeDeliveryFree,
      total,
      shippingCost,
      inTotal,
      shippingFeeAdvanceForCashOnDelivery,
      totalPayableWhileDelivery,
      isPaymentEnabled: false,
      totalExtraDeliveryCharge,

      paymentMethod,
      userName,
      phoneNumber: phoneNumber,
      cartItems: cartItems,
    };

    let response = await fetch('/api/frontend/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
          ? `Bearer ${localStorage.getItem('token')}`
          : '',
      },
      body: JSON.stringify(payload),
    });

    let data = await response.json();

    if (response.ok) {
      if (takeShippingFeeAdvance || paymentMethod === 'onlinePayment') {
        const gatewayPageURL = data?.data?.gatewayPageURL;
        window.location.replace(gatewayPageURL);
      }
      window.location.href = '/thankyou';
    } else {
      errorAlert(data?.message);
    }
    setIsSubmitting(false);
  };

  let isDisabled = userAddressAndPaymentMethodValidation({
    userName,
    phoneNumber,
    checkBox,
    city: selectedShippingLocationFee?.location,
    address,
    note,
    cartItems,
    paymentMethod,
  });

  isDisabled = !!isDisabled;

  const changeItemQuantity = (index: number, quantity: number) => {
    const newCartItems: any = [...cartItems];
    newCartItems[index].quantity = Math.max(1, quantity);
    setCartItems(newCartItems);
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  };

  const removeItem = (index: number) => {
    const newCartItems: any = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  };

  return (
    <div>
      <ProgressIndicator />
      <div className="mx-auto max-w-4xl p-4">
        <div className="my-6 text-center text-lg font-bold">
          অর্ডারটি কনফার্ম করতে ফর্মটি সম্পুর্ণ পুরণ করে নিচের Place Order বাটনে
          ক্লিক করুন।
        </div>
        <div className="mx-auto justify-center space-y-12 md:relative md:flex md:gap-7 md:space-y-0">
          <div className="w-full md:w-1/2">
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
                  <input
                    id="userName"
                    type="text"
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="আপনার নাম লিখুন *"
                    pattern=".{3,}"
                    required
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaPhoneAlt />
                </span>
                <input
                  id="phoneNumber"
                  type="tel"
                  className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="আপনার মোবাইল নম্বর লিখুন *"
                  pattern="01[0-9]{9}"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <input
                  id="address"
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="সম্পূর্ণ ঠিকানা (জেলা সহ)*"
                />
              </div>
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  Add Order Notes
                </summary>
                <div className="mt-2">
                  <textarea
                    id="note"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Notes about your order, e.g. special instructions for the delivery"
                  />
                </div>
              </details>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Your order
            </h3>
            {/* cart items  */}
            {cartItems.map((item, index: number) => {
              return (
                <div
                  key={index}
                  className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2"
                >
                  <div className="flex items-center">
                    <img
                      width={80}
                      height={80}
                      src={item?.image ?? '/images/no-image.png'}
                      alt={item.name}
                      className="mr-4 h-20 w-20 rounded-md object-cover"
                    />
                    <div>
                      <h2 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h2>
                      {item?.nameOfVariant && (
                        <p className="text-xs text-gray-600">
                          {item.nameOfVariant}
                        </p>
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
                        className="w-10 border-x border-gray-300 py-1 text-center text-sm"
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

                    <p className="ml-4 text-sm font-medium">
                      {item.salePrice} BDT
                    </p>

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
              {isHomeDeliveryFree ? (
                <div className="text-lg font-semibold text-green-600">
                  <p>🎉 Home Delivery is Free!</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p className="font-semibold text-slate-500">{total} BDT</p>
                  </div>

                  <div className="border-t border-gray-200"></div>

                  <div className="flex items-center justify-between">
                    <div>Delivery Location</div>
                    <div className="flex flex-col items-end">
                      {shippingLocationFee?.map((location) => (
                        <label
                          key={location.location}
                          className="mb-2 flex items-center space-x-2"
                        >
                          <p>
                            {location.location}
                            <span className="ml-3 text-end font-semibold text-slate-500">
                              {location.fee} BDT
                            </span>
                          </p>
                          <input
                            type="radio"
                            name="shippingLocation"
                            value={location.location}
                            checked={
                              selectedShippingLocationFee?.location ===
                              location.location
                            }
                            onChange={() =>
                              setSelectedShippingLocationFee(location)
                            }
                            className="form-radio text-blue-600"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {totalExtraDeliveryCharge > 0 && (
                    <div className="flex items-center justify-between space-y-2">
                      <div>Delivery Method</div>
                      <div className="flex flex-col items-end">
                        <label className="mb-2 flex items-center space-x-2">
                          <p>
                            Home Delivery
                            <span className="ml-3 text-end font-semibold text-slate-500">
                              {totalExtraDeliveryCharge} BDT
                            </span>
                          </p>
                          <input
                            type="radio"
                            name="pickupPoint"
                            value={'Home Delivery'}
                            checked={isHomeDeliverySelected}
                            onChange={() => setisHomeDeliverySelected(true)}
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
                            value={'Courier Pickup'}
                            checked={!isHomeDeliverySelected}
                            onChange={() => setisHomeDeliverySelected(false)}
                            className="form-radio text-blue-600"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </>
              )}
              {/* <div className="flex justify-between">
                <p>Extra Shipping Charge(per kg)</p>
                <p>{totalExtraDeliveryCharge} BDT</p>
              </div> */}

              <div className="border-t border-gray-200"></div>

              <div className="flex items-center justify-between font-semibold">
                <div>Total</div>
                <div>{inTotal} BDT</div>
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
            <div className="mb-6">
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
            </div>

            {/* Submit Button */}
            <button
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const useLState = (key: string, initialValue: any) => {
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : initialValue;
  });

  const storeData = (newData: any) => {
    localStorage.setItem(key, JSON.stringify(newData));
    setData(newData);
  };

  return [data, storeData];
};

const ProgressIndicator = () => {
  return (
    <div className="mt-4 flex items-center justify-center bg-gray-800 px-4 py-2">
      {/* Cart Step */}
      <div className="flex items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span className="ml-2 text-sm text-gray-400">Cart</span>
      </div>

      {/* Connector */}
      <div className="mx-2 h-0.5 w-16 bg-green-500" />

      {/* Information Step */}
      <div className="flex items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
          <span className="text-white">2</span>
        </div>
        <span className="ml-2 text-sm text-green-500">Information</span>
      </div>

      {/* Connector */}
      <div className="mx-2 h-0.5 w-16 bg-gray-600" />

      {/* Finish Step */}
      <div className="flex items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600">
          <span className="text-white">3</span>
        </div>
        <span className="ml-2 text-sm text-gray-400">Finish</span>
      </div>
    </div>
  );
};
