// Test script to verify enrollment data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Firebase configuration (you'll need to add your actual config)
const firebaseConfig = {
  // Add your Firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testEnrollments() {
  try {
    console.log('🔍 Testing enrollment data...');
    
    // Get all enrollments
    const enrollmentsRef = collection(db, 'enrollments');
    const enrollmentsSnapshot = await getDocs(enrollmentsRef);
    
    console.log(`📊 Total enrollments found: ${enrollmentsSnapshot.size}`);
    
    const enrollments = [];
    enrollmentsSnapshot.forEach(doc => {
      enrollments.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('📋 All enrollments:', enrollments);
    
    // Get enrollments by status
    const enrolledStudents = enrollments.filter(e => e.status === 'enrolled');
    const droppedStudents = enrollments.filter(e => e.status === 'dropped');
    const completedStudents = enrollments.filter(e => e.status === 'completed');
    
    console.log(`✅ Enrolled students: ${enrolledStudents.length}`);
    console.log(`❌ Dropped students: ${droppedStudents.length}`);
    console.log(`🎓 Completed students: ${completedStudents.length}`);
    
    // Get unique course IDs
    const courseIds = [...new Set(enrollments.map(e => e.courseId))];
    console.log('📚 Course IDs with enrollments:', courseIds);
    
    // Get unique student IDs
    const studentIds = [...new Set(enrollments.map(e => e.studentId))];
    console.log('👥 Student IDs with enrollments:', studentIds);
    
    // Test course-specific enrollments
    for (const courseId of courseIds) {
      const courseEnrollments = enrollments.filter(e => e.courseId === courseId);
      const activeEnrollments = courseEnrollments.filter(e => e.status === 'enrolled');
      console.log(`📚 Course ${courseId}: ${activeEnrollments.length} active enrollments`);
    }
    
  } catch (error) {
    console.error('❌ Error testing enrollments:', error);
  }
}

// Run the test
testEnrollments();
