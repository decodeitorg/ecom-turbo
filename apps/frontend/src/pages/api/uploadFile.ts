import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import https from 'https';
import sharp from 'sharp';

export const POST: APIRoute = async ({ request }) => {
   try {
      const formData = await request.formData();
      const file = formData.get('file');
      const compress = formData.get('compress'); //use this to compress the image

      if (file instanceof File) {
         try {
            const filename = encodeURIComponent(`${new Date().toISOString()}-${file.name}`);
            let data = await uploadFileToBunnyStorage(file, filename, compress);
            return new Response(JSON.stringify(data), {
               status: 200,
               headers: { 'Content-Type': 'application/json' },
            });
         } catch (error) {
            console.error('Error uploading file to Bunny Storage:', error);
            return new Response('Error uploading file', {
               status: 500,
               headers: { 'Content-Type': 'application/json' },
            });
         }
      } else {
         return new Response('No file uploaded', {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }
   } catch (error) {
      console.error('Error handling file upload:', error);
      return new Response('Error uploading file', {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
      });
   }
};

async function uploadFileToBunnyStorage(file: File, filename: string, compress: string | null) {
   try {
      const baseHostname = 'storage.bunnycdn.com';
      const region = import.meta.env.BUNNY_STORAGE_REGION || '';
      const hostname = region ? `${region}.${baseHostname}` : baseHostname;
      const storageZoneName = import.meta.env.BUNNY_STORAGE_ZONE_NAME;
      const folderName = import.meta.env.BUNNY_STORAGE_FOLDER_NAME;
      const accessKey = import.meta.env.BUNNY_STORAGE_ACCESS_KEY;

      if (!storageZoneName || !accessKey) {
         throw new Error('Missing Bunny Storage configuration');
      }

      let qualityCompression = 10;
      if (compress && parseInt(compress) > 0 && parseInt(compress) <= 100) {
         qualityCompression = parseInt(compress);
      } else {
         if (file.size > 1000000) {
            // 1MB
            qualityCompression = 10;
         } else if (file.size > 500000) {
            // 500KB
            qualityCompression = 20;
         } else if (file.size > 250000) {
            // 250KB
            qualityCompression = 30;
         } else if (file.size > 100000) {
            // 100KB
            qualityCompression = 40;
         } else if (file.size > 50000) {
            // 50KB
            qualityCompression = 60;
         } else if (file.size > 25000) {
            // 25KB
            qualityCompression = 100;
         }
      }

      const processedBuffer = await sharp(await file.arrayBuffer())
         .resize(1440)
         .webp({ quality: qualityCompression })
         .toBuffer();

      const cdnBaseUrl = import.meta.env.BUNNY_STORAGE_CDN_BASE_URL;
      const webpFilename = filenameGerator(filename);

      const options = {
         method: 'PUT',
         host: hostname,
         path: `/${storageZoneName}/${folderName ? folderName + '/' : ''}${webpFilename}`,
         headers: {
            AccessKey: accessKey,
            'Content-Type': 'image/webp', // Set the appropriate content type for WebP
         },
      };

      return new Promise((resolve, reject) => {
         const req = https.request(options, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
               resolve({ url: `${cdnBaseUrl}/${folderName ? folderName + '/' : ''}${webpFilename}` });
            } else {
               reject(new Error(`Failed to upload file: ${res.statusCode} - ${res.statusMessage}`));
            }
         });

         req.on('error', (error) => {
            reject(error);
         });

         req.write(processedBuffer);
         req.end();
      });
   } catch (error) {
      console.error('Error uploading file to Bunny Storage:', error);
      throw error;
   }
}

let filenameGerator = (filename: string) => {
   //first remove the .ext and keep the rest of the filename, there can be multiple dots in the filename
   let name = filename.split('.').slice(0, -1).join('.');
   //then remove all non-alphanumeric characters
   name = name.replace(/[^a-zA-Z]/g, '').toLowerCase();
   //current time in milliseconds
   name = name + '-' + Date.now();
   //then add the extension back
   name = name + '.webp';
   return name;
};
