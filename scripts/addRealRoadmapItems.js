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

// Real roadmap items based on the user's table
const realRoadmapItems = [
  // Leviathan team items
  {
    title: "Favourites Wishlist",
    description: "Implement favourites wishlist functionality for Leviathan",
    team_name: "Leviathan",
    domain_name: "Customer ap",
    sprint_name: "S24",
    priority: "high",
    effort: "medium",
    status: "planned"
  },
  {
    title: "Post Hog",
    description: "Post Hog implementation for Leviathan",
    team_name: "Leviathan",
    domain_name: "Customer ap",
    sprint_name: "S26",
    priority: "medium",
    effort: "small",
    status: "planned"
  },
  {
    title: "MUS",
    description: "MUS implementation for Leviathan",
    team_name: "Leviathan",
    domain_name: "MUS",
    sprint_name: "S4",
    priority: "high",
    effort: "large",
    status: "planned"
  },
  {
    title: "Ancillary Wins",
    description: "Ancillary wins feature for Leviathan",
    team_name: "Leviathan",
    domain_name: "Customer ap",
    sprint_name: "S4",
    priority: "medium",
    effort: "medium",
    status: "planned"
  },
  {
    title: "Ops Alignment",
    description: "Operations alignment for Leviathan",
    team_name: "Leviathan",
    domain_name: "Customer ap",
    sprint_name: "S4",
    priority: "medium",
    effort: "medium",
    status: "planned"
  },

  // Owner App team items
  {
    title: "Updates/bugs/catch up (Google requirements, One Trust requirements)",
    description: "Updates, bug fixes, and catch up work for Google and One Trust requirements",
    team_name: "Owner App",
    domain_name: "Sykes owner",
    sprint_name: "S24",
    priority: "high",
    effort: "medium",
    status: "planned"
  },
  {
    title: "Post Hog",
    description: "Post Hog implementation for Owner App",
    team_name: "Owner App",
    domain_name: "Sykes owner",
    sprint_name: "S26",
    priority: "medium",
    effort: "small",
    status: "planned"
  },
  {
    title: "OEDC data collection",
    description: "OEDC data collection implementation for Owner App",
    team_name: "Owner App",
    domain_name: "Sykes owner",
    sprint_name: "S1",
    priority: "high",
    effort: "medium",
    status: "planned"
  },
  {
    title: "Future month breakdown",
    description: "Future month breakdown feature for Owner App",
    team_name: "Owner App",
    domain_name: "Sykes owner",
    sprint_name: "S3",
    priority: "medium",
    effort: "small",
    status: "planned"
  },
  {
    title: "Proactive owner sentiment survey",
    description: "Proactive owner sentiment survey implementation for Owner App",
    team_name: "Owner App",
    domain_name: "Sykes owner",
    sprint_name: "S4",
    priority: "high",
    effort: "medium",
    status: "planned"
  },
  {
    title: "Owner marketing stats",
    description: "Owner marketing statistics feature for Owner App",
    team_name: "Owner App",
    domain_name: "Sykes owner",
    sprint_name: "S6",
    priority: "medium",
    effort: "small",
    status: "planned"
  }
];

async function addRealRoadmapItems() {
  try {
    console.log('🔄 Starting to add real roadmap items...');
    
    // Get teams, domains, and sprints for mapping
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*');

    if (teamsError) throw teamsError;

    const { data: domains, error: domainsError } = await supabase
      .from('domains')
      .select('*');

    if (domainsError) throw domainsError;

    const { data: sprints, error: sprintsError } = await supabase
      .from('sprints')
      .select('*');

    if (sprintsError) throw sprintsError;

    console.log(`📊 Found ${teams.length} teams, ${domains.length} domains, ${sprints.length} sprints`);

    // Clear existing roadmap items
    console.log('🗑️  Clearing existing roadmap items...');
    const { error: deleteError } = await supabase
      .from('roadmap_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) throw deleteError;
    console.log('✅ Cleared existing roadmap items');

    // Create new roadmap items
    console.log('✨ Creating new roadmap items...');
    
    const newItems = [];
    for (const item of realRoadmapItems) {
      // Find team ID
      const team = teams.find(t => t.name === item.team_name);
      if (!team) {
        console.error(`❌ Could not find team: ${item.team_name}`);
        continue;
      }

      // Find domain ID
      const domain = domains.find(d => d.name === item.domain_name);
      if (!domain) {
        console.error(`❌ Could not find domain: ${item.domain_name}`);
        continue;
      }

      // Find sprint ID (if assigned)
      let sprintId = null;
      if (item.sprint_name) {
        const sprint = sprints.find(s => s.name === item.sprint_name);
        if (sprint) {
          sprintId = sprint.id;
        } else {
          console.warn(`⚠️  Could not find sprint: ${item.sprint_name}, item will go to backlog`);
        }
      }

      const { data: newItem, error: insertError } = await supabase
        .from('roadmap_items')
        .insert({
          title: item.title,
          description: item.description,
          team_id: team.id,
          domain_id: domain.id,
          sprint_id: sprintId,
          priority: item.priority,
          effort: item.effort,
          status: item.status
        })
        .select()
        .single();

      if (insertError) {
        console.error(`❌ Error creating item ${item.title}: ${insertError.message}`);
        continue;
      }

      newItems.push(newItem);
      const location = sprintId ? `sprint ${item.sprint_name}` : 'team backlog';
      console.log(`✅ Created: ${item.title} in ${location}`);
    }

    console.log(`\n🎉 Successfully created ${newItems.length} new roadmap items!`);
    
    // Show summary by team
    console.log('\n📋 Roadmap Items by Team:');
    const itemsByTeam = {};
    newItems.forEach(item => {
      const team = teams.find(t => t.id === item.team_id);
      const teamName = team ? team.name : 'Unknown';
      if (!itemsByTeam[teamName]) {
        itemsByTeam[teamName] = [];
      }
      itemsByTeam[teamName].push(item.title);
    });

    Object.entries(itemsByTeam).forEach(([teamName, itemTitles]) => {
      console.log(`  ${teamName}:`);
      itemTitles.forEach(title => {
        console.log(`    - ${title}`);
      });
    });

    console.log('\n✨ Your roadmap now has real work items!');
    console.log('🔄 Refresh your browser to see the populated roadmap!');

  } catch (error) {
    console.error('❌ Error during roadmap item creation:', error);
  }
}

addRealRoadmapItems();
