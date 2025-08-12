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

async function checkSprintTableStructure() {
  try {
    console.log('🔍 Checking sprints table structure...');

    // Try to insert a test record to see what's allowed
    console.log('\n🧪 Testing insert with minimal data...');
    
    try {
      const { data: testSprint, error: insertError } = await supabase
        .from('sprints')
        .insert({
          name: 'Test Sprint',
          start_date: '2025-01-01',
          end_date: '2025-01-14'
        })
        .select()
        .single();

      if (insertError) {
        console.log(`❌ Insert failed: ${insertError.message}`);
        return;
      }

      console.log(`✅ Test insert successful: ${testSprint.id}`);
      
      // Show the structure of the inserted record
      console.log('\n📋 Table structure (from inserted record):');
      Object.keys(testSprint).forEach(column => {
        const value = testSprint[column];
        console.log(`  - ${column}: ${typeof value} = ${value}`);
      });
      
      // Clean up the test record
      const { error: deleteError } = await supabase
        .from('sprints')
        .delete()
        .eq('id', testSprint.id);
        
      if (deleteError) {
        console.log(`⚠️  Could not clean up test record: ${deleteError.message}`);
      } else {
        console.log('🧹 Test record cleaned up');
      }

    } catch (err) {
      console.log(`❓ Insert test failed: ${err.message}`);
    }

  } catch (error) {
    console.error('❌ Error during structure check:', error);
  }
}

checkSprintTableStructure();
