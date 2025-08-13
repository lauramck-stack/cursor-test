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

// Real domain data organized by super domains
const realDomains = [
  // Customer super domain
  { name: "Sykes custom", description: "Sykes customer features", super_domain_name: "Customer", color: "#60A5FA" },
  { name: "Forest custor", description: "Forest customer features", super_domain_name: "Customer", color: "#34D399" },
  
  // Owner super domain
  { name: "Onboarding", description: "Onboarding features", super_domain_name: "Owner", color: "#10B981" },
  { name: "Sykes owner", description: "Sykes owner features", super_domain_name: "Owner", color: "#F59E0B" },
  
  // Platform & AI super domain
  { name: "Customer ap", description: "Customer app features", super_domain_name: "Platform & AI", color: "#EF4444" },
  { name: "MUS", description: "MUS features", super_domain_name: "Platform & AI", color: "#8B5CF6" },
  { name: "Partners", description: "Partner features", super_domain_name: "Platform & AI", color: "#06B6D4" },
  { name: "Finance", description: "Finance features", super_domain_name: "Platform & AI", color: "#F97316" },
  { name: "Finance Surg", description: "Finance surgery features", super_domain_name: "Platform & AI", color: "#84CC16" },
  { name: "Fanghorn", description: "Fanghorn platform features", super_domain_name: "Platform & AI", color: "#A78BFA" }
];

async function updateDomainsWithRealData() {
  try {
    console.log('🔄 Starting domain update with real names...');
    
    // First, let's see what domains currently exist
    const { data: existingDomains, error: fetchError } = await supabase
      .from('domains')
      .select('*');

    if (fetchError) throw fetchError;

    console.log(`📊 Found ${existingDomains.length} existing domains:`);
    existingDomains.forEach(domain => {
      console.log(`  - ${domain.name} (${domain.id})`);
    });

    // Get the super domains to map IDs
    const { data: superDomains, error: superDomainsError } = await supabase
      .from('super_domains')
      .select('*');

    if (superDomainsError) throw superDomainsError;

    console.log(`📋 Found ${superDomains.length} super domains for mapping`);

    // Delete all existing domains
    console.log('🗑️  Deleting all existing domains...');
    
    const { error: deleteError } = await supabase
      .from('domains')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a dummy condition)

    if (deleteError) throw deleteError;
    console.log('✅ Deleted all existing domains');

    // Create new domains with real data
    console.log('✨ Creating new domains with real names...');
    
    const newDomains = [];
    for (const domain of realDomains) {
      // Find the super domain ID
      const superDomain = superDomains.find(sd => sd.name === domain.super_domain_name);
      if (!superDomain) {
        console.error(`❌ Could not find super domain: ${domain.super_domain_name}`);
        continue;
      }

      const { data: newDomain, error: insertError } = await supabase
        .from('domains')
        .insert({
          name: domain.name,
          description: domain.description,
          color: domain.color,
          super_domain_id: superDomain.id
        })
        .select()
        .single();

      if (insertError) {
        console.error(`❌ Error creating domain ${domain.name}: ${insertError.message}`);
        continue;
      }

      newDomains.push(newDomain);
      console.log(`✅ Created: ${domain.name} under ${domain.super_domain_name} (${domain.color})`);
    }

    console.log(`\n🎉 Successfully created ${newDomains.length} new domains!`);
    
    // Show the final domain list organized by super domain
    console.log('\n📋 Final Domain List by Super Domain:');
    const domainsBySuperDomain = {};
    newDomains.forEach(domain => {
      const superDomainName = realDomains.find(d => d.name === domain.name)?.super_domain_name || 'Unknown';
      if (!domainsBySuperDomain[superDomainName]) {
        domainsBySuperDomain[superDomainName] = [];
      }
      domainsBySuperDomain[superDomainName].push(domain.name);
    });

    Object.entries(domainsBySuperDomain).forEach(([superDomain, domains]) => {
      console.log(`  ${superDomain}:`);
      domains.forEach(domainName => {
        console.log(`    - ${domainName}`);
      });
    });

    console.log('\n✨ Your roadmap now has the real domain names!');
    console.log('🔄 Refresh your browser to see the new domain structure!');

  } catch (error) {
    console.error('❌ Error during domain update:', error);
  }
}

updateDomainsWithRealData();
