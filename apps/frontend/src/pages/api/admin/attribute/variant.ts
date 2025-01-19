import Attribute from '../../../../models/Attribute';
import Product from '../../../../models/Product';
import { apiAuthGuard } from '@/utils/authGaurd';
import { response } from '@/utils/response';
import type { APIRoute } from 'astro';
import mongoose from 'mongoose';

export const POST: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const body = await request.json();
    let { attributeId, name, color } = body;

    if (!name) return response(null, 'Variant name is required', 400);
    if (!attributeId) return response(null, 'Attribute id is required', 400);
    if (mongoose.Types.ObjectId.isValid(attributeId) === false)
      return response(null, 'Invalid attribute id', 400);

    let attribute = await Attribute.findById(attributeId);
    attribute.variants.push({ name, color });
    await attribute.save();
    return response(
      { variants: attribute?.variants },
      'Attribute created successfully',
      200,
    );
  } catch (err) {
    return response(null, err.message, 500);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const body = await request.json();
    let { name, attributeId, variantId } = body;

    if (!name) return response(null, 'Variant name is required', 400);
    if (!attributeId) return response(null, 'Attribute id is required', 400);
    if (!variantId) return response(null, 'Variant id is required', 400);
    if (
      mongoose.Types.ObjectId.isValid(attributeId) === false ||
      mongoose.Types.ObjectId.isValid(variantId) === false
    )
      return response(null, 'Invalid attribute or variant id', 400);

    let attribute = await Attribute.findById(attributeId);
    let variant = attribute.variants.id(variantId);
    variant.name = name;
    await attribute.save();
    return response({}, 'Attribute updated successfully', 200);
  } catch (err) {
    return response(null, err.message, 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const body = await request.json();
    let { attributeId, variantId } = body;

    if (!attributeId) return response(null, 'Attribute id is required', 400);
    if (!variantId) return response(null, 'Variant id is required', 400);
    if (
      mongoose.Types.ObjectId.isValid(attributeId) === false ||
      mongoose.Types.ObjectId.isValid(variantId) === false
    )
      return response(null, 'Invalid attribute or variant id', 400);

    const productsUsingAttribute = await Product.find({
      [`variantsAttributes.${attributeId}`]: { $exists: true },
    });

    if (productsUsingAttribute.length > 0) {
      //check if any product is using this variantId
      const productsUsingVariant = productsUsingAttribute.filter((product) =>
        product.variantsAttributes[attributeId].includes(variantId),
      );

      if (productsUsingVariant.length > 0) {
        if (productsUsingVariant.length === 1) {
          return response(
            null,
            `This variant is used in ${productsUsingVariant[0].name}`,
            400,
          );
        } else {
          return response(
            null,
            `This variant is used in ${productsUsingVariant[0].name} and ${productsUsingVariant.length - 1} other products`,
            400,
          );
        }
      }
    }

    let attribute = await Attribute.findById(attributeId);
    attribute.variants.pull(variantId);
    await attribute.save();
    return response({}, 'Attribute deleted successfully', 200);
  } catch (err) {
    return response(null, err.message, 500);
  }
};
