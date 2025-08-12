import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'undefined');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('📡 Testing connection to teams table...');
    
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Success! Found', data.length, 'teams');
      console.log('Sample data:', data);
    }
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

testConnection();
