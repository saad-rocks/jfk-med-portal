import { seedDatabase, clearSeededData } from './seedDatabase';

// Function to run seeding from the browser console
export async function runSeed() {
  try {
    console.log('🚀 Starting database seeding...');
    await seedDatabase();
    console.log('✅ Seeding completed successfully!');
    console.log('You can now test the portal with realistic data.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Function to clear seeded data
export async function runClear() {
  try {
    console.log('🧹 Clearing seeded data...');
    await clearSeededData();
    console.log('✅ Data cleared successfully!');
  } catch (error) {
    console.error('❌ Clearing failed:', error);
  }
}

// Make functions available globally for easy access
if (typeof window !== 'undefined') {
  (window as any).runSeed = runSeed;
  (window as any).runClear = runClear;
  
  console.log('🌱 Database seeding functions available:');
  console.log('- runSeed() - Populate database with test data');
  console.log('- runClear() - Clear all seeded data');
}
