import { response } from '@/utils/response';

export const POST = async ({ request, cookies }) => {
  cookies.delete('token', {
    path: '/',
  });
  return response({}, 'success', 200);
};
