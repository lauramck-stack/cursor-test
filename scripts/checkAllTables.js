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

async function checkAllTables() {
  try {
    console.log('🔍 Checking all tables and their RLS status...');

    // List all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) throw tablesError;

    console.log(`📊 Found ${tables.length} tables:`);
    tables.forEach(table => console.log(`  - ${table.table_name}`));

    // Check RLS status for each table
    console.log('\n🔒 Checking RLS status for each table...');
    
    for (const table of tables) {
      const tableName = table.table_name;
      
      try {
        // Try to select from the table to check RLS
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error && error.code === '42501') {
          console.log(`  ❌ ${tableName}: RLS enabled and blocking access`);
        } else if (error) {
          console.log(`  ⚠️  ${tableName}: Error (${error.code}): ${error.message}`);
        } else {
          console.log(`  ✅ ${tableName}: Accessible`);
        }
      } catch (err) {
        console.log(`  ❓ ${tableName}: Could not check (${err.message})`);
      }
    }

    // Check if roadmap_item_history table exists and has data
    console.log('\n📋 Checking roadmap_item_history table specifically...');
    try {
      const { data: historyData, error: historyError } = await supabase
        .from('roadmap_item_history')
        .select('*')
        .limit(5);

      if (historyError) {
        console.log(`  ❌ Error accessing roadmap_item_history: ${historyError.message}`);
      } else {
        console.log(`  ✅ roadmap_item_history accessible, found ${historyData?.length || 0} records`);
        if (historyData && historyData.length > 0) {
          console.log(`  📝 Sample record:`, historyData[0]);
        }
      }
    } catch (err) {
      console.log(`  ❓ roadmap_item_history: ${err.message}`);
    }

  } catch (error) {
    console.error('❌ Error during table check:', error);
  }
}

checkAllTables();
