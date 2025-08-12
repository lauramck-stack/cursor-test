import { sampleData } from '../data/sampleData';

// Function to seed the application with sample data
export function seedApplication() {
  console.log('🌱 Seeding application with sample data...');
  
  try {
    // Store data in localStorage for demo purposes
    // In a real app, this would typically go to a database
    localStorage.setItem('roadmap-categories', JSON.stringify(sampleData.categories));
    localStorage.setItem('roadmap-items', JSON.stringify(sampleData.items));
    
    console.log('✅ Successfully seeded application with:');
    console.log(`   - ${sampleData.categories.length} categories`);
    console.log(`   - ${sampleData.items.length} roadmap items`);
    console.log('');
    console.log('🎯 Sample data includes:');
    console.log('   - Frontend Development tasks');
    console.log('   - Backend Development tasks');
    console.log('   - Testing & QA procedures');
    console.log('   - DevOps & Infrastructure setup');
    console.log('   - Documentation requirements');
    console.log('');
    console.log('🚀 Your roadmap app is now ready with sample data!');
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding application:', error);
    return false;
  }
}

// Function to clear seeded data
export function clearSeededData() {
  console.log('🧹 Clearing seeded data...');
  
  try {
    localStorage.removeItem('roadmap-categories');
    localStorage.removeItem('roadmap-items');
    
    console.log('✅ Successfully cleared seeded data');
    return true;
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    return false;
  }
}

// Function to check if data is already seeded
export function isDataSeeded(): boolean {
  const categories = localStorage.getItem('roadmap-categories');
  const items = localStorage.getItem('roadmap-items');
  
  return !!(categories && items);
}

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  if (!isDataSeeded()) {
    seedApplication();
  } else {
    console.log('📊 Data already seeded. Use clearSeededData() to reset.');
  }
}
