import { OrderType } from '@/common/types';
import Order from '@/models/Order.ts';
import Product from '@/models/Product.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import mongoose from 'mongoose';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    let page = parseInt(url.searchParams.get('page') || '1');
    let limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = Number((page - 1) * limit);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    let matchStage: any = {};
    let sortStage: any = { createdAt: -1 };
    let searchStage: any = {};

    let searchParams = new URLSearchParams(url.searchParams);

    //Filter by date
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    }

    //Filter by search
    let search = searchParams.get('search');
    if (search === '_id') {
      let order_id = searchParams.get('order_id');
      let isIdValid = mongoose.Types.ObjectId.isValid(order_id || '');
      if (isIdValid) {
        matchStage._id = new mongoose.Types.ObjectId(order_id);
      } else {
        return response({}, 'Please enter a valid Order ID', 400);
      }
    }
    if (search === 'customer_name') {
      let customer_name = searchParams.get('customer_name');
      matchStage['userInfo.name'] = {
        $regex: `${customer_name}`,
        $options: 'i',
      };
    }
    if (search === 'customer_phone') {
      let customer_phone = searchParams.get('customer_phone');
      matchStage['userInfo.phoneNumber'] = {
        $regex: `${customer_phone}`,
        $options: 'i',
      };
    }
    if (search === 'customer_email') {
      let customer_email = searchParams.get('customer_email');
      matchStage['userInfo.email'] = {
        $regex: `${customer_email}`,
        $options: 'i',
      };
    }

    //Filter by PaymentStatus
    let paymentStatus = searchParams.get(
      'paymentStatus',
    ) as OrderType['paymentStatus'];
    if (
      paymentStatus &&
      !['Pending', 'Success', 'Failed'].includes(paymentStatus)
    )
      return response({}, 'Please enter a valid paymentStatus', 400);
    if (paymentStatus) {
      matchStage.paymentStatus = paymentStatus;
    }

    //Filter by PaymentMethod
    let paymentMethod = searchParams.get(
      'paymentMethod',
    ) as OrderType['paymentMethod'];
    if (
      paymentMethod &&
      !['storePickup', 'cashOnDelivery', 'onlinePayment'].includes(
        paymentMethod,
      )
    )
      return response({}, 'Please enter a valid paymentMethod', 400);
    if (paymentMethod) {
      matchStage.paymentMethod = paymentMethod;
    }

    //Filter by OrderStatus

    let orderStatus = searchParams.get('orderStatus') as OrderType['status'];

    if (
      !!orderStatus &&
      orderStatus !== 'undefined' &&
      ![
        'pending',
        'onDelivery',
        'processing',
        'delivered',
        'cancelled',
      ].includes(orderStatus)
    ) {
      return response({}, 'Please enter a valid orderStatus', 400);
    }

    if (orderStatus && orderStatus !== 'undefined') {
      matchStage.status = orderStatus;
    }

    //Filter by RefundStatus
    let refundStatus = searchParams.get(
      'refundStatus',
    ) as OrderType['refundStatus'];
    if (
      refundStatus &&
      !['processing', 'failed', 'success', ''].includes(refundStatus)
    )
      return response({}, 'Please enter a valid refundStatus', 400);
    if (refundStatus) {
      matchStage.refundStatus = refundStatus;
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
