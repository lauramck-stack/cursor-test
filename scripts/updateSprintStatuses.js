import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSprintStatuses() {
  try {
    console.log('🔄 Starting to update sprint statuses based on dates...');
    
    // Get all sprints
    const { data: sprints, error: fetchError } = await supabase
      .from('sprints')
      .select('*')
      .order('start_date');
    
    if (fetchError) throw fetchError;
    
    console.log(`📊 Found ${sprints.length} sprints to update`);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    console.log(`📅 Today's date: ${today.toISOString().split('T')[0]}`);
    
    let updatedCount = 0;
    const statusUpdates = [];
    
    for (const sprint of sprints) {
      const startDate = new Date(sprint.start_date);
      const endDate = new Date(sprint.end_date);
      
      // Determine status based on dates
      let newStatus;
      if (endDate < today) {
        // Sprint has ended - mark as completed
        newStatus = 'completed';
      } else {
        // Sprint is either current or future - mark as planned
        // (since the database constraint only allows 'completed' and 'planned')
        newStatus = 'planned';
      }
      
      // Only update if status has changed
      if (sprint.status !== newStatus) {
        const { error: updateError } = await supabase
          .from('sprints')
          .update({ status: newStatus })
          .eq('id', sprint.id);
        
        if (updateError) {
          console.error(`❌ Error updating sprint ${sprint.name}: ${updateError.message}`);
          continue;
        }
        
        statusUpdates.push({
          name: sprint.name,
          oldStatus: sprint.status,
          newStatus: newStatus,
          startDate: sprint.start_date,
          endDate: sprint.end_date
        });
        
        updatedCount++;
        console.log(`✅ Updated ${sprint.name}: ${sprint.status} → ${newStatus}`);
      } else {
        console.log(`ℹ️  ${sprint.name}: Already has correct status "${sprint.status}"`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} sprint statuses!`);
    
    if (statusUpdates.length > 0) {
      console.log('\n📋 Status Updates Summary:');
      statusUpdates.forEach(update => {
        console.log(`  ${update.name}:`);
        console.log(`    ${update.oldStatus} → ${update.newStatus}`);
        console.log(`    Dates: ${update.startDate} to ${update.endDate}`);
      });
    }
    
    // Show current status distribution
    console.log('\n📊 Current Sprint Status Distribution:');
    const statusCounts = {};
    sprints.forEach(sprint => {
      const status = sprint.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} sprints`);
    });
    
    console.log('\n✨ Sprint statuses have been automatically updated based on dates!');
    console.log('🔄 Refresh your browser to see the updated sprint statuses!');
    
  } catch (error) {
    console.error('❌ Error during sprint status update:', error);
  }
}

updateSprintStatuses();
