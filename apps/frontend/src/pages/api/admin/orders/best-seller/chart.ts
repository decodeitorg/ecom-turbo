import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      const totalDoc = await Order.countDocuments({});
      const bestSellingProduct = await Order.aggregate([
         {
            $unwind: '$cart',
         },
         {
            $group: {
               _id: '$cart.title',

               count: {
                  $sum: '$cart.quantity',
               },
            },
         },
         {
            $sort: {
               count: -1,
            },
         },
         {
            $limit: 4,
         },
      ]);

      return response(
         {
            totalDoc,
            bestSellingProduct,
         },
         'Best selling product chart',
         200,
      );
   } catch (err) {
      return response({}, 'Best selling product chart', 500);
   }
};
