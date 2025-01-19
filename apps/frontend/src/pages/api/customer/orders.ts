import { OrderType } from '@/common/types';
import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    await apiAuthGuard(request, ['Customer','Admin', 'SuperAdmin']);

    let page = parseInt(url.searchParams.get('page') || '1');
    let limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = Number((page - 1) * limit);

    let matchStage: any = {};
    let sortStage: any = { createdAt: -1 };
    let searchStage: any = {};

    let searchParams = new URLSearchParams(url.searchParams);

    //Filter by OrderStatus
    let orderStatus = searchParams.get('orderStatus') as OrderType['status'];
    if (
      orderStatus &&
      ![
        'pending',
        'onDelivery',
        'processing',
        'delivered',
        'cancelled',
      ].includes(orderStatus)
    )
      return response({}, 'Please enter a valid orderStatus', 400);
    if (orderStatus) {
      matchStage.status = orderStatus;
    }

    let data = await Order.aggregate([
      {
        $match: matchStage,
      },
      {
        $match: searchStage,
      },
      {
        $lookup: {
          from: 'user',
          localField: 'User',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $facet: {
          docs: [
            {
              $sort: sortStage,
            },
            { $skip: skip },
            { $limit: limit },
          ],
          totalDocs: [
            {
              $count: 'createdAt',
            },
          ],
        },
      },
      {
        $project: {
          docs: 1,
          totalPages: {
            $ceil: {
              $divide: [{ $first: '$totalDocs.createdAt' }, limit],
            },
          },
          totalDocs: { $first: '$totalDocs.createdAt' },
        },
      },
      {
        $addFields: {
          page: page,
          limit: limit,
        },
      },
    ]);

    return response(data[0], 'success', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};
