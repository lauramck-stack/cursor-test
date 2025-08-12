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

async function cleanupDuplicateSprints() {
  try {
    console.log('🧹 Starting cleanup of duplicate sprints...');

    // First, let's see what we have
    const { data: sprints, error: fetchError } = await supabase
      .from('sprints')
      .select('*')
      .order('name, created_at');

    if (fetchError) throw fetchError;

    console.log(`📊 Found ${sprints.length} total sprints`);

    // Group sprints by name
    const groupedByName = {};
    sprints.forEach(sprint => {
      if (!groupedByName[sprint.name]) {
        groupedByName[sprint.name] = [];
      }
      groupedByName[sprint.name].push(sprint);
    });

    // Find duplicates
    const duplicates = Object.entries(groupedByName)
      .filter(([name, sprintList]) => sprintList.length > 1)
      .map(([name, sprintList]) => ({ name, sprints: sprintList }));

    console.log(`🔍 Found ${duplicates.length} sprint names with duplicates:`);
    duplicates.forEach(({ name, sprints }) => {
      console.log(`  ${name}: ${sprints.length} instances`);
      sprints.forEach(sprint => {
        console.log(`    - ID: ${sprint.id}, Created: ${sprint.created_at}`);
      });
    });

    if (duplicates.length === 0) {
      console.log('✅ No duplicate sprints found!');
      return;
    }

    console.log('\n🚀 Starting automatic cleanup...');

    // Process each group of duplicates
    for (const { name, sprints } of duplicates) {
      console.log(`\n📋 Processing ${name}...`);
      
      // Keep the first sprint (earliest created) and merge others into it
      const mainSprint = sprints[0];
      const duplicateSprints = sprints.slice(1);
      
      console.log(`  ✅ Keeping main sprint: ${mainSprint.id} (created: ${mainSprint.created_at})`);
      console.log(`  🗑️  Will delete ${duplicateSprints.length} duplicate(s)`);

      // Move all items from duplicate sprints to the main sprint
      for (const duplicateSprint of duplicateSprints) {
        console.log(`  📦 Moving items from duplicate sprint ${duplicateSprint.id}...`);
        
        // Get items in this duplicate sprint
        const { data: itemsInDuplicate, error: itemsError } = await supabase
          .from('roadmap_items')
          .select('*')
          .eq('sprint_id', duplicateSprint.id);

        if (itemsError) {
          console.error(`    ❌ Error fetching items: ${itemsError.message}`);
          continue;
        }

        if (itemsInDuplicate && itemsInDuplicate.length > 0) {
          console.log(`    📥 Found ${itemsInDuplicate.length} items to move`);
          
          // Update items to point to the main sprint
          const { error: updateError } = await supabase
            .from('roadmap_items')
            .update({ sprint_id: mainSprint.id })
            .eq('sprint_id', duplicateSprint.id);

          if (updateError) {
            console.error(`    ❌ Error updating items: ${updateError.message}`);
            continue;
          }
          
          console.log(`    ✅ Moved ${itemsInDuplicate.length} items to main sprint`);
        } else {
          console.log(`    ℹ️  No items in this duplicate sprint`);
        }

        // Delete the duplicate sprint
        console.log(`    🗑️  Deleting duplicate sprint ${duplicateSprint.id}...`);
        const { error: deleteError } = await supabase
          .from('sprints')
          .delete()
          .eq('id', duplicateSprint.id);

        if (deleteError) {
          console.error(`    ❌ Error deleting sprint: ${deleteError.message}`);
        } else {
          console.log(`    ✅ Deleted duplicate sprint ${duplicateSprint.id}`);
        }
      }
    }

    console.log('\n🎉 Cleanup completed!');
    console.log('📊 Final sprint count:');
    
    // Show final state
    const { data: finalSprints, error: finalError } = await supabase
      .from('sprints')
      .select('*')
      .order('name, created_at');

    if (!finalError && finalSprints) {
      const finalGrouped = {};
      finalSprints.forEach(sprint => {
        if (!finalGrouped[sprint.name]) {
          finalGrouped[sprint.name] = [];
        }
        finalGrouped[sprint.name].push(sprint);
      });

      Object.entries(finalGrouped).forEach(([name, sprintList]) => {
        console.log(`  ${name}: ${sprintList.length} sprint(s)`);
      });
    }

    console.log('\n✨ Your roadmap should now show one clean column per quarter!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupDuplicateSprints();
