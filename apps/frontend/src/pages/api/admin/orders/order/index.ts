import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    let order_id = url.searchParams.get('order_id');

    let order = await Order.findById(order_id);

    return response(order, 'success', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};

export const PUT: APIRoute = async ({ request, url }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    let body = await request.json();

    let order = await Order.findByIdAndUpdate(body._id, body);
    if (!order) {
      return response({}, 'Order not found', 404);
    }
    return response(order, 'success', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};
