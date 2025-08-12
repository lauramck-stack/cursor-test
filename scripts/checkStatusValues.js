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

async function checkStatusValues() {
  try {
    console.log('🔍 Testing status field values...');

    // Test different status values
    const statusValues = ['planned', 'in_progress', 'completed', 'cancelled', 'in-progress', 'not-started'];

    for (const status of statusValues) {
      console.log(`Testing status value: "${status}"`);
      
      const testItem = {
        title: `Test Item - ${status}`,
        description: `Test description with status ${status}`,
        status: status,
        priority: 'medium',
        effort: 'medium'
      };

      const { data: insertedItem, error: insertError } = await supabase
        .from('roadmap_items')
        .insert(testItem)
        .select();

      if (insertError) {
        console.log(`❌ "${status}" failed:`, insertError.message);
      } else {
        console.log(`✅ "${status}" succeeded!`);
        
        // Clean up test data
        await supabase
          .from('roadmap_items')
          .delete()
          .eq('id', insertedItem[0].id);
      }
    }

  } catch (error) {
    console.error('❌ Error checking status values:', error);
  }
}

checkStatusValues();
