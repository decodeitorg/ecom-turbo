import Category from '@/models/Category.ts';
import Product from '@/models/Product';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import ParentAndChildrenCategory from '@/utils/category.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    // await apiAuthGuard(request, ['Admin', 'SuperAdmin']);
    const categories = await Category.find({});
    const categoryList = ParentAndChildrenCategory(categories);
    if (categoryList.length < 1)
      return response([], 'No categories found', 404);
    return response(categoryList, 'Categories found', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);
    const { name, parentId, description, icon, youtubeLink } =
      await request.json();
    console.log(
      '🚀 ~ constPOST:APIRoute= ~ { name, parentId, description, icon, youtubeLink }:',
      { name, parentId, description, icon, youtubeLink },
    );
    if (parentId) {
      const parentCategory = await Category.findById(parentId);
      if (parentCategory) {
        let newCategory = new Category({
          name,
          parentId,
          parentName: parentCategory.name,
          description,
          icon,
          youtubeLink,
        });
        await newCategory.save();
      }
    } else {
      let newCategory = new Category({
        name,
        description,
        icon,
        youtubeLink,
      });
      await newCategory.save();
    }

    // const savedCategory = await newCategory.save();
    return response({}, 'Category created', 201);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);
    const {
      _id,
      name,
      description,
      icon,
      youtubeLink,
      status,
      specification,
      specificationType,
      attribute,
      attributeType,
    } = await request.json();
    console.log('🚀 ~ constPUT:APIRoute= ~ youtubeLink:', youtubeLink);
    const updatedCategory = await Category.findOneAndUpdate(
      { _id },
      {
        name,
        description,
        icon,
        youtubeLink,
        status,
        specification,
        specificationType,
        attribute,
        attributeType,
      },
      { new: false },
    );

    if (!updatedCategory) return response({}, 'Category not found', 404);
    return response({}, 'Category updated', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};

export const DELETE: APIRoute = async ({ url, request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const _id = await request.json();

    const count = await Product.countDocuments({
      $or: [{ category: _id }, { subCategory: _id }, { leafCategory: _id }],
    });
    if (count != 0) {
      return response(
        {},
        `Category is used in ${count} products.Delete them first`,
        400,
      );
    } else {
      const category = await Category.findByIdAndDelete(_id);
      return response(category, 'Category deleted', 200);
    }
  } catch (err) {
    return response({}, err?.message, 500);
  }
};
