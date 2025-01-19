import Category from '@/models/Category.ts';
import Product from '@/models/Product.ts';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
   let xml = '<?xml version="1.0" encoding="UTF-8"?>';
   xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

   //add root url
   xml += '<url>';
   xml += `<loc>${import.meta.env.PUBLIC_SITE}</loc>`;
   xml += `<priority>1.0</priority>`;
   xml += `<changefreq>daily</changefreq>`;
   xml += '</url>';

   try {
      let raute_categor = await categoriesTo();

      raute_categor?.forEach((route) => {
         xml += '<url>';
         xml += `<loc>${import.meta.env.PUBLIC_SITE + '/products/' + encodeURIComponent(route)}</loc>`;
         xml += `<priority>0.5</priority>`;
         xml += `<changefreq>weekly</changefreq>`;
         xml += '</url>';
      });

      let raute_product = await productTo();

      raute_product?.forEach((product) => {
         xml += '<url>';
         xml += `<loc>${import.meta.env.PUBLIC_SITE + '/product/' + encodeURIComponent(product.slug)}</loc>`;
         xml += `<lastmod>${product.updatedAt.toISOString()}</lastmod>`;
         xml += `<priority>0.5</priority>`;
         xml += `<changefreq>weekly</changefreq>`;
         xml += '</url>';
      });
   } catch {
      console.log('Error in sitemap');
   }

   [`/about-us/`, `/customer-service/`, `/exchange/`, `/privacy-policy/`, `/shop-address/`, `/terms-of-service/`, `/warranty/`].forEach((route) => {
      xml += '<url>';
      xml += `<loc>${import.meta.env.PUBLIC_SITE + route}</loc>`;
      xml += `<priority>0.5</priority>`;
      xml += `<changefreq>weekly</changefreq>`;
      xml += '</url>';
   });

   xml += '</urlset>';

   return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' },
   });
};

const categoriesTo = async () => {
   try {
      const categories = await Category.find({}, { name: 1, parentId: 1 });
      const categoryList = ParentAndChildrenCategory(categories);
      const routes = [];

      const traverse = (category, currentRoute) => {
         const name = category.name || '';
         const route = currentRoute + '/' + name;

         routes.push(route);

         if (Array.isArray(category.children)) {
            category.children.forEach((child) => {
               traverse(child, route);
            });
         }
      };

      categoryList.forEach((category) => {
         traverse(category, '');
      });

      return routes.filter((route) => route !== '/');
   } catch (err) {
      return [];
   }
};

var ParentAndChildrenCategory = (categories, parentId = null) => {
   const categoryList = [];
   let Categories;
   if (parentId == null) {
      Categories = categories.filter((cat) => cat.parentId == undefined);
   } else {
      Categories = categories.filter((cat) => cat.parentId == parentId);
   }
   for (let cate of Categories) {
      categoryList.push({ name: cate.name, children: ParentAndChildrenCategory(categories, cate._id) });
   }
   return categoryList;
};

const productTo = async () => {
   try {
      const products = await Product.find({}, { slug: 1, updatedAt: 1 });
      return products;
   } catch (err) {
      console.error('Error fetching products or attributes:', err);
      return [];
   }
};
