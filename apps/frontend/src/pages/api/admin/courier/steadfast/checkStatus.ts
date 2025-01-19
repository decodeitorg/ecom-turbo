import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { OrderType } from '@/utils/types.ts';
import type { APIRoute } from 'astro';
import axios from 'axios';
import mongoose from 'mongoose';

export const POST: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    let { order_id } = await request.json();
    if (!mongoose.isValidObjectId(order_id)) return response({}, 'Invalid order id', 400);
    const order = await Order.findById(order_id);

    if (!order) return response({}, 'Order not found', 404);

    let res = await axios.get('https://portal.steadfast.com.bd/api/v1' + '/status_by_cid/' + order.steadfast.consignment_id, {
      headers: {
        'Api-Key': 'Bearer 5e7b3b7b-7b7b-4b7b-8b7b-9b7b7b7b7b7b',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    let status = res.data.status;

    if (status === 'delivered') {
      order.status = 'delivered';
      await order.save();
    }
    return response({}, 'Order count fetched successfully', 200);
  } catch (err) {
    return response({}, 'Error connecting with seatfast', 500);
  }
};
