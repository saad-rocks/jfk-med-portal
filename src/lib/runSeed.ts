import { seedDatabase, clearSeededData } from './seedDatabase';

// Function to run seeding from the browser console
export async function runSeed() {
  try {
    await seedDatabase();
  } catch (error) {
  }
}

// Function to clear seeded data
export async function runClear() {
  try {
    await clearSeededData();
  } catch (error) {
  }
}

// Make functions available globally for easy access
if (typeof window !== 'undefined') {
  (window as any).runSeed = runSeed;
  (window as any).runClear = runClear;
  
}
