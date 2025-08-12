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

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...');

    // Try to get table info
    const { data: tables, error: tablesError } = await supabase
      .from('sprints')
      .select('*')
      .limit(1);

    if (tablesError) {
      console.error('Error accessing sprints table:', tablesError);
    } else {
      console.log('✅ Sprints table accessible');
    }

    // Try to insert a minimal sprint record
    console.log('Testing minimal sprint insert...');
    const testSprint = {
      name: 'Test Sprint',
      start_date: '2024-01-01',
      end_date: '2024-01-31'
    };

    const { data: insertedSprint, error: insertError } = await supabase
      .from('sprints')
      .insert(testSprint)
      .select();

    if (insertError) {
      console.error('❌ Sprint insert error:', insertError);
    } else {
      console.log('✅ Test sprint inserted successfully:', insertedSprint);
      
      // Clean up test data
      await supabase
        .from('sprints')
        .delete()
        .eq('id', insertedSprint[0].id);
      console.log('🧹 Test sprint cleaned up');
    }

  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkSchema();
