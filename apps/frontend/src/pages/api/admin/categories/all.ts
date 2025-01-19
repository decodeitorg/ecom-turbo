import Category from '@/models/Category.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      const categories = await Category.find({}).sort({ _id: -1 });
      return response(categories, 'Categories found', 200);
   } catch (err: any) {
      return response({}, err?.message, 500);
   }
};
