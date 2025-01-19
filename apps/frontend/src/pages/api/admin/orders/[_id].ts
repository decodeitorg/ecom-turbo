import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import { mongo } from 'mongoose';

export const PUT: APIRoute = async ({ request, url, params }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      const { _id } = params;
      if (!mongo.ObjectId.isValid(_id ? _id : '')) {
         return response({}, 'Invalid Order ID!', 400);
      }
      let body = await request.json();
      const newStatus = body.status;

      let upd = await Order.updateOne(
         {
            _id: _id,
         },
         {
            $set: {
               status: newStatus,
            },
         },
      );
      if (upd.nModified === 0) {
         return response({}, 'Order not found!', 404);
      }
      return response({}, 'Order updated successfully!', 200);
   } catch (err) {
      return response({}, 'Internal Server Error!', 500);
   }
};
