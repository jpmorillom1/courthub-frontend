import { useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getDatabase,
  ref,
  query,
  orderByKey,
  startAt,
  endAt,
  onValue,
} from "firebase/database";

//  Firebasecofiguration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
//initialize firebase app
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

/**
 * Hook for fetching court availability from Firebase Realtime Database.
 * @param {string} courtId
 * @param {string} startDate
 * @param {string} endDate
 */
export function useAvailability(courtId, startDate, endDate) {
  const [slotsData, setSlotsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courtId || !startDate || !endDate) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const courtRef = ref(database, `availability/${courtId}`);

    const rangeQuery = query(
      courtRef,
      orderByKey(),
      startAt(startDate),
      endAt(endDate)
    );

    const unsubscribe = onValue(
      rangeQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          setSlotsData(snapshot.val());
        } else {
          setSlotsData({});
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error en el listener de Firebase:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [courtId, startDate, endDate]);

  return { slotsData, loading, error };
}
