import Product from '@/models/Product.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

let colorsList = ['Black', 'Blue', 'Brown', 'Gold', 'Green', 'Grey', 'Orange', 'Pink', 'Purple', 'Red', 'Silver', 'White', 'Yellow'];
let pickCOlorRandom = () => {
   return colorsList[Math.floor(Math.random() * colorsList.length)];
};
export const GET: APIRoute = async () => {
   //find all product where varint lentgh is greater than 1
   let products = await Product.find({ variants: { $exists: true, $not: { $size: 0 } } }, 'variants');
   // merger variant array
   products = products
      .map((product) => {
         return product.variants;
      })
      .flat();
   let color = new Set();

   products.forEach((product) => {
      let c = product['65d40d2a520d14aaac1a6998'];

      if (!!c) {
         color.add(c);
      }
   });
   let colorArray = Array.from(color);
   colorArray = colorArray.map((color, index) => {
      return {
         name: pickCOlorRandom() + index,
         status: 'show',
         _id: {
            $oid: color,
         },
      };
   });
   return response(colorArray, 'Connection function called', 200);
};
