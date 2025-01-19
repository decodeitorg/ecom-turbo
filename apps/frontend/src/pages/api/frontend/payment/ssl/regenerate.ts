import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import sslcz from '@/utils/payment/sslCommerz.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, url, params }) => {
   try {
      const user = await apiAuthGuard(request, ['Customer']);

      let body = await request.json();
      let order_id = body.order_id;
      let order = await Order.findOne({ _id: order_id });

      const paymentData = {
         //Integration Required Parameters
         total_amount: order.paymentMethod === 'cashOnDelivery' ? order.shippingFeeAdvanceForCashOnDelivery : order.totalPayableWhileDelivery,
         currency: 'BDT',
         tran_id: order?._id.toString(),
         success_url: import.meta.env.PUBLIC_SITE + '/api/frontend/payment/ssl/success',
         fail_url: import.meta.env.PUBLIC_SITE + '/api/frontend/payment/ssl/fail',
         cancel_url: import.meta.env.PUBLIC_SITE + '/api/frontend/payment/ssl/cancel',
         ipn_url: import.meta.env.PUBLIC_SITE + '/api/frontend/payment/ssl/ipn',
         // Parameters to Handle EMI Transaction
         emi_option: 1,
         //Customer Information
         cus_name: user?.name,
         cus_email: user?.email,
         cus_add1: order.shippingAddress.insideDhaka
            ? 'Dhaka'
            : order.shippingAddress.divisions + ' ' + order.shippingAddress.district + ' ' + order.shippingAddress.upazila,
         cus_city: order.shippingAddress.insideDhaka ? 'Dhaka' : order.shippingAddress.divisions,
         cus_postcode: Math.floor(1000 + Math.random() * 9000).toString(),
         cus_country: 'Bangladesh',
         cus_phone: order.userInfo.phoneNumber,
         //Shipment Information. Required For SSLCOMMERZ_LOGISTIC
         shipping_method: 'NO', //then Shipment Information/address not necessary."
         //Product Information
         product_name: order?._id.toString(),
         product_category: 'Mobile/Accessories',
         product_profile: 'general',
         //Customized or Additional Parameters
         //value_a: ... a to d
      };
      let responseSSL = await sslcz.init(paymentData);
      let paymentStatus = responseSSL.status;
      if (paymentStatus !== 'SUCCESS') return response({}, 'Payment Gateway Error,contact support', 500);
      let gatewayPageURL = responseSSL.GatewayPageURL;

      order.paymentLink = gatewayPageURL;
      await order.save();

      return response({ gatewayPageURL }, 'Order Placed Successfully', 200);
   } catch (error) {
      return response({}, 'Hello from /api/frontend/payment/ipn', 500);
   }
};
