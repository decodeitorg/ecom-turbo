import Frontend from '@/models/Frontend.ts';
import { apiAuthGuard } from '@/utils/authGaurd.ts';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';

export type FrontendData = {
  type:
    | 'heroCarousel'
    | 'campaignImages'
    | 'featureBanner'
    | 'customerReviewImages'
    | 'siteSettings'
    | 'legalSettings'
    | 'whyChooseUs';
  data: any;
};

export const GET: APIRoute = async ({ url, request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin', 'Customer']);

    let searchParams = url.searchParams;
    let type = searchParams.get('type') as FrontendData['type'];

    let frontend = await Frontend.findOne({});

    if (!frontend) {
      return response([], 'No frontend data found', 404);
    }

    let data: FrontendData['data'] = {};

    switch (type) {
      case 'heroCarousel':
        data = frontend.heroCarousel ?? [];
        break;
      case 'campaignImages':
        data = frontend.campaignImages ?? [];
        break;

      case 'featureBanner':
        data = frontend.featureBanner ?? {};
        break;
      case 'customerReviewImages':
        data = frontend.customerReviewImages ?? [];
        break;
      case 'siteSettings':
        data = {
          name: frontend?.name || '',
          logo: frontend?.logo || '',
          description: frontend?.description || '',
          youtube: frontend?.youtube || '',
          instagram: frontend?.instagram || '',
          facebook: frontend?.facebook || '',
          tiktok: frontend?.tiktok || '',
          email: frontend?.email || '',
          phoneNumber: frontend?.phoneNumber || [],
          whatsappNumber: frontend?.whatsappNumber || [],
          address: frontend?.address || [],
        };
        break;
      case 'legalSettings':
        data = {
          aboutUs: frontend?.aboutUs || '',
          customerService: frontend?.customerService || '',
          privacyPolicy: frontend?.privacyPolicy || '',
          termsAndConditions: frontend?.termsAndConditions || '',
        };
        break;
      case 'whyChooseUs':
        data = frontend.whyChooseUs ?? {};
        break;
      default:
        data = frontend;
    }

    return response(data, 'success', 200);
  } catch (err) {
    return response([], err?.message, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const body = await request.json();

    let frontend = await Frontend.findOne({});
    if (!frontend) {
      frontend = new Frontend();
    }

    let { type, data } = body as FrontendData;

    if (type === 'heroCarousel') {
      let { image, alt, link } = data;
      if (!image || !alt || !link) {
        return response({}, 'Image and alt are required', 400);
      }
      frontend.heroCarousel.push({ image, alt, link });
    } else if (type === 'campaignImages') {
      let { image, alt, link } = data;
      if (!image || !alt || !link) {
        return response({}, 'Image and alt are required', 400);
      }
      frontend.campaignImages.push({ image, alt, link });
    } else if (type === 'featureBanner') {
      let { image, alt, link } = data;
      if (!image || !alt || !link) {
        return response({}, 'Image and alt are required', 400);
      }
      frontend.featureBanner = { image, alt, link };
    } else if (type === 'customerReviewImages') {
      let { image } = data;
      if (!image) {
        return response({}, 'Image and alt are required', 400);
      }
      frontend.customerReviewImages.push({ image });
    } else if (type === 'siteSettings') {
      const {
        name,
        logo,
        description,
        youtube,
        instagram,
        facebook,
        tiktok,
        email,
        phoneNumber,
        whatsappNumber,
        address,
      } = data;

      frontend.name = name;
      frontend.logo = logo;
      frontend.description = description;
      frontend.youtube = youtube;
      frontend.instagram = instagram;
      frontend.facebook = facebook;
      frontend.tiktok = tiktok;
      frontend.email = email;
      frontend.phoneNumber = phoneNumber;
      frontend.whatsappNumber = whatsappNumber;
      frontend.address = address;
    } else if (type === 'legalSettings') {
      const { aboutUs, customerService, privacyPolicy, termsAndConditions } =
        data;

      frontend.aboutUs = aboutUs;
      frontend.customerService = customerService;
      frontend.privacyPolicy = privacyPolicy;
      frontend.termsAndConditions = termsAndConditions;
    } else if (type === 'whyChooseUs') {
      const { title, points, image, image2, button } = data;
      frontend.whyChooseUs = { title, points, image, image2, button };
    } else {
      return response({}, 'Invalid type', 400);
    }

    await frontend.save();

    return response(null, `Added ${type} to frontend`, 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const body = await request.json();

    let frontend = await Frontend.findOne({});
    if (!frontend) {
      return response({}, 'No frontend data found', 404);
    }

    let { type, data } = body;

    if (type === 'heroCarousel') {
      frontend.heroCarousel = data;
    } else if (type === 'campaignImages') {
      frontend.campaignImages = data;
    } else if (type === 'featureBanner') {
      frontend.featureBanner = data;
    } else if (type === 'customerReviewImages') {
      frontend.customerReviewImages = data;
    } else if (type === 'siteSettings') {
      const {
        name,
        logo,
        description,
        youtube,
        instagram,
        facebook,
        address,
        tiktok,
        email,
        phoneNumber,
        whatsappNumber,
      } = body.data;
      frontend.name = name;
      frontend.logo = logo;
      frontend.description = description;
      frontend.youtube = youtube;
      frontend.instagram = instagram;
      frontend.facebook = facebook;
      frontend.tiktok = tiktok;
      frontend.email = email;
      frontend.phoneNumber = phoneNumber;
      frontend.whatsappNumber = whatsappNumber;
      frontend.address = address;
    } else if (type === 'legalSettings') {
      const { aboutUs, customerService, privacyPolicy, termsAndConditions } =
        body.data;
      frontend.aboutUs = aboutUs;
      frontend.customerService = customerService;
      frontend.privacyPolicy = privacyPolicy;
      frontend.termsAndConditions = termsAndConditions;
    } else if (type === 'whyChooseUs') {
      const { title, points, image, image2, button } = body.data;
      frontend.whyChooseUs = { title, points, image, image2, button };
    } else {
      return response({}, 'Invalid type', 400);
    }

    await frontend.save();

    return response({}, 'success', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    await apiAuthGuard(request, ['Admin', 'SuperAdmin']);

    const body = await request.json();

    let frontend = await Frontend.findOne({});
    if (!frontend) {
      return response({}, 'No frontend data found', 404);
    }

    let { type, _id } = body;

    if (type === 'heroCarousel') {
      frontend.heroCarousel = frontend.heroCarousel.filter(
        (item) => item._id.toString() !== _id,
      );
    } else if (type === 'campaignImages') {
      frontend.campaignImages = frontend.campaignImages.filter(
        (item) => item._id.toString() !== _id,
      );
    } else if (type === 'featureBanner') {
      frontend.featureBanner = {};
    } else if (type === 'customerReviewImages') {
      frontend.customerReviewImages = frontend.customerReviewImages.filter(
        (item) => item._id.toString() !== _id,
      );
    } else if (type === 'whyChooseUs') {
      frontend.whyChooseUs = {};
    } else {
      return response({}, 'Invalid type', 400);
    }

    await frontend.save();

    return response({}, 'success', 200);
  } catch (err) {
    return response({}, err?.message, 500);
  }
};
