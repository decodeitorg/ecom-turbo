import Order from '@/models/Order.ts';
import Product from '@/models/Product.ts';
import Setting from '@/models/Setting.ts';
import { getUserDataFromToken } from '@/utils/authGaurd.ts';
import mapError from '@/utils/errorMapping.ts';
import { generatePaymentLink } from '@/utils/generatePaymentLink.ts';
// import { generatePaymentLink } from '@/utils/payment/generatePaymentLink.ts';
import { response } from '@/utils/response.ts';
import type { CartItemsType, CartType, OrderType } from '@/common/types.ts';
import { userAddressAndPaymentMethodValidation } from '@/utils/userAddressAndPaymentMethodValidation.ts';
import type { APIRoute } from 'astro';
import { sendNotification } from '../notification';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const user = await getUserDataFromToken(
      request.headers.get('Authorization') || '',
    );
    const body = await request.json();
    const {
      city,
      address,
      note,

      total,
      shippingCost,
      isHomeDeliverySelected,
      inTotal,
      shippingFeeAdvanceForCashOnDelivery,
      totalPayableWhileDelivery,
      isPaymentEnabled,
      totalExtraDeliveryCharge,

      paymentMethod,
      userName,
      phoneNumber,
      cartItems,
    }: CartType = body;

    //PHASE 1 : PAYMENT METHOD VALIDATION + USER + ADDRESS + PHONE DETAILS VALIDATION
    let validationError = userAddressAndPaymentMethodValidation({
      userName,
      phoneNumber,
      checkBox: true,
      city,
      address,
      note,
      cartItems,
      paymentMethod,
    });
    if (validationError) return response({}, String(validationError), 400);

    //PHASE 2 : Total Price Validation + Product Verification
    let countedTotalSalePrice = 0;
    let totalExtraDeliveryChargeCounted = 0;
    const checkProduct = async (product: CartItemsType) => {
      if (!product?._id)
        return { error: 'Product ID is required', status: 400 };
      let db_product = await Product.findById(product?._id);
      if (!db_product) return { error: 'Product not found', status: 400 };

      if (!product?.quantity)
        return { error: 'Product Quantity is required', status: 400 };
      if (product?.quantity < 1)
        return {
          error: 'Product Quantity must be greater than 0',
          status: 400,
        };

      if (!product?.hasVariant) {
        if (!product?.salePrice)
          return {
            error: "One of the product's salePrice is required",
            status: 400,
          };
        if (db_product?.salePrice !== product?.salePrice)
          return {
            error: "One of the product's salePrice is incorrect",
            status: 400,
          };
        switch (db_product?.status) {
          case 'upcoming':
            return { error: 'Product is upcoming', status: 400 };
          case 'outOfStock':
            return { error: 'Product out of stock', status: 400 };
        }
        if (db_product?.isPublished === false)
          return { error: 'Product is no longer available', status: 400 };

        return { salePrice: product?.salePrice * product?.quantity };
      } else if (product?.hasVariant) {
        let variant_id = product?.variant_id;
        if (!variant_id)
          return {
            error: `Variant ID is required for the product ${db_product?.name}`,
            status: 400,
          };
        let variant = db_product?.variants?.find(
          (v: any) => v.id === variant_id,
        );
        if (!variant)
          return {
            error: `Variant not found for the product ${db_product?.name}`,
            status: 400,
          };

        if (variant?.extraDeliveryCharge) {
          totalExtraDeliveryChargeCounted += Number(
            variant?.extraDeliveryCharge,
          );
        }
        switch (variant?.status) {
          case 'upcoming':
            return { error: 'Variant is upcoming', status: 400 };
          case 'outOfStock':
            return { error: 'Variant out of stock', status: 400 };
        }
        if (!product?.salePrice)
          return {
            error: "One of the product's salePrice is required",
            status: 400,
          };
        if (variant?.salePrice !== product?.salePrice)
          return {
            error: "One of the product's salePrice is incorrect",
            status: 400,
          };
        return { salePrice: product?.salePrice * product?.quantity };
      } else {
        return { error: 'Order contains misconfiguration', status: 400 };
      }
    };
    const results = await Promise.all(cartItems.map(checkProduct));
    for (const result of results) {
      if (result.error) return response({}, result.error, result.status);
      countedTotalSalePrice += result.salePrice || 0;
    }

    if (total !== countedTotalSalePrice)
      return response({}, 'Total Price is incorrect', 400);

    //frst checkif any item has isHomeDeliveryFree property
    let isHomeDeliveryFree = cartItems.reduce(
      (acc, item) =>
        acc || !!item.isHomeDeliveryFree || !!item.variant?.isHomeDeliveryFree,
      false,
    );

    //PHASE 3 : SHIPPING FEE VALIDATION
    let setting = await Setting.findOne();
    let takeShippingFeeAdvance = setting?.takeShippingFeeAdvance ?? false;
    if (!isHomeDeliveryFree) {
      if (!setting) return response({}, 'Setting not found', 500);
      if (takeShippingFeeAdvance && !isPaymentEnabled)
        return response({}, 'Payment is not enabled', 400);

      let shippingLocationFee = setting?.shippingLocationFee ?? 0;
      let selectedShippingLocationFee = shippingLocationFee.find(
        (s: any) => s.location === city,
      );
      let dbShippingFeeAdvanceForCashOnDelivery =
        selectedShippingLocationFee?.fee;

      if (shippingCost !== selectedShippingLocationFee?.fee)
        return response({}, 'Shipping Fee is incorrect', 400);

      if (takeShippingFeeAdvance) {
        if (
          shippingFeeAdvanceForCashOnDelivery !==
          dbShippingFeeAdvanceForCashOnDelivery
        )
          return response({}, 'Shipping Fee Advance is incorrect', 400);

        if (
          totalPayableWhileDelivery !==
          inTotal - shippingFeeAdvanceForCashOnDelivery
        )
          return response({}, 'Total Payable While Delivery is incorrect', 400);
      }

      //PHASE 4: EXTRA DELIVERY CHARGE VALIDATION

      if (isHomeDeliverySelected) {
        console.log(
          '🚀',
          totalExtraDeliveryCharge,
          totalExtraDeliveryChargeCounted,
        );
        if (totalExtraDeliveryCharge !== totalExtraDeliveryChargeCounted)
          return response({}, 'Extra Delivery Charge is incorrect', 400);
      }
    }

    //PHASE 5 : ORDER PLACEMENT
    let payload: CartType = {
      user: user ? user?._id : '',
      userImage: user ? user?.image : '/images/no-image.png',
      userName: user ? user?.name : userName,
      userEmail: user ? user?.email : '',
      phoneNumber,

      city,
      address,
      note,

      isHomeDeliverySelected,
      isHomeDeliveryFree,
      takeShippingFeeAdvance,
      paymentMethod,
      total,
      shippingCost,
      inTotal,
      shippingFeeAdvanceForCashOnDelivery,
      totalPayableWhileDelivery,
      isPaymentEnabled,
      totalExtraDeliveryCharge,

      cartItems,
    };
    let order = new Order(payload);
    await order.save();

    await sendNotification({
      title: `${userName} has placed a new order`,
      body: `Amount: ${total} BDT - ${cartItems?.map((item) => item?.name).join(', ')}`,
      link: `/admin/orders/pending?order_id=${order?._id}`,
    });

    // STEP 6: PAYMENT LINK GENERATION if payment method is enabled
    if (!isPaymentEnabled) {
      return response({}, 'Order Placed Successfully', 200);
    }

    let orderData: OrderType = JSON.parse(JSON.stringify(order));
    let paymentData = await generatePaymentLink(orderData);

    if (!paymentData)
      return response(
        {},
        'An unexpected error occurred. Please Contact Support.',
        500,
      );
    return response(
      { gatewayPageURL: paymentData },
      'Order Placed Successfully',
      200,
    );
  } catch (err: any) {
    console.log('🚀 ~ constPOST:APIRoute= ~ err:', err);
    return response(
      {},
      mapError(
        err,
        err?.message === 'Unauthorized'
          ? 'Only customers can place orders.'
          : 'An unexpected error occurred. Please Contact Support.',
      ),
      500,
    );
  }
};
