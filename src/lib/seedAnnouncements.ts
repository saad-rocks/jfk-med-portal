import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function seedAnnouncements() {
  const announcementsRef = collection(db, "announcements");

  const sampleAnnouncements = [
    {
      title: "Welcome to JFK Medical Portal",
      content: "We're excited to have you here! This portal is your central hub for all academic activities, announcements, and resources. Please take a moment to familiarize yourself with the platform.",
      priority: "medium",
      targetAudience: ["all"],
      authorName: "Admin",
      authorId: "system",
      authorUid: "system",
      pinned: true,
      tags: ["welcome", "info"],
      publishedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: null,
    },
    {
      title: "Important: Upcoming Clinical Rotation Assignments",
      content: "All MD-3 and MD-4 students must review their clinical rotation assignments by the end of this week. Failure to confirm your rotation may result in scheduling conflicts. Please contact the academic office if you have any questions.",
      priority: "high",
      targetAudience: ["students"],
      authorName: "Clinical Coordinator",
      authorId: "system",
      authorUid: "system",
      pinned: true,
      tags: ["clinical", "deadline", "important"],
      publishedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: null,
    },
    {
      title: "Faculty Meeting Scheduled for Thursday",
      content: "There will be a mandatory faculty meeting this Thursday at 2:00 PM in Conference Room A. The agenda includes curriculum updates and student performance reviews. Please RSVP by Tuesday.",
      priority: "medium",
      targetAudience: ["teachers"],
      authorName: "Dean of Education",
      authorId: "system",
      authorUid: "system",
      pinned: false,
      tags: ["faculty", "meeting"],
      publishedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: null,
    },
    {
      title: "Library Extended Hours During Exam Week",
      content: "The medical library will be open 24/7 starting next Monday through the end of exam week. Study rooms can be reserved online through the portal. Bring your student ID for after-hours access.",
      priority: "low",
      targetAudience: ["students"],
      authorName: "Library Services",
      authorId: "system",
      authorUid: "system",
      pinned: false,
      tags: ["library", "exams", "study"],
      publishedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: null,
    },
    {
      title: "New Research Opportunities Available",
      content: "The Department of Internal Medicine is seeking students interested in participating in ongoing research projects. This is an excellent opportunity to gain research experience and contribute to medical advancement. Applications are due by the end of the month.",
      priority: "low",
      targetAudience: ["students"],
      authorName: "Research Coordinator",
      authorId: "system",
      authorUid: "system",
      pinned: false,
      tags: ["research", "opportunity"],
      publishedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: null,
    },
    {
      title: "COVID-19 Vaccination Clinic Next Week",
      content: "Free flu shots and COVID-19 boosters will be available at the student health center next week. Walk-ins welcome Monday through Friday, 9 AM to 4 PM. Please bring your insurance card if you have one.",
      priority: "medium",
      targetAudience: ["all"],
      authorName: "Student Health Services",
      authorId: "system",
      authorUid: "system",
      pinned: false,
      tags: ["health", "vaccination"],
      publishedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: null,
    },
  ];


  for (const announcement of sampleAnnouncements) {
    try {
      const docRef = await addDoc(announcementsRef, announcement);
    } catch (error) {
    }
  }

}

// Make it available in dev console
if (import.meta.env.DEV) {
  (window as any).seedAnnouncements = seedAnnouncements;
}
