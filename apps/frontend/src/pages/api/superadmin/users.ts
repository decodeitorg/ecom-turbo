import User from '@/models/User.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import mapError from '@/utils/errorMapping.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import bcrypt from 'bcrypt';

export const GET: APIRoute = async ({ request, url }) => {
   try {
      await apiAuthGuard(request, ['SuperAdmin']);

      let searchParams = new URLSearchParams(url.searchParams);

      let search = searchParams.get('search');

      let page = parseInt(url.searchParams.get('page') || '1');
      let limit = parseInt(url.searchParams.get('limit') || '10');
      const skip = Number((page - 1) * limit);

      //..................matchStage.......................

      let matchStage: any = {};
      let role = searchParams.get('role');
      if (role === 'Customer') {
         matchStage.role = 'Customer';
      } else if (role === 'AllEmployees') {
         matchStage.role = { $in: ['Admin', 'SuperAdmin'] };
      } else if (role === 'Admin') {
         matchStage.role = 'Admin';
      } else if (role === 'SuperAdmin') {
         matchStage.role = 'SuperAdmin';
      } else {
         throw new Error('Invalid Role');
      }

      let sortStage: any = { createdAt: -1 };
      let searchStage: any = {};

      if (search) {
         searchStage['$or'] = [{ name: { $regex: `${search}`, $options: 'i' } }, { email: { $regex: `${search}`, $options: 'i' } }];
      }

      let data = await User.aggregate([
         {
            $match: matchStage,
         },
         {
            $match: searchStage,
         },
         {
            $facet: {
               docs: [
                  {
                     $project: {
                        name: 1,
                        email: 1,
                        phone: 1,
                        role: 1,
                        createdAt: 1,
                        image: 1,
                        address: 1,
                     },
                  },
                  {
                     $sort: sortStage,
                  },
                  { $skip: skip },
                  { $limit: limit },
               ],
               totalDocs: [
                  {
                     $count: 'createdAt',
                  },
               ],
            },
         },
         {
            $project: {
               docs: 1,
               totalPages: {
                  $ceil: {
                     $divide: [{ $first: '$totalDocs.createdAt' }, limit],
                  },
               },
               totalDocs: { $first: '$totalDocs.createdAt' },
            },
         },
         {
            $addFields: {
               page: page,
               limit: limit,
            },
         },
      ]);

      return response(data[0], 'success', 200);
   } catch (err) {
      return response({}, err?.message, 500);
   }
};

export const POST: APIRoute = async ({ request, url }) => {
   try {
      await apiAuthGuard(request, ['SuperAdmin']);
      const data = await request.json();
      data.password = await bcrypt.hash(data.password, 10);
      const user = new User(data);
      await user.save();
      return response(null, 'success', 200);
   } catch (err) {
      return response({}, err?.message, 500);
   }
};

export const PUT: APIRoute = async ({ request, url }) => {
   try {
      await apiAuthGuard(request, ['SuperAdmin']);
      const data = await request.json();

      let payload = {};

      if (data.name) {
         payload['name'] = data.name;
      }
      if (data.email) {
         payload['email'] = data.email;
      }
      if (data.phone) {
         payload['phone'] = data.phone;
      }
      if (data.role) {
         payload['role'] = data.role;
      }
      if (data.image) {
         payload['image'] = data.image;
      }
      if (data.password) {
         payload['password'] = await bcrypt.hash(data.password, 10);
      }

      await User.findOneAndUpdate(
         {
            _id: data._id,
         },
         payload,
         { new: false },
      );

      return response({}, 'User Updated', 200);
   } catch (err) {
      return response({}, err?.message, 500);
   }
};

export const DELETE: APIRoute = async ({ request, url }) => {
   try {
      await apiAuthGuard(request, ['SuperAdmin']);
      const data = await request.json();

      await User.findOneAndDelete({ _id: data._id });
      return response(null, 'User Deletec Successfully', 200);
   } catch (err) {
      mapError(err);
      return response({}, mapError(err), 500);
   }
};
