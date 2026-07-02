import * as admin from 'firebase-admin';

import config from "./config";
import logger from "@/logger";

const firebaseServiceAccount = JSON.parse(atob(config.FIREBASE_SERVICE_ACCOUNT_BASE64));

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount)
});

const messaging = await admin.messaging()

const notifyAdminDevices = async () => {
  try {
    await messaging.send({
      notification: {
        title: 'Firebase Alert',
        body: 'Minimum code, maximum power.'
      },
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
