import Category from '@/models/Category.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import mongoose from 'mongoose';

export const PUT: APIRoute = async ({ request, params }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      let body = await request.json();

      const newStatus = body.status;
      let _id = params._id;

      await Category.updateOne(
         { _id: new mongoose.Types.ObjectId(_id) },
         {
            $set: {
               status: newStatus,
            },
         },
      );

      return response({}, `Category ${newStatus === 'show' ? 'Published' : 'Un-Published'} Successfully!`, 200);
   } catch (err: any) {
      return response({}, err?.message, 500);
   }
};
