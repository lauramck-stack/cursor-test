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

async function checkRLS() {
  try {
    console.log('🔍 Checking RLS status...');

    // Check RLS status for each table
    const tables = ['teams', 'super_domains', 'domains', 'sprints', 'roadmap_items'];
    
    for (const table of tables) {
      try {
        // Try to insert a test row
        const testData = table === 'teams' ? { name: 'Test Team', description: 'Test' } :
                        table === 'super_domains' ? { name: 'Test Domain', description: 'Test' } :
                        table === 'domains' ? { name: 'Test Domain', description: 'Test' } :
                        table === 'sprints' ? { name: 'Test Sprint', start_date: '2024-01-01', end_date: '2024-01-31' } :
                        { title: 'Test Item', description: 'Test', status: 'planned', priority: 'medium', effort: 'medium', team_id: '00000000-0000-0000-0000-000000000000', domain_id: '00000000-0000-0000-0000-000000000000' };

        const { error } = await supabase
          .from(table)
          .insert(testData);

        if (error) {
          if (error.code === '42501') {
            console.log(`❌ ${table}: RLS enabled - insertion blocked`);
          } else {
            console.log(`⚠️  ${table}: Other error - ${error.message}`);
          }
        } else {
          console.log(`✅ ${table}: RLS disabled or allows insertion`);
          // Clean up test data
          await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        }
      } catch (err) {
        console.log(`❌ ${table}: Error checking - ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error checking RLS:', error);
  }
}

checkRLS();
