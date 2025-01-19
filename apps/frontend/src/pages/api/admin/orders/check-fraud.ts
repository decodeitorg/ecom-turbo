import Order from '@/models/Order.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import { mongo } from 'mongoose';

//https://terminal.decodeit.org/api/check-fraud?phone=01614125114

const fraudCheckApi = 'https://terminal.decodeit.org/api/check-fraud';

export const POST: APIRoute = async ({ request, url, params }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    let body = await request.json();
    const _id = body._id;

    let order = await Order.findById(_id, { phoneNumber: 1 });
    const phone = order?.phoneNumber;

    const fraudStatus = await fetch(fraudCheckApi + '?phone=' + phone);
    const fraudStatusData = await fraudStatus.json();

    console.log(
      '🚀 ~ constPOST:APIRoute= ~ fraudStatusData:',
      fraudStatusData?.data,
    );

    let upd = await Order.updateOne(
      { _id: _id },
      { $set: { fraudStatus: fraudStatusData?.data } },
    );

    return response(fraudStatusData, 'Fraud status fetched successfully!', 200);
  } catch (err) {
    return response({}, 'Internal Server Error!', 500);
  }
};
