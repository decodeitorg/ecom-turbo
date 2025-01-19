import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import User from '@/models/User';
import { TokenType } from '@/common/types';
export const GET: APIRoute = async ({ request, redirect }) => {
  try {
    let userData = await apiAuthGuard(request, [
      'Customer',
      'Admin',
      'SuperAdmin',
    ]);

    const _id = userData._id;

    // Fetch user data from the database
    const user: TokenType = await User.findById(
      _id,
      'name email phone image role',
    ); //match token type

    return response(user, 'Login successful', 200);
  } catch (error) {
    return response(null, 'Unauthorized', 500);
  }
};
