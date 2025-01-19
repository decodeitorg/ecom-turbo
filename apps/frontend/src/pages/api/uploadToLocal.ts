import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const POST: APIRoute = async ({ request }) => {
   try {
      const formData = await request.formData();
      const file = formData.get('file');
      if (file instanceof File) {
         try {
            let filenameParts = file.name.split('.');
            let name = encodeURIComponent(`${new Date().toISOString()}-${filenameParts.slice(0, -1).join('.')}`);
            name = name.replace(/[^a-zA-Z0-9]/g, '');
            let extension = filenameParts[filenameParts.length - 1];
            let filename = `${name}.${extension}`;

            let MODE = import.meta.env.MODE;

            // const filePath = path.join('public', 'images', 'product', filename);
            const filePath =
               MODE === 'development'
                  ? path.join('public', 'images', 'product', filename)
                  : path.join('dist', 'client', 'images', 'product', filename);

            await saveFileToLocalStorage(file, filePath);
            return new Response(JSON.stringify({ url: `/images/product/${filename}` }), {
               status: 200,
               headers: {
                  'Content-Type': 'application/json',
               },
            });
         } catch (error) {
            console.error('Error saving file to local storage:', error);
            return new Response('Error uploading file', {
               status: 500,
               headers: {
                  'Content-Type': 'application/json',
               },
            });
         }
      } else {
         return new Response('No file uploaded', {
            status: 400,
            headers: {
               'Content-Type': 'application/json',
            },
         });
      }
   } catch (error) {
      console.error('Error handling file upload:', error);
      return new Response('Error uploading file', {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
      });
   }
};

async function saveFileToLocalStorage(file: File, filePath: string): Promise<void> {
   try {
      const fileData = await file.arrayBuffer();
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, Buffer.from(fileData));
   } catch (error) {
      console.error('Error saving file to local storage:', error);
      throw error;
   }
}
