import Category from '@/models/Category.ts';
import Product from '@/models/Product.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, request }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      const _id = url.searchParams.get('_id');
      const category = await Category.findById(_id);
      return response(category, 'Categories found', 200);
   } catch (err) {
      return response({}, err?.message, 500);
   }
};


