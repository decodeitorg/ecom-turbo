import Setting from '@/models/Setting.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export interface SettingType {
  perKgFee: number;
  takeShippingFeeAdvance: boolean;
  shippingLocationFee: {
    location: string;
    fee: number;
  }[];
  sslCommerz: {
    isSslCommerzEnabled: boolean;
    storeId: string;
    storePassword: string;
    isLive: boolean;
  };
  steadFast: {
    isSteadfastEnabled: boolean;
    apiKey: string;
    secretKey: string;
  };
  facebookPixel: {
    pixelId: string;
    accessToken: string;
    test_event_code: string;
  };
  timeZone: string;
}

export const GET: APIRoute = async ({ request, url }) => {
  try {
    let user = await apiAuthGuard(request, ['SuperAdmin', 'Admin']);
    if (user.role === 'SuperAdmin') {
      let setting = await Setting.findOne();
      if (!setting) {
        setting = new Setting();
        await setting.save();
      }
      return response(setting, 'Data fetched successfully', 200);
    } else if (user.role === 'Admin') {
      let setting = await Setting.findOne();
      let data = {
        steadFast: {
          isSteadfastEnabled: setting?.steadFast?.isSteadfastEnabled,
        },
      };

      return response(data, 'Data fetched successfully', 200);
    }
  } catch (err: any) {
    return response({}, err?.message, 500);
  }
};

export const POST: APIRoute = async ({ request, url }) => {
  try {
    await apiAuthGuard(request, ['SuperAdmin']);
    const body = await request.json();

    await Setting.updateOne({}, body, { upsert: true });

    return response({}, 'Settings updated successfully', 200);
  } catch (err: any) {
    return response({}, err?.message, 500);
  }
};
