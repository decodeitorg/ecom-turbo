import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    let data = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    data = data?.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    return response(data, 'success', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};
