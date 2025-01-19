import Order from '@/models/Order.ts';
import Product from '@/models/Product.ts';
import sslcz from '@/utils/payment/sslCommerz.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, url, params, redirect }) => {
   //payment success coming form a php server
   //data is not in json format
   let body = await request.formData();
   //convert the form data to json
   const data = {};
   for (const entry of body.entries()) {
      data[entry[0]] = entry[1];
   }

   let res = await sslcz.validate(data);

   const isPaymentSuccess = (res?.status === 'VALIDATED' || res?.status === 'VALID') && res?.tran_id;
   if (isPaymentSuccess) {
      //update the order status
      // await Order.findByIdAndUpdate(res?.tran_id, { paymentStatus: 'Success' });
      let order = await Order.findById(res?.tran_id);
      let cartItems = order?.cartItems;

      //PHASE 4 : STOCK UPDATE
      for (let i = 0; i < cartItems.length; i++) {
         let product = cartItems[i];
         let db_product = await Product.findById(product?._id);
         if (!product?.hasVariant) {
            if (db_product?.hasStock === true) {
               db_product.stock -= product?.quantity;
               await db_product.save();
            }
            db_product.totalPurchased += product?.quantity;
         } else if (product?.hasVariant) {
            let variant_id = product?.variant_id;
            let variant_index = db_product?.variants?.findIndex((v) => v.id === variant_id);
            if (db_product?.variants[variant_index]?.hasStock === true) {
               db_product.variants[variant_index].stock -= product?.quantity;
               db_product.markModified('variants'); // Mark the variants array as modified
               await db_product.save();
            }
            db_product.totalPurchased += product?.quantity;
         }
      }

      await Order.findByIdAndUpdate(res?.tran_id, { paymentStatus: 'success' });
   } else {
      await Order.findByIdAndUpdate(res?.tran_id, { paymentStatus: 'failed' });
   }

   return redirect('/user/orders?paymentStatus=success');
};
