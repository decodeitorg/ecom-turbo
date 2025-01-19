import Attribute from '@/models/Attribute.ts';
import Product from '@/models/Product';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import { slugify } from '@/utils/toolFunctins.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, params, request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const allAttributes = await Attribute.find();

    return response(allAttributes, 'All attributes', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const { name, type, color } = await request.json();

    let attribute = new Attribute({
      name,
      type,
      slug: slugify(name),
    });
    await attribute.save();

    return response(attribute, 'Attribute created successfully', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const { attributeId, name, variants } = await request.json();

    let attribute = await Attribute.findById(attributeId);

    if (!attribute) return response({}, 'Attribute not found', 404);

    if (name) {
      attribute.name = name;
      attribute.slug = slugify(name);
    }
    if (variants && variants.length > 0) {
      attribute.variants = variants;
    }
    await attribute.save();

    return response(attribute, 'Attribute updated successfully', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const { attributeId } = await request.json();

    const productsUsingAttribute = await Product.find({
      [`variantsAttributes.${attributeId}`]: { $exists: true },
    });

    if (productsUsingAttribute.length > 0) {
      return response(
        {},
        `It is used in ${productsUsingAttribute[0].name} and ${productsUsingAttribute.length - 1} other products`,
        400,
      );
    }

    await Attribute.findByIdAndDelete(attributeId);

    return response({}, 'Attribute deleted successfully', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};
