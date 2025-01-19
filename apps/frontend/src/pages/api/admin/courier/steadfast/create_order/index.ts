import Order from '@/models/Order.ts';
import Setting from '@/models/Setting.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import axios from 'axios';
import mongoose from 'mongoose';

export const POST: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    let setting = await Setting.findOne({}, { steadFast: 1 });

    const isSteadfastEnabled = setting?.steadFast?.isSteadfastEnabled;

    if (!isSteadfastEnabled)
      return response({}, 'Steadfast is not enabled', 400);

    let { order_id } = await request.json();

    if (!mongoose.isValidObjectId(order_id))
      return response({}, 'Invalid order id', 400);

    let order = await Order.findById(order_id);

    if (!order) return response({}, 'Order not found', 404);

    let res = await axios.post(
      'https://portal.steadfast.com.bd/api/v1/create_order',
      {
        invoice: order_id,
        recipient_name: order.userName,
        recipient_phone: order.phoneNumber,
        recipient_address: order.address,
        cod_amount: order.inTotal,
        note: order.note,
      },
      {
        headers: {
          'Api-Key': setting?.steadFast?.apiKey,
          'Secret-Key': setting?.steadFast?.secretKey,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res?.data?.consignment?.consignment_id)
      return response({}, 'Error creating order', 500);

    if (res?.data?.consignment?.status !== 'in_review')
      return response({}, 'Order is not in review', 400);

    if (!order.steadFast) {
      order.steadFast = {};
    }
    order.steadFast.consignment_id = res.data.consignment.consignment_id || '';
    order.steadFast.tracking_code = res.data.consignment.tracking_code || '';
    order.steadFast.status = res.data.consignment.status || '';

    await order.save();

    return response({}, 'Order count fetched successfully', 200);
  } catch (err) {
    console.log('🚀 ~ constPOST:APIRoute= ~ err:', err);
    return response({}, 'Error connecting with seatfast', 500);
  }
};
