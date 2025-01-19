import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      let week = new Date();
      week.setDate(week.getDate() - 10);
      // total order amount
      const totalAmount = await Order.aggregate([
         {
            $group: {
               _id: null,
               tAmount: {
                  $sum: '$total',
               },
            },
         },
      ]);
      //
      const thisMonthlyOrderAmount = await Order.aggregate([
         {
            $match: {
               $or: [{ status: { $regex: 'Delivered', $options: 'i' } }],
               $expr: {
                  $eq: [{ $month: '$updatedAt' }, { $month: new Date() }],
               },
            },
         },
         {
            $group: {
               _id: {
                  month: {
                     $month: '$updatedAt',
                  },
               },
               total: {
                  $sum: '$total',
               },
            },
         },
         {
            $sort: { _id: -1 },
         },
         {
            $limit: 1,
         },
      ]);

      //

      // order list last 10 days
      const orderFilteringData = await Order.find(
         {
            $or: [{ status: { $regex: `Delivered`, $options: 'i' } }],
            updatedAt: {
               $gte: week,
            },
         },

         {
            paymentMethod: 1,
            paymentDetails: 1,
            total: 1,
            createdAt: 1,
            updatedAt: 1,
         },
      );
      // let data = [];
      // orderFilteringData.map((value) => {
      //   return data.push(value._id);
      // });

      return response(
         {
            totalAmount: totalAmount.length === 0 ? 0 : parseFloat(totalAmount[0].tAmount).toFixed(2),
            thisMonthlyOrderAmount: thisMonthlyOrderAmount[0]?.total,
            ordersData: orderFilteringData,
         },
         'Dashboard order amount',
         200,
      );
   } catch (err) {
      return response({}, (err as Error).message, 500);
   }
};
