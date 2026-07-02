import { FirebaseOptions } from "firebase/app";
import AdminHeader from "../threads/_components/Header";
import AdminNotifications from "./_components/AdminNotifications";
import config from "@/backend/config";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyDwgw4Vy2Rill0MtKD1lADzwiVjc02SXXw",
    authDomain: "portfolio-76cfc.firebaseapp.com",
    projectId: "portfolio-76cfc",
    storageBucket: "portfolio-76cfc.firebasestorage.app",
    messagingSenderId: "425907294773",
    appId: "1:425907294773:web:d10e99ff6bc03e887e577c",
    measurementId: "G-BTN9ND25D0"
  };

  return <>
    <AdminHeader />
    <div className="mt-25 px-4">
      { children }
    </div>
    <AdminNotifications
      firebaseConfig={firebaseConfig}
      vapidKey={config.FIREBASE_VAPID_KEY}
    />
  </>
}
