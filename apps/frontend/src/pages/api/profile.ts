import User from '@/models/User.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';

export type UserProfileDataType = {
  name: string;
  phone: string;
  image: string;
};

export type UserPasswordType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type payloadProfileUpdatePayloadType = {
  type: 'profile' | 'password';
  data: UserProfileDataType | UserPasswordType;
};

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const userData = await apiAuthGuard(request, [
      'Customer',
      'Admin',
      'SuperAdmin',
    ]);

    const payload: payloadProfileUpdatePayloadType = await request.json();

    switch (payload.type) {
      case 'password': {
        const data = payload.data as UserPasswordType;

        if (data.newPassword.length < 8)
          return response(
            null,
            'Password Must Be gretter than or equal to 8',
            400,
          );
        if (data.newPassword !== data.confirmPassword) {
          return response(null, 'Password doesent match', 400);
        }

        if (!data.currentPassword) {
          return response(null, 'Current password is required', 400);
        }

        const currentPasswordFromDb = await User.findById(
          userData._id,
          'password',
        );

        let isPasswordValid = await bcrypt.compare(
          data.currentPassword,
          currentPasswordFromDb.password,
        );

        if (!isPasswordValid) {
          return response(null, 'Current password not match', 400);
        } else {
          const password = await bcrypt.hash(data.newPassword, 10);
          await User.findOneAndUpdate(
            {
              _id: userData._id,
            },
            { password },
            { new: false },
          );
        }
        break;
      }

      case 'profile': {
        const data = payload.data as UserProfileDataType;
        await User.findOneAndUpdate(
          {
            _id: userData._id,
          },
          {
            ...data,
            phone: {
              number: data.phone,
              verified: false,
              otp: '',
            },
          },
          { new: false },
        );
        break;
      }
    }

    return response({}, 'Profile Updated', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};
