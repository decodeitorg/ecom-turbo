import type { APIRoute } from 'astro';

const robotsTxt = `
User-agent: *
Allow: /

Disallow: /admin
Disallow: /api
Disallow: /cart
Disallow: /checkout
Disallow: /login
Disallow: /profile
Disallow: /search


Sitemap: ${new URL('sitemap.xml', import.meta.env.PUBLIC_SITE).href}
`.trim();

export const GET: APIRoute = () => {
   return new Response(robotsTxt, {
      headers: {
         'Content-Type': 'text/plain; charset=utf-8',
      },
   });
};
