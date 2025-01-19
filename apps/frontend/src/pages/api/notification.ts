import Frontend from '@/models/Frontend';
import { response } from '@/utils/response';
import webPush from 'web-push';

webPush.setVapidDetails(
  'mailto:decodeit.org@gmail.com',
  'BND9zrxn5XSECPyO76SKa4Aep5u4plruaxNt67Rq8wIWn0XKiLRw6MDep0cYzTRI44WTp3EA-rs2Y-_jf-xFy9o',
  'vf4drVW2ZFihfDu-iLh9f9kg8dXrUN7vSc9cbp-5KAI',
);

interface PushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

type Payload = {
  title: string;
  body: string;
  link: string;
};

function isValidSubscription(sub: any): sub is PushSubscription {
  return (
    sub &&
    typeof sub.endpoint === 'string' &&
    sub.endpoint.length > 0 &&
    sub.keys &&
    typeof sub.keys.p256dh === 'string' &&
    typeof sub.keys.auth === 'string'
  );
}

export async function sendNotification(
  payload: Payload,
): Promise<{ sent: number; removed: number }> {
  let count = 0;
  try {
    const frontend = await Frontend.findOne({});
    let subscriptions = frontend?.pushSubscription ?? [];

    // Filter out invalid subscriptions first
    subscriptions = subscriptions.filter(isValidSubscription);

    const invalidSubscriptions: number[] = [];

    for (let i = 0; i < subscriptions.length; i++) {
      try {
        const sub = subscriptions[i];
        console.log('🚀 ~ sub:', sub);
        await webPush.sendNotification(sub, JSON.stringify(payload));
        count++;
      } catch (error: any) {
        console.log('🚀 ~ error:', error.message);
        if (
          error.statusCode === 410 ||
          error.statusCode === 404 ||
          error.statusCode === 400
        ) {
          invalidSubscriptions.push(i);
          console.error(`Invalid subscription at index ${i}:`, error.message);
        } else {
          console.error(
            `Error sending notification to subscription ${i}:`,
            error.message,
          );
        }
      }
    }

    if (invalidSubscriptions.length > 0) {
      frontend.pushSubscription = subscriptions.filter(
        (_, index) => !invalidSubscriptions.includes(index),
      );
      await frontend.save();
    }

    return { sent: count, removed: invalidSubscriptions.length };
  } catch (error: any) {
    throw new Error(`Notification error: ${error.message} (${count} sent)`);
  }
}

//this is a test route
export async function GET() {
  try {
    await sendNotification({
      title: 'New Notification',
      body: 'This is a test push notification',
      link: '/admin',
    });
    return response({}, 'Push notification sent successfully', 200);
  } catch (error) {
    return response(error.message, 'Failed to send push notification', 500);
  }
}

// use for subscription
export async function POST({ request }) {
  try {
    const { subscription } = await request.json();
    console.log('Received subscription:', subscription);

    if (!subscription) {
      return response({}, 'Subscription not provided', 400);
    }

    let frontend = await Frontend.findOne({});
    if (!frontend) {
      console.log('Creating new Frontend document');
      frontend = new Frontend();
    }

    console.log('Current subscriptions:', frontend.pushSubscription);
    frontend.pushSubscription.push(subscription);
    await frontend.save();
    console.log('Subscription saved successfully');

    return response(
      frontend.publicKey,
      'Push notification setup successful',
      200,
    );
  } catch (error) {
    console.error('Error sending push notification:', error.message);
    return response(error.message, 'Failed to send push notification', 500);
  }
}
