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

async function checkRoadmapItemsSchema() {
  try {
    console.log('🔍 Checking roadmap_items table schema...');

    // Try to get table info
    const { data: items, error: itemsError } = await supabase
      .from('roadmap_items')
      .select('*')
      .limit(1);

    if (itemsError) {
      console.error('Error accessing roadmap_items table:', itemsError);
    } else {
      console.log('✅ Roadmap items table accessible');
    }

    // Try to insert a minimal roadmap item record
    console.log('Testing minimal roadmap item insert...');
    const testItem = {
      title: 'Test Item',
      description: 'Test description',
      status: 'planned',
      priority: 'medium'
    };

    const { data: insertedItem, error: insertError } = await supabase
      .from('roadmap_items')
      .insert(testItem)
      .select();

    if (insertError) {
      console.error('❌ Roadmap item insert error:', insertError);
    } else {
      console.log('✅ Test roadmap item inserted successfully:', insertedItem);
      
      // Clean up test data
      await supabase
        .from('roadmap_items')
        .delete()
        .eq('id', insertedItem[0].id);
      console.log('🧹 Test roadmap item cleaned up');
    }

  } catch (error) {
    console.error('❌ Error checking roadmap items schema:', error);
  }
}

checkRoadmapItemsSchema();
