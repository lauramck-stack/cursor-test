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

// Real super domain data with distinct colors
const realSuperDomains = [
  { name: "Customer", description: "Customer-facing features and services", color: "#3B82F6" },      // Blue
  { name: "Owner", description: "Owner-specific features and services", color: "#10B981" },        // Green
  { name: "Platform & AI", description: "Platform infrastructure and AI capabilities", color: "#8B5CF6" }  // Purple
];

async function updateSuperDomainsWithRealData() {
  try {
    console.log('🔄 Starting super domain update with real names...');
    
    // First, let's see what super domains currently exist
    const { data: existingSuperDomains, error: fetchError } = await supabase
      .from('super_domains')
      .select('*');

    if (fetchError) throw fetchError;

    console.log(`📊 Found ${existingSuperDomains.length} existing super domains:`);
    existingSuperDomains.forEach(superDomain => {
      console.log(`  - ${superDomain.name} (${superDomain.id})`);
    });

    // Delete all existing super domains
    console.log('🗑️  Deleting all existing super domains...');
    
    const { error: deleteError } = await supabase
      .from('super_domains')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a dummy condition)

    if (deleteError) throw deleteError;
    console.log('✅ Deleted all existing super domains');

    // Create new super domains with real data
    console.log('✨ Creating new super domains with real names...');
    
    const newSuperDomains = [];
    for (const superDomain of realSuperDomains) {
      const { data: newSuperDomain, error: insertError } = await supabase
        .from('super_domains')
        .insert({
          name: superDomain.name,
          description: superDomain.description,
          color: superDomain.color
        })
        .select()
        .single();

      if (insertError) {
        console.error(`❌ Error creating super domain ${superDomain.name}: ${insertError.message}`);
        continue;
      }

      newSuperDomains.push(newSuperDomain);
      console.log(`✅ Created: ${superDomain.name} (${superDomain.color})`);
    }

    console.log(`\n🎉 Successfully created ${newSuperDomains.length} new super domains!`);
    
    // Show the final super domain list
    console.log('\n📋 Final Super Domain List:');
    newSuperDomains.forEach(superDomain => {
      console.log(`  ${superDomain.name} - ${superDomain.description}`);
    });

    console.log('\n✨ Your roadmap now has the real super domain names!');
    console.log('🔄 Refresh your browser to see the new super domain structure!');

  } catch (error) {
    console.error('❌ Error during super domain update:', error);
  }
}

updateSuperDomainsWithRealData();
