import Order from '@/models/Order.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

interface CallbackData {
  consignment_id: number;
  invoice: string;
  status:
    | 'pending'
    | 'delivered'
    | 'partial_delivered'
    | 'cancelled'
    | 'unknown';
  cod_amount: number;
  delivery_charge: number;
  updated_at: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: CallbackData = await request.json();

    // Find the order using the invoice as order_id
    const order = await Order.findById(data.invoice);

    if (!order) {
      return response({}, 'Order not found', 404);
    }

    // Update order with Steadfast data
    order.steadFast = {
      ...order.steadFast,
      status: data.status,
    };

    // Update order status based on Steadfast status
    switch (data.status) {
      case 'delivered':
        order.status = 'delivered';
        break;
      case 'cancelled':
        order.status = 'cancelled';
        break;
    }

    order.steadFast.status = data.status;

    await order.save();

    return response({ success: true }, 'Callback processed successfully', 200);
  } catch (err) {
    console.error('Error processing Steadfast callback:', err);
    return response({}, 'Error processing callback', 500);
  }
};
