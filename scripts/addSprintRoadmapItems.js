import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Sprint mapping based on the roadmap
const sprintMapping = {
  'S23': 'S23 FY25',
  'S24': 'S24 FY25', 
  'S25': 'S25 FY25',
  'S26': 'S26 FY25',
  'S1': 'S1 FY26',
  'S2': 'S2 FY26',
  'S3': 'S3 FY26',
  'S4': 'S4 FY26',
  'S5': 'S5 FY26',
  'S6': 'S6 FY26',
  'S7': 'S7 FY26'
};

// Roadmap items data from the provided roadmap
const roadmapItems = [
  // Sleipnir Team Items
  {
    title: 'Cust App CO',
    description: 'Customer App CO functionality',
    team_name: 'Sleipnir',
    sprint_name: 'S23',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'DDW',
    description: 'DDW implementation',
    team_name: 'Sleipnir',
    sprint_name: 'S23',
    priority: 'medium',
    effort: 'small',
    status: 'planned'
  },
  {
    title: 'Damage Updates',
    description: 'Damage updates functionality',
    team_name: 'Sleipnir',
    sprint_name: 'S23',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Persistent login',
    description: 'Implement persistent login functionality',
    team_name: 'Sleipnir',
    sprint_name: 'S24',
    priority: 'high',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Confirm guest email address',
    description: 'Guest email address confirmation feature',
    team_name: 'Sleipnir',
    sprint_name: 'S24',
    priority: 'medium',
    effort: 'small',
    status: 'planned'
  },
  {
    title: 'SPIKE: Partner Booking Account Creation',
    description: 'Spike investigation for partner booking account creation',
    team_name: 'Sleipnir',
    sprint_name: 'S24',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Tech Sprint',
    description: 'Technical sprint for infrastructure and improvements',
    team_name: 'Sleipnir',
    sprint_name: 'S25',
    priority: 'medium',
    effort: 'large',
    status: 'planned'
  },
  {
    title: 'Ancillary Improvements: Offering Travel & Damage Insurance on the Booking Confirmation & My Account',
    description: 'Add travel and damage insurance options to booking confirmation and my account',
    team_name: 'Sleipnir',
    sprint_name: 'S26',
    priority: 'high',
    effort: 'large',
    status: 'planned'
  },
  {
    title: 'Spike: Early Check In',
    description: 'Spike investigation for early check-in functionality',
    team_name: 'Sleipnir',
    sprint_name: 'S26',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Partner Booking Account Creation (tbc)',
    description: 'Partner booking account creation functionality (to be confirmed)',
    team_name: 'Sleipnir',
    sprint_name: 'S1',
    priority: 'medium',
    effort: 'large',
    status: 'planned'
  },
  {
    title: 'Early check in',
    description: 'Early check-in functionality implementation',
    team_name: 'Sleipnir',
    sprint_name: 'S1',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Search freetext redesign + property types (MUS)',
    description: 'Redesign search freetext and property types for MUS',
    team_name: 'Sleipnir',
    sprint_name: 'S2',
    priority: 'high',
    effort: 'large',
    status: 'planned'
  },
  {
    title: 'Holiday Parks tab in Mega Menu',
    description: 'Add holiday parks tab to the mega menu',
    team_name: 'Sleipnir',
    sprint_name: 'S3',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Homepage - additional new carousel on Homepage',
    description: 'Add additional new carousel to homepage',
    team_name: 'Sleipnir',
    sprint_name: 'S3',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Search results: Add Property collections filter (MUS)',
    description: 'Add property collections filter to search results for MUS',
    team_name: 'Sleipnir',
    sprint_name: 'S4',
    priority: 'high',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Property page - Holiday park information tab (out of modal)',
    description: 'Move holiday park information tab out of modal on property page',
    team_name: 'Sleipnir',
    sprint_name: 'S4',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Search results include park level features',
    description: 'Include park level features in search results',
    team_name: 'Sleipnir',
    sprint_name: 'S5',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Late Check Out',
    description: 'Late check-out functionality implementation',
    team_name: 'Sleipnir',
    sprint_name: 'S6',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Ancillary improvements',
    description: 'General ancillary improvements',
    team_name: 'Sleipnir',
    sprint_name: 'S7',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },

  // Phoenix Team Items
  {
    title: 'Booking Fee Test',
    description: 'Test implementation of booking fees',
    team_name: 'Phoenix',
    sprint_name: 'S23',
    priority: 'high',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Homepage collections carousel (MUS)',
    description: 'Add collections carousel to homepage for MUS',
    team_name: 'Phoenix',
    sprint_name: 'S23',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Holiday park tab in property carousel (MUS)',
    description: 'Add holiday park tab to property carousel for MUS',
    team_name: 'Phoenix',
    sprint_name: 'S23',
    priority: 'medium',
    effort: 'small',
    status: 'planned'
  },
  {
    title: 'Add PostHog',
    description: 'Implement PostHog analytics',
    team_name: 'Phoenix',
    sprint_name: 'S24',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  },
  {
    title: 'Holiday Parks: Shopfront Landing Page (MUS)',
    description: 'Create shopfront landing page for holiday parks in MUS',
    team_name: 'Phoenix',
    sprint_name: 'S25',
    priority: 'high',
    effort: 'large',
    status: 'planned'
  },
  {
    title: 'Holiday Parks: Destination level Landing Page (MUS)',
    description: 'Create destination level landing page for holiday parks in MUS',
    team_name: 'Phoenix',
    sprint_name: 'S25',
    priority: 'high',
    effort: 'large',
    status: 'planned'
  },
  {
    title: 'Holiday Parks: Collection level Landing Page (MUS)',
    description: 'Create collection level landing page for holiday parks in MUS',
    team_name: 'Phoenix',
    sprint_name: 'S25',
    priority: 'high',
    effort: 'large',
    status: 'planned'
  },
  {
    title: 'Tech Sprint',
    description: 'Technical sprint for infrastructure and improvements',
    team_name: 'Phoenix',
    sprint_name: 'S26',
    priority: 'medium',
    effort: 'large',
    status: 'planned'
  },
  {
    title: 'Search results at park page level by cabin/property with intermediary search step',
    description: 'Implement search results at park page level with intermediary search step',
    team_name: 'Phoenix',
    sprint_name: 'S2',
    priority: 'high',
    effort: 'large',
    status: 'planned'
  },
  {
    title: 'Homepage Property Types / Collections drop down in search',
    description: 'Add property types and collections dropdown to homepage search',
    team_name: 'Phoenix',
    sprint_name: 'S6',
    priority: 'medium',
    effort: 'medium',
    status: 'planned'
  }
];

