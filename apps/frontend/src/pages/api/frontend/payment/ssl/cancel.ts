import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, url, params }) => {
   let body = await request.json();
   return response({}, 'Hello from /api/frontend/payment/cancel', 200);
};
