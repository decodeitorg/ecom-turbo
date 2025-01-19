import Order from '@/models/Order';
import User from '@/models/User.ts';
import { apiAuthGuard, getUserDataFromToken } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';

export type OrderCountsType = {
  totalOrderCount: number;
  pending: number;
  processing: number;
  onDelivery: number;
  delivered: number;
  cancelled: number;
};

export const GET: APIRoute = async ({ request, url }) => {
  const data = apiAuthGuard(request, ['Customer', 'Admin', 'SuperAdmin']);
  const user_id = data._id;
  try {
    let orderCounts = await Order.aggregate([
      { $match: { user: user_id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    orderCounts = orderCounts?.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    orderCounts.totalOrderCount = Object.values(orderCounts).reduce(
      (acc, cur) => acc + cur,
      0,
    );

    const responsePayload: OrderCountsType = {
      totalOrderCount: orderCounts.totalOrderCount,
      pending: orderCounts.pending || 0,
      processing: orderCounts.processing || 0,
      onDelivery: orderCounts.onDelivery || 0,
      delivered: orderCounts.delivered || 0,
      cancelled: orderCounts.cancelled || 0,
    };

    return response(responsePayload, 'Order count', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};
