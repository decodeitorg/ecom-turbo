import Setting from '@/models/Setting';
import { response } from '@/utils/response.ts';
import type { APIRoute } from 'astro';
import {
  Content,
  CustomData,
  DeliveryCategory,
  EventRequest,
  UserData,
  ServerEvent,
  FacebookAdsApi,
} from 'facebook-nodejs-business-sdk';

export const POST: APIRoute = async ({ request }) => {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-real-ip') || '';

    const setting = await Setting.findOne();
    const {
      pixelId = '',
      accessToken = '',
      test_event_code = '',
    } = setting?.facebookPixel || {};

    if (!pixelId || !accessToken) {
      return response({}, 'Pixel ID or Access Token is missing', 400);
    }

    const body = await request.json();
    const { productData, userData, eventID } = body;
    const current_timestamp = Math.floor(Date.now() / 1000);

    // Initialize Facebook Ads API
    FacebookAdsApi.init(accessToken);

    const fbUserData = new UserData()
      .setClientIpAddress(ip)
      .setClientUserAgent(userAgent)
      .setFbp(userData.fbp)
      .setFbc(userData.fbc);

    //make the content here
    const content = productData.contents.map((content) =>
      new Content().setId(content._id).setQuantity(content._quantity),
    );

    const customData = new CustomData()
      .setContentIds(productData.content_ids)
      .setContentType(productData.content_type)
      .setContents([...content])
      .setCurrency(productData.currency)
      .setValue(productData.value);

    const serverEvent = new ServerEvent()
      .setEventId(eventID)
      .setEventName('InitiateCheckout')
      .setEventTime(current_timestamp)
      .setUserData(fbUserData)
      .setCustomData(customData)
      .setEventSourceUrl(`${import.meta.env.PUBLIC_SITE}/cart`)
      .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(accessToken, pixelId).setEvents(
      eventsData,
    );

    if (test_event_code) {
      eventRequest.setTestEventCode(test_event_code);
    }

    const apiResponse = await eventRequest.execute();

    return response(
      { apiResponse },
      'InitiateCheckout Event sent successfully',
      200,
    );
  } catch (err) {
    console.error('Error in InitiateCheckout API:', err.message);
    return response({}, err?.message || 'An error occurred', 500);
  }
};
