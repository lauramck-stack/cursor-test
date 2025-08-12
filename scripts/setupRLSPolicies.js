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

async function setupRLSPolicies() {
  try {
    console.log('🔐 Setting up proper RLS policies...');

    // First, let's enable RLS on all tables to ensure it's on
    const tables = ['teams', 'super_domains', 'domains', 'sprints', 'roadmap_items'];
    
    for (const table of tables) {
      try {
        console.log(`\n📋 Setting up policies for ${table}...`);
        
        // Enable RLS
        const { error: enableError } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`
        });

        if (enableError) {
          console.log(`⚠️  Could not enable RLS via RPC for ${table} - ${enableError.message}`);
        } else {
          console.log(`✅ RLS enabled for ${table}`);
        }

        // Drop existing policies if they exist
        try {
          await supabase.rpc('exec_sql', {
            sql: `DROP POLICY IF EXISTS "Enable read access for all users" ON ${table};`
          });
          await supabase.rpc('exec_sql', {
            sql: `DROP POLICY IF EXISTS "Enable insert access for all users" ON ${table};`
          });
          await supabase.rpc('exec_sql', {
            sql: `DROP POLICY IF EXISTS "Enable update access for all users" ON ${table};`
          });
          await supabase.rpc('exec_sql', {
            sql: `DROP POLICY IF EXISTS "Enable delete access for all users" ON ${table};`
          });
          console.log(`🗑️  Dropped existing policies for ${table}`);
        } catch (dropError) {
          console.log(`⚠️  Could not drop policies for ${table} - ${dropError.message}`);
        }

        // Create read policy - allow all users to read
        const { error: readError } = await supabase.rpc('exec_sql', {
          sql: `CREATE POLICY "Enable read access for all users" ON ${table} FOR SELECT USING (true);`
        });

        if (readError) {
          console.log(`❌ Could not create read policy for ${table} - ${readError.message}`);
        } else {
          console.log(`✅ Read policy created for ${table}`);
        }

        // Create insert policy - allow all users to insert
        const { error: insertError } = await supabase.rpc('exec_sql', {
          sql: `CREATE POLICY "Enable insert access for all users" ON ${table} FOR INSERT WITH CHECK (true);`
        });

        if (insertError) {
          console.log(`❌ Could not create insert policy for ${table} - ${insertError.message}`);
        } else {
          console.log(`✅ Insert policy created for ${table}`);
        }

        // Create update policy - allow all users to update
        const { error: updateError } = await supabase.rpc('exec_sql', {
          sql: `CREATE POLICY "Enable update access for all users" ON ${table} FOR UPDATE USING (true) WITH CHECK (true);`
        });

        if (updateError) {
          console.log(`❌ Could not create update policy for ${table} - ${updateError.message}`);
        } else {
          console.log(`✅ Update policy created for ${table}`);
        }

        // Create delete policy - allow all users to delete
        const { error: deleteError } = await supabase.rpc('exec_sql', {
          sql: `CREATE POLICY "Enable delete access for all users" ON ${table} FOR DELETE USING (true);`
        });

        if (deleteError) {
          console.log(`❌ Could not create delete policy for ${table} - ${deleteError.message}`);
        } else {
          console.log(`✅ Delete policy created for ${table}`);
        }

      } catch (err) {
        console.log(`❌ Error setting up policies for ${table} - ${err.message}`);
      }
    }

    console.log('\n🎉 RLS policy setup complete!');
    console.log('\n📝 Note: If RPC method fails, you may need to manually create policies in the Supabase dashboard:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to Authentication > Policies');
    console.log('3. For each table, create policies with these names:');
    console.log('   - "Enable read access for all users" (SELECT, USING: true)');
    console.log('   - "Enable insert access for all users" (INSERT, WITH CHECK: true)');
    console.log('   - "Enable update access for all users" (UPDATE, USING: true, WITH CHECK: true)');
    console.log('   - "Enable delete access for all users" (DELETE, USING: true)');

  } catch (error) {
    console.error('❌ Error setting up RLS policies:', error);
  }
}

setupRLSPolicies();
