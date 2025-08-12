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

async function deleteTestSprint() {
  try {
    console.log('🗑️  Looking for Test Sprint to delete...');

    // Find the Test Sprint
    const { data: testSprint, error: fetchError } = await supabase
      .from('sprints')
      .select('*')
      .eq('name', 'Test Sprint')
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        console.log('✅ No Test Sprint found - already deleted!');
        return;
      }
      throw fetchError;
    }

    console.log(`📋 Found Test Sprint: ${testSprint.id} (${testSprint.name})`);

    // Check if there are any items in this sprint
    const { data: itemsInSprint, error: itemsError } = await supabase
      .from('roadmap_items')
      .select('*')
      .eq('sprint_id', testSprint.id);

    if (itemsError) throw itemsError;

    if (itemsInSprint && itemsInSprint.length > 0) {
      console.log(`⚠️  Found ${itemsInSprint.length} items in Test Sprint`);
      console.log('📦 Moving items to backlog (removing sprint_id)...');
      
      // Move items to backlog by setting sprint_id to null
      const { error: updateError } = await supabase
        .from('roadmap_items')
        .update({ sprint_id: null })
        .eq('sprint_id', testSprint.id);

      if (updateError) {
        console.error(`❌ Error moving items to backlog: ${updateError.message}`);
        return;
      }
      
      console.log(`✅ Moved ${itemsInSprint.length} items to backlog`);
    } else {
      console.log('ℹ️  No items in Test Sprint');
    }

    // Delete the Test Sprint
    console.log('🗑️  Deleting Test Sprint...');
    const { error: deleteError } = await supabase
      .from('sprints')
      .delete()
      .eq('id', testSprint.id);

    if (deleteError) {
      console.error(`❌ Error deleting Test Sprint: ${deleteError.message}`);
      return;
    }

    console.log('✅ Test Sprint deleted successfully!');
    console.log('✨ Your roadmap should now only show the quarterly sprints!');

  } catch (error) {
    console.error('❌ Error during deletion:', error);
  }
}

deleteTestSprint();
