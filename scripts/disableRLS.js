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

async function disableRLS() {
  try {
    console.log('🔓 Disabling RLS on all tables...');

    const tables = ['teams', 'super_domains', 'domains', 'sprints', 'roadmap_items'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`
        });

        if (error) {
          console.log(`⚠️  ${table}: Could not disable RLS via RPC - ${error.message}`);
          // Try alternative method
          try {
            const { error: altError } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            if (altError && altError.code === '42501') {
              console.log(`❌ ${table}: RLS still enabled - manual intervention needed`);
            } else {
              console.log(`✅ ${table}: RLS appears to be disabled`);
            }
          } catch (altErr) {
            console.log(`❌ ${table}: Error checking RLS status - ${altErr.message}`);
          }
        } else {
          console.log(`✅ ${table}: RLS disabled successfully`);
        }
      } catch (err) {
        console.log(`❌ ${table}: Error disabling RLS - ${err.message}`);
      }
    }

    console.log('\n📝 Note: If RPC method fails, you may need to manually disable RLS in the Supabase dashboard:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run: ALTER TABLE teams DISABLE ROW LEVEL SECURITY;');
    console.log('4. Repeat for other tables');

  } catch (error) {
    console.error('❌ Error disabling RLS:', error);
  }
}

disableRLS();
