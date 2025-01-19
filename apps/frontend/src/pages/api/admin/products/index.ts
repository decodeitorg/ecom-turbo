import Product from '@/models/Product.ts';
import { populateVariantsAttributes } from '@/utils/pipeline';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import mongoose from 'mongoose';

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    let searchParams = new URLSearchParams(url.searchParams);
    let category = searchParams.get('category');
    let price = searchParams.get('price'); //log or high for sorting
    let published = searchParams.get('published');
    let search = searchParams.get('search');

    let page = parseInt(url.searchParams.get('page') || '1');
    let limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = Number((page - 1) * limit);

    let matchStage: any = {};
    let sortStage: any = { createdAt: -1 };
    let searchStage: any = {};

    if (category) {
      matchStage['category'] = new mongoose.Types.ObjectId(category);
    }
    if (published) {
      matchStage['status'] = published;
    }
    if (price) {
      if (price === 'low') {
        sortStage = { 'prices.originalPrice': 1 };
      } else if (price === 'high') {
        sortStage = { 'prices.originalPrice': -1 };
      }
    }
    if (search) {
      searchStage['$or'] = [{ name: { $regex: `${search}`, $options: 'i' } }];
    }

    let data = await Product.aggregate([
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
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
              },
            },
            {
              $unwind: '$category',
            },

            ...populateVariantsAttributes(),

            {
              $project: {
                name: 1,
                slug: 1,
                logo: 1,
                shortDescription: 1,
                description: 1,
                category: {
                  _id: 1,
                  name: 1,
                },
                hasVariants: 1,
                variants: 1,
                attributeDetails: 1,
                variantsAttributes: 1,
                variantsAttributesPopulated: 1,
                isPublished: 1,
                images: 1,
                tag: 1,
                price: 1,
                salePrice: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
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

    return response(data?.[0], 'success', 200);
  } catch (err) {
    console.log('🚀 ~ constGET:APIRoute= ~ err:', err);
    return response({}, err?.message, 500);
  }
};
