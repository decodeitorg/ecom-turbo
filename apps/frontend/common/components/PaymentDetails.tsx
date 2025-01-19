import React from 'react';
import { CartItemsType } from '../types';

interface PaymentDetailsProps {
  total: number;
  selectedShippingLocationFee: {
    location: string;
    fee: number;
  };
  inTotal: number;
  paymentMethod: string;
  takeShippingFeeAdvance: boolean;
  shippingFeeAdvanceForCashOnDelivery: number;
  totalPayableWhileDelivery: number;
  totalExtraDeliveryCharge: number;
  isHomeDeliverySelected: boolean;
}

export default function PaymentDetails({
  total,
  selectedShippingLocationFee,
  inTotal,
  takeShippingFeeAdvance,
  shippingFeeAdvanceForCashOnDelivery,
  totalPayableWhileDelivery,
  totalExtraDeliveryCharge,
  isHomeDeliverySelected,
}: PaymentDetailsProps) {
  return (
    <div>
      <div className="rounded-lg border p-3 shadow">
        <div className="mb-2 flex justify-between">
          <p className="text-gray-700">Total</p>
          <p className="text-gray-700">{total}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-700">Delivery Charge</p>
          <p className="text-gray-700">
            {selectedShippingLocationFee?.fee > 0
              ? selectedShippingLocationFee?.fee
              : 0}
          </p>
        </div>

        {totalExtraDeliveryCharge > 0 && isHomeDeliverySelected && (
          <div className="flex justify-between">
            <p className="text-gray-700">Extra Delivery Charge</p>
            <p className="text-gray-700">{totalExtraDeliveryCharge}</p>
          </div>
        )}

        <hr className="my-4" />
        <div className="flex justify-between">
          <p className="text-lg font-bold">In-Total</p>
          <div className="">
            <p className="mb-1 text-lg font-bold text-slate-500">{inTotal}</p>
          </div>
        </div>

        {takeShippingFeeAdvance && shippingFeeAdvanceForCashOnDelivery > 0 && (
          <div className="flex justify-between">
            <p className="text-gray-700">Need to pay in advance</p>
            <p className="text-gray-700">
              -{shippingFeeAdvanceForCashOnDelivery}
            </p>
          </div>
        )}

        {takeShippingFeeAdvance && shippingFeeAdvanceForCashOnDelivery > 0 && (
          <>
            <div className="border-t-2 border-black"></div>
            <div className="flex justify-between gap-3">
              <p className="text-lg font-semibold">
                Total Payable While delivery
              </p>
              <div className="">
                <p className="mb-1 text-lg font-bold text-slate-500">
                  {totalPayableWhileDelivery}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
