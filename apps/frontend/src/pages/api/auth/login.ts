import { TokenType } from '@/common/types';
import User from '@/models/User.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    let { email, password } = await request.json();
    console.log('🚀 ~ constPOST:APIRoute= ~ email, password:', email, password);

    if (!email || !password) {
      return response({}, 'Email and password are required', 400);
    }

    let user = await User.findOne({ email: email });
    console.log('🚀 ~ constPOST:APIRoute= ~ user:', user);

    if (!user) {
      return response({}, 'User not found', 400);
    }

    let userHashedPasswordDB = user.password;
    console.log(
      '🚀 ~ constPOST:APIRoute= ~ userHashedPasswordDB:',
      userHashedPasswordDB,
    );
    let isPasswordValid = await bcrypt.compare(password, userHashedPasswordDB);
    console.log('🚀 ~ constPOST:APIRoute= ~ isPasswordValid:', isPasswordValid);
    if (!isPasswordValid) {
      return response({}, 'Invalid password', 400);
    }

    let secretKey = import.meta.env.JWT_SECRET;
    console.log('🚀 ~ constPOST:APIRoute= ~ secretKey:', secretKey);
    let payload: TokenType = {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      phone: user.phone || {
        number: '',
        verified: false,
        otp: '',
      },
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });
    console.log('🚀 ~ constPOST:APIRoute= ~ token:', token);

    cookies.set('token', token, {
      path: '/',
      httpOnly: true, //this is important for security reasons to prevent XSS attacks and cookie theft
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
      secure: true,
      sameSite: 'strict',
    });

    return response({ token, userData: payload }, 'success', 200);
  } catch (error) {
    console.log('🚀 ~ constPOST:APIRoute= ~ error:', error);
    return response({}, error.message, 500);
  }
};
