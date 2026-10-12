import * as admin from 'firebase-admin';

import config from "@/backend/shared/config";
import logger from "@/backend/shared/logger";

const firebaseServiceAccountBase64 = config.FIREBASE_SERVICE_ACCOUNT_BASE64;  
let messaging: admin.messaging.Messaging | undefined

if(firebaseServiceAccountBase64) {
  admin.initializeApp({
    credential: JSON.parse(atob(firebaseServiceAccountBase64)),
  });

  messaging = await admin.messaging();
}

const notifyAdminDevices = async (threadId: string, prompt: string) => {
  if(!messaging) {
    logger.warn('push-notification: Firebase service account not configured, skipping notification');
    return;
  }

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

const notifyCvSyncResult = async (success: boolean, details: string) => {
  if (!messaging) {
    logger.warn(
      "push-notification: Firebase service account not configured, skipping notification",
    );
    return;
  }

  try {
    await messaging.send({
      notification: {
        title: success ? 'CV Sync Complete' : 'CV Sync Failed',
        body: details,
      },
      data: { type: 'cv_sync', success: String(success) },
      topic: 'cv_sync'
    });
  } catch (error) {
    logger.error(error, 'push-notification: failed to send CV sync result');
  }
};

const subscribeToTopic = async (token: string) => {
  if (!messaging) {
    logger.warn(
      "push-notification: Firebase service account not configured, skipping notification",
    );
    return;
  }

  try {
    await Promise.all([
      messaging.subscribeToTopic([token], 'prompt_entered'),
      messaging.subscribeToTopic([token], 'cv_sync'),
    ]);
  } catch (error) {
    logger.error(error, 'push-notification: failed to subscribe token to topic');
  }
};

export { notifyAdminDevices, notifyCvSyncResult, subscribeToTopic };