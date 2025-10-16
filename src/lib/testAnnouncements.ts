import { collection, getDocs, query, limit } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase";

export async function testAnnouncementsDirectly() {

  try {
    const announcementsRef = collection(db, "announcements");
    const q = query(announcementsRef, limit(10));
    const snapshot = await getDocs(q);


    if (snapshot.empty) {
    } else {
      snapshot.forEach((doc) => {
        const data = doc.data();
      });
    }

    return { success: true, count: snapshot.size };
  } catch (error) {
    return { success: false, error };
  }
}

export async function testAnnouncementsFeedFunction() {

  try {
    const callable = httpsCallable(functions, "fetchAnnouncementsFeed");
    const response = await callable({ limit: 6, audience: "all", includeExpired: false });

    const data = response.data as any;

    if (data?.ok && Array.isArray(data.announcements)) {
      data.announcements.forEach((item: any, index: number) => {
      });
    } else {
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error };
  }
}

export async function runAllAnnouncementTests() {

  // Test 1: Direct Firestore query
  const directResult = await testAnnouncementsDirectly();

  // Test 2: Cloud Function
  const functionResult = await testAnnouncementsFeedFunction();

  // Summary

  if (directResult.success && directResult.count === 0) {
  }


  return {
    direct: directResult,
    function: functionResult,
  };
}

// Make it available in dev console
if (import.meta.env.DEV) {
  (window as any).testAnnouncements = {
    direct: testAnnouncementsDirectly,
    function: testAnnouncementsFeedFunction,
    all: runAllAnnouncementTests,
  };
}
