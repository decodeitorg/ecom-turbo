import { VariantUnwindedProductType } from '@/common/types';
import { priceRange } from '@/const/price.ts';
import Product from '@/models/Product';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import mongoose from 'mongoose';

export const GET: APIRoute = async ({ params, url }) => {
  let page = parseInt(url.searchParams.get('page') || '1');
  let limit = parseInt(url.searchParams.get('limit') || '10');
  const skip = Number((page - 1) * limit);

  const category = url.searchParams.get('category');
  const subCategory = url.searchParams.get('subCategory');
  const leafCategory = url.searchParams.get('leafCategory');

  // .....................MATCH STAGE.....................
  const matchStage: any = {};
  //category
  if (category) {
    matchStage['category'] = new mongoose.Types.ObjectId(category);
  }
  if (subCategory) {
    matchStage['subCategory'] = new mongoose.Types.ObjectId(subCategory);
  }
  if (leafCategory) {
    matchStage['leafCategory'] = new mongoose.Types.ObjectId(leafCategory);
  }

  //stock
  const stock = url.searchParams.get('stock');

  // filter_price
  let filter_price = url.searchParams.get('filter_price');
  let minToMax = filter_price ? filter_price.split('-') : [];
  let minPrice = priceRange.min;
  let maxPrice = priceRange.max;
  if (minToMax.length === 2) {
    minPrice = parseInt(minToMax[0]);
    maxPrice = parseInt(minToMax[1]);
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      throw new Error('Invalid price range values');
    }
  } else if (minToMax.length === 1) {
    minPrice = parseInt(minToMax[0]);

    if (isNaN(minPrice)) {
      throw new Error('Invalid price range value');
    }
  } else if (minToMax.length > 2) {
    throw new Error('Too many values in price range');
  }

  //sort
  let sort = url.searchParams.get('sort') ?? '';
  let sortStage = {};
  if (sort) {
    if (sort === 'price') {
      sortStage = { price: 1 };
    } else if (sort === '-price') {
      sortStage = { price: -1 };
    } else if (sort === 'salePrice') {
      sortStage = { salePrice: 1 };
    } else if (sort === '-salePrice') {
      sortStage = { salePrice: -1 };
    }
  } else {
    sortStage = { createdAt: -1 };
  }

  //filter
  let filters = url.searchParams.get('filter')?.split('_') ?? [];

  //mongoDB aggregation pipeline
  let filtersFilter = () => {
    if (filters.length === 0) {
      return [];
    }
    return [
      {
        $addFields: {
          attributes_array: { $objectToArray: '$attributes' },
        },
      },
      {
        $addFields: {
          attributes_array: {
            $reduce: {
              input: '$attributes_array',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this.v'] },
            },
          },
        },
      },
      {
        $match: {
          attributes_array: { $all: filters }, // Match documents where all elements in filters are in attributes_array
        },
      },
    ];
  };

  // Fetch data from the database
  const data = await Product.aggregate([
    {
      $project: {
        name: 1,
        slug: 1,
        images: 1,
        category: 1,
        subCategory: 1,
        leafCategory: 1,
        price: 1,
        salePrice: 1,
        hasStock: 1,
        stock: 1,
        hasVariants: 1,
        variants: 1,
        status: 1,
        createdAt: 1,
        attributes: 1,
      },
    },
    {
      $match: matchStage,
    },

    ...filtersFilter(),

    // ...productFacet(minPrice, maxPrice),

    {
      $sort: sortStage,
    },

    {
      $facet: {
        docs: [{ $skip: skip }, { $limit: limit }],
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
  ]).catch((error) => {
    console.error('Error fetching products:', error);
    return [];
  });

  let products: VariantUnwindedProductType[] = data?.[0]?.docs ?? [];

  return response(
    {
      ...products,
    },
    'Product fetched successfully',
    200,
  );
};
