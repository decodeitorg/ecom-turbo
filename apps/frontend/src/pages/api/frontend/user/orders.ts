import Order from '@/models/Order.ts';
import Product from '@/models/Product.ts';
import Setting from '@/models/Setting.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import mapError from '@/utils/errorMapping.ts';
import sslcz from '@/utils/payment/sslCommerz.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, redirect }) => {
   try {
      let user = await apiAuthGuard(request, ['Customer']);
      let orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
      return response(orders, 'Orders Fetched Successfully', 200);
   } catch (e) {
      return response({}, mapError(e), 400);
   }
};
