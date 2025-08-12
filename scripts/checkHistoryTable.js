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

async function checkHistoryTable() {
  try {
    console.log('🔍 Examining roadmap_item_history table...');

    // Try to get the table structure
    console.log('\n📋 Attempting to describe table structure...');
    
    try {
      const { data: structure, error: structureError } = await supabase
        .from('roadmap_item_history')
        .select('*')
        .limit(1);

      if (structureError) {
        console.log(`  ❌ Error accessing table: ${structureError.message}`);
      } else {
        console.log(`  ✅ Table accessible`);
        if (structure && structure.length > 0) {
          console.log(`  📝 Sample record structure:`, Object.keys(structure[0]));
        }
      }
    } catch (err) {
      console.log(`  ❓ Could not access table: ${err.message}`);
    }

    // Check if there are any records
    console.log('\n📊 Checking for existing records...');
    
    try {
      const { count, error: countError } = await supabase
        .from('roadmap_item_history')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.log(`  ❌ Error getting count: ${countError.message}`);
      } else {
        console.log(`  📈 Total records: ${count}`);
      }
    } catch (err) {
      console.log(`  ❓ Could not get count: ${err.message}`);
    }

    // Try to see if there are any triggers or constraints
    console.log('\n🔧 This table likely has triggers that log changes to roadmap_items');
    console.log('   When we delete a sprint that has items, it triggers an insert here');
    console.log('   The RLS policy is blocking that insert');

    console.log('\n💡 Solutions:');
    console.log('   1. Disable RLS temporarily on roadmap_item_history');
    console.log('   2. Create proper RLS policies for roadmap_item_history');
    console.log('   3. Move items to backlog before deleting sprints');
    console.log('   4. Use a different approach to update sprints');

  } catch (error) {
    console.error('❌ Error during history table check:', error);
  }
}

checkHistoryTable();
