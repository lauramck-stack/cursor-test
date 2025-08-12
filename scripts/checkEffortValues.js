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

async function checkEffortValues() {
  try {
    console.log('🔍 Testing effort field values...');

    // Test different effort values
    const effortValues = ['low', 'medium', 'high', '1', '2', '3', '5', '8', '13', '21'];

    for (const effort of effortValues) {
      console.log(`Testing effort value: "${effort}"`);
      
      const testItem = {
        title: `Test Item - ${effort}`,
        description: `Test description with effort ${effort}`,
        status: 'planned',
        priority: 'medium',
        effort: effort
      };

      const { data: insertedItem, error: insertError } = await supabase
        .from('roadmap_items')
        .insert(testItem)
        .select();

      if (insertError) {
        console.log(`❌ "${effort}" failed:`, insertError.message);
      } else {
        console.log(`✅ "${effort}" succeeded!`);
        
        // Clean up test data
        await supabase
          .from('roadmap_items')
          .delete()
          .eq('id', insertedItem[0].id);
      }
    }

  } catch (error) {
    console.error('❌ Error checking effort values:', error);
  }
}

checkEffortValues();
