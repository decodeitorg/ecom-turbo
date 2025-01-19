import { TokenType } from '@/common/types';
import { app } from '@/firebase/server.ts';
import User from '@/models/User.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import { getAuth } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = getAuth(app);
  let secretKey = import.meta.env.JWT_SECRET;

  try {
    const body = await request.json();

    const idToken = body.token;

    /* Verify id token */
    let user = null;
    try {
      user = await auth.verifyIdToken(idToken);
    } catch (error) {
      throw new Error('Invalid token');
    }

    //mongoDB

    let userExists = await User.findOne({ email: user.email });
    if (userExists) {
      let userdata = userExists;
      let payload: TokenType = {
        _id: userdata._id,
        name: userdata.name,
        email: userdata.email,
        image: userdata.image,
        role: userdata.role,
        phone: userdata.phone || {
          number: '',
          verified: false,
          otp: '',
        },
      };
      const token = await jwt.sign(payload, secretKey, {
        expiresIn: '30d',
      });

      cookies.set('token', token, {
        path: '/',
        httpOnly: true, //this is important for security reasons to prevent XSS attacks and cookie theft
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
        secure: true,
        sameSite: 'strict',
      });

      return response({ token, userData: payload }, 'success', 200);
    } else {
      let userdata = await User.create({
        _id: user._id,
        email: user.email,
        image: user.picture,
        name: user.name,
        role: 'Customer',
      });
      await userdata.save();
      let payload: TokenType = {
        _id: userdata._id,
        name: userdata.name,
        email: userdata.email,
        image: userdata.image,
        role: userdata.role,
        phone: userdata.phone || {
          number: '',
          verified: false,
          otp: '',
        },
      };

      const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });

      cookies.set('token', token, {
        path: '/',
        httpOnly: true, //this is important for security reasons to prevent XSS attacks and cookie theft
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
        secure: true,
        sameSite: 'strict',
      });

      return response({ token, userData: payload }, 'success', 200);
    }
  } catch (error) {
    return response({}, error.message, 500);
  }
};
