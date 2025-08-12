import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteSprintsOneByOne() {
  try {
    console.log('🗑️  Deleting sprints one by one to identify the problematic one...');
    
    // Get all existing sprints
    const { data: existingSprints, error: fetchError } = await supabase
      .from('sprints')
      .select('*')
      .order('created_at');

    if (fetchError) throw fetchError;

    console.log(`📊 Found ${existingSprints.length} existing sprints`);

    // Try to delete each sprint individually
    for (let i = 0; i < existingSprints.length; i++) {
      const sprint = existingSprints[i];
      console.log(`\n🗑️  Attempting to delete sprint ${i + 1}/${existingSprints.length}: ${sprint.name} (${sprint.id})`);
      
      try {
        // Check if this sprint has any items
        const { data: itemsInSprint, error: itemsError } = await supabase
          .from('roadmap_items')
          .select('*')
          .eq('sprint_id', sprint.id);

        if (itemsError) {
          console.log(`  ⚠️  Could not check items: ${itemsError.message}`);
        } else {
          console.log(`  📦 Found ${itemsInSprint?.length || 0} items in this sprint`);
        }

        // Try to delete the sprint
        const { error: deleteError } = await supabase
          .from('sprints')
          .delete()
          .eq('id', sprint.id);

        if (deleteError) {
          console.log(`  ❌ Failed to delete: ${deleteError.message}`);
          console.log(`  🔍 This sprint is causing the RLS issue!`);
          
          // Try to understand what's happening
          if (deleteError.message.includes('roadmap_item_history')) {
            console.log(`  💡 The issue is with roadmap_item_history table`);
            console.log(`  🔧 This suggests there's a trigger or constraint that's trying to log changes`);
          }
          
          return; // Stop here to investigate
        } else {
          console.log(`  ✅ Successfully deleted ${sprint.name}`);
        }

      } catch (err) {
        console.log(`  ❓ Error during deletion: ${err.message}`);
      }
    }

    console.log('\n🎉 All sprints deleted successfully!');

  } catch (error) {
    console.error('❌ Error during sprint deletion:', error);
  }
}

deleteSprintsOneByOne();
