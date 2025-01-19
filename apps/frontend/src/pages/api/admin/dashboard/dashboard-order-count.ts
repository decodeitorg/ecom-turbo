import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      let todayOrderCount = await Order.find({
         createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
         },
      }).countDocuments();

      let totalPendingOrder = await Order.find({ status: 'Pending' }).countDocuments();

      let totalProcessingOrder = await Order.find({ status: 'Processing' }).countDocuments();

      let totalDeliveredOrder = await Order.find({ status: 'Delivered' }).countDocuments();

      return response(
         {
            todayOrderCount,
            totalPendingOrder,
            totalProcessingOrder,
            totalDeliveredOrder,
         },
         'Order count fetched successfully',
         200,
      );
   } catch (err) {
      return response({}, (err as Error).message, 500);
   }
};
