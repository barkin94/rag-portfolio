import * as admin from 'firebase-admin';

import config from "./config";
import logger from "@/logger";

const firebaseServiceAccount = JSON.parse(atob(config.FIREBASE_SERVICE_ACCOUNT_BASE64));

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount)
});

const messaging = await admin.messaging()

const notifyAdminDevices = async (threadId: string, prompt: string) => {
  const preview = prompt.length > 120 ? prompt.slice(0, 120) + '…' : prompt;
  try {
    await messaging.send({
      notification: {
        title: 'New thread',
        body: preview,
      },
      data: { threadId },
      topic: 'prompt_entered'
    });
  } catch (error) {
    logger.error(error, 'push-notification: failed to send message');
  }
};

const subscribeToTopic = async (token: string) => {
  try {
    await messaging.subscribeToTopic(token, 'prompt_entered');
  } catch (error) {
    logger.error(error, 'push-notification: failed to subscribe token to topic');
  }
};

export default {
  notifyAdminDevices,
  subscribeToTopic,
}
