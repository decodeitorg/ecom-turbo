import Attribute from '@/models/Attribute.ts';
import Product from '@/models/Product.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const PUT: APIRoute = async ({ request, url }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const data = await request.json();
    let { _id, variantId, price, salePrice, status } = data;

    const product = await Product.findOne({ _id });
    if (!product) {
      return response({}, 'Product not found', 404);
    }

    let variants = product.variants;

    if (salePrice <= 0) {
      return response({}, 'Sale price cannot be less than or equal to 0', 400);
    }

    variants = variants.map((variant) => {
      if (variant.id === variantId) {
        return {
          ...variant,
          price: price >= 0 ? price : variant.price,
          salePrice: salePrice ? salePrice : variant.salePrice,
          status: status ? status : variant.status,
        };
      } else {
        return variant;
      }
    });

    product.variants = variants;

    await product.save();

    return response(product, 'success', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};
