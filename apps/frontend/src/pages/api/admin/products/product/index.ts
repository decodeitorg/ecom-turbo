import Attribute from '@/models/Attribute.ts';
import Product from '@/models/Product.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      let _id = url.searchParams.get('_id');

      let product = await Product.findOne({
         _id,
      });

      return response(product, 'Attributes fetched successfully', 200);
   } catch (error: any) {
      return response({}, error.message, 500);
   }
};
export const POST: APIRoute = async ({ request, url }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      const data = await request.json();
      if (!data?.subCategory) delete data.subCategory;
      if (!data?.leafCategory) delete data.leafCategory;
      const product = new Product(data);
      await product.save();
      return response(null, 'success', 200);
   } catch (err) {
      return response({}, err?.message, 500);
   }
};

export const PUT: APIRoute = async ({ request, url }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      const data = await request.json();
      if (!data?.subCategory) delete data.subCategory;
      if (!data?.leafCategory) delete data.leafCategory;
      const product = await Product.findOneAndUpdate({ _id: data._id }, data, { new: false });
      return response(product, 'success', 200);
   } catch (err) {
      return response({}, err?.message, 500);
   }
};

export const DELETE: APIRoute = async ({ request, url }) => {
   try {
      await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

      const data = await request.json();
      const product = await Product.findOneAndDelete({ _id: data._id });
      return response(product, 'Product deleted successfully', 200);
   } catch (err) {
      return response({}, "Couldn't delete product", 500);
   }
};
