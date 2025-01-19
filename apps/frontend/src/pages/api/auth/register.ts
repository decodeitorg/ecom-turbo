import User from '@/models/User.ts';
import { response } from '@/utils/response.ts';
import type { TokenType } from '@/utils/types.ts';
import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const POST: APIRoute = async ({ request }) => {
   try {
      let { name, email, password, confirmPassword } = await request.json();

      if (!name || !email || !password || !confirmPassword) {
         return response({}, 'Email, password and confirm password are required', 400);
      }

      if (password !== confirmPassword) {
         return response({}, 'Password and confirm password do not match', 400);
      }

      let existingUser = await User.findOne({ email: email });

      if (existingUser) {
         return response({}, 'User already exists', 400);
      }

      let hashedPassword = await bcrypt.hash(password, 10);

      let user = new User({
         name: name,
         email: email,
         password: hashedPassword,
         // Add other fields as necessary
      });

      await user.save();

      let secretKey = import.meta.env.JWT_SECRET;
      let payload: TokenType = {
         _id: user._id,
         name: user.name,
         role: user.role,
         image: user.image,
         email: user.email,
         phone: user.phone,
      };
      const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });

      return response({ token, userData: payload }, 'success', 200);
   } catch (error) {
      return response({}, error.message, 500);
   }
};
