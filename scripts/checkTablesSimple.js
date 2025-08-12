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

// Known tables from the project
const knownTables = [
  'teams',
  'super_domains', 
  'domains',
  'sprints',
  'roadmap_items',
  'roadmap_item_history'
];

async function checkTablesSimple() {
  try {
    console.log('🔍 Checking known tables and their RLS status...');

    for (const tableName of knownTables) {
      try {
        console.log(`\n📋 Checking ${tableName}...`);
        
        // Try to select from the table
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          if (error.code === '42501') {
            console.log(`  ❌ RLS enabled and blocking access`);
          } else {
            console.log(`  ⚠️  Error (${error.code}): ${error.message}`);
          }
        } else {
          console.log(`  ✅ Accessible, found ${data?.length || 0} records`);
        }

        // Try to get table info
        try {
          const { count, error: countError } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (!countError) {
            console.log(`  📊 Total records: ${count}`);
          }
        } catch (err) {
          console.log(`  📊 Could not get count: ${err.message}`);
        }

      } catch (err) {
        console.log(`  ❓ Could not check: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error during table check:', error);
  }
}

checkTablesSimple();
