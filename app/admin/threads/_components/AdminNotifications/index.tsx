"use client";

import { FC, useEffect, useRef, useState } from "react";
import { FirebaseOptions, initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

type Props = {
  firebaseConfig: FirebaseOptions;
  vapidKey: string;
};

const resolveApp = (config: FirebaseOptions) =>
  getApps().length ? getApp() : initializeApp(config);

const AdminNotifications: FC<Props> = ({ firebaseConfig, vapidKey }) => {
  const swRef = useRef<ServiceWorkerRegistration | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const syncToken = async (reg: ServiceWorkerRegistration) => {
    const token = await getToken(getMessaging(resolveApp(firebaseConfig)), {
      serviceWorkerRegistration: reg,
      vapidKey,
    });
    if (token && token !== localStorage.getItem('fcm_token')) {
      await fetch('/api/admin/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      localStorage.setItem('fcm_token', token);
    }
  };

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register('/firebase-messaging-sw.js', { scope: '/admin/threads' })
      .then(async (reg) => {
        swRef.current = reg;
        if (Notification.permission !== 'granted') return;
        await syncToken(reg).catch(() => {});
        setSubscribed(true);
      })
      .catch(() => {});
  }, []);

  const enable = async () => {
    if (!swRef.current) return;
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
    await syncToken(swRef.current);
    setSubscribed(true);
  };

  if (subscribed) return null;

  return (
    <button
      onClick={enable}
      className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full shadow-lg"
    >
      Enable notifications
    </button>
  );
};

export default AdminNotifications;
