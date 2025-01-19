import Product from '@/models/Product.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  let all_id = await Product.find({}).select('_id').exec();

  await Promise.all(
    all_id.map(async (id) => {
      let product = await Product.findById(id, 'hasVariants imageVariant attributes variantsAttributes');
      let d = JSON.parse(JSON.stringify(product));

      console.log('🚀 ~ all_id.map ~ d:', d.attributes);

      // Ensure `d.imageVariant` is an array and has at least one element
      if (Array.isArray(d.imageVariant) && d.imageVariant.length > 0) {
        await Product.updateOne(
          { _id: id },
          {
            $set: {
              imageVariant: {
                type: 'different',
                variantId: d.imageVariant[0], // Ensure this exists
              },
              variantsAttributes: d.attributes, // Updating attributes to variantsAttributes
            },
          },
        );
      }

      let productt = await Product.findById(id, 'hasVariants imageVariant attributes variantsAttributes');
      let dd = JSON.parse(JSON.stringify(productt));
    }),
  );

  return new Response('Hello World', {
    headers: {
      'content-type': 'application/json',
    },
  });
};