async function addSprintRoadmapItems() {
  try {
    console.log('🔄 Starting to add sprint roadmap items...');
    
    // Fetch existing data
    const { data: teams, error: teamsError } = await supabase.from('teams').select('*');
    if (teamsError) throw teamsError;
    
    const { data: sprints, error: sprintsError } = await supabase.from('sprints').select('*');
    if (sprintsError) throw sprintsError;
    
    console.log(`📊 Found ${teams.length} teams and ${sprints.length} sprints`);
    
    // Clear existing roadmap items
    console.log('🗑️  Clearing existing roadmap items...');
    const { error: deleteError } = await supabase.from('roadmap_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) throw deleteError;
    console.log('✅ Cleared existing roadmap items');
    
    // Add new roadmap items
    console.log('✨ Creating new sprint roadmap items...');
    const newItems = [];
    
    for (const item of roadmapItems) {
      const team = teams.find(t => t.name === item.team_name);
      if (!team) {
        console.error(`❌ Could not find team: ${item.team_name}`);
        continue;
      }
      
      const sprint = sprints.find(s => s.name === sprintMapping[item.sprint_name]);
      if (!sprint) {
        console.error(`❌ Could not find sprint: ${sprintMapping[item.sprint_name]}`);
        continue;
      }
      
      const { data: newItem, error: insertError } = await supabase
        .from('roadmap_items')
        .insert({
          title: item.title,
          description: item.description,
          team_id: team.id,
          domain_id: null, // Will be set later if needed
          sprint_id: sprint.id,
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
      console.log(`✅ Created: ${item.title} for ${item.team_name} in ${item.sprint_name}`);
    }
    
    console.log(`\n🎉 Successfully created ${newItems.length} new roadmap items!`);
    
    // Summary by team and sprint
    console.log('\n📋 Roadmap Items by Team and Sprint:');
    const itemsByTeam = {};
    newItems.forEach(item => {
      const team = teams.find(t => t.id === item.team_id);
      const sprint = sprints.find(s => s.id === item.sprint_id);
      const teamName = team ? team.name : 'Unknown';
      const sprintName = sprint ? sprint.name : 'Unknown';
      
      if (!itemsByTeam[teamName]) {
        itemsByTeam[teamName] = {};
      }
      if (!itemsByTeam[teamName][sprintName]) {
        itemsByTeam[teamName][sprintName] = [];
      }
      itemsByTeam[teamName][sprintName].push(item.title);
    });
    
    Object.entries(itemsByTeam).forEach(([teamName, sprintItems]) => {
      console.log(`\n  ${teamName}:`);
      Object.entries(sprintItems).forEach(([sprintName, itemTitles]) => {
        console.log(`    ${sprintName}:`);
        itemTitles.forEach(title => {
          console.log(`      - ${title}`);
        });
      });
    });
    
    console.log('\n✨ Your roadmap now has all the sprint items from the provided roadmap!');
    console.log('🔄 Refresh your browser to see the populated sprint columns!');
    
  } catch (error) {
    console.error('❌ Error during roadmap item creation:', error);
  }
}

addSprintRoadmapItems();
