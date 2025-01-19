import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      let page = parseInt(url.searchParams.get('page') || '1');
      let limit = parseInt(url.searchParams.get('limit') || '10');
      let search = url.searchParams.get('search') || '';
      const skip = Number((page - 1) * limit);

      //define match stage
      const matchStage = {
         $or: [
            { status: { $regex: `Pending`, $options: 'i' } },
            { status: { $regex: `Processing`, $options: 'i' } },
            { status: { $regex: `Delivered`, $options: 'i' } },
            { status: { $regex: `Cancel`, $options: 'i' } },
         ],
      };
      //define search stage
      const searchStage = search ? {} : {};

      let data = await Order.aggregate([
         {
            $match: matchStage,
         },
         // {
         //     $match: searchStage,
         // },
         {
            $facet: {
               docs: [{ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit }],
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

      return response(data[0], 'Kitchen List', 200);
   } catch (err) {
      return response({}, err.message, 500);
   }
};
