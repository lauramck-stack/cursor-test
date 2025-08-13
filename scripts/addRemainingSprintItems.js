import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Corrected sprint mapping based on actual sprint names
const sprintMapping = {
  'S1': 'S1',
  'S2': 'S2',
  'S3': 'S3',
  'S4': 'S4',
  'S5': 'S5',
  'S6': 'S6',
  'S7': 'S7'
};

// Remaining roadmap items that need to be added
const remainingItems = [
  // Sleipnir Team Items
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

async function addRemainingSprintItems() {
  try {
    console.log('🔄 Starting to add remaining sprint roadmap items...');
    
    // Fetch existing data
    const { data: teams, error: teamsError } = await supabase.from('teams').select('*');
    if (teamsError) throw teamsError;
    
    const { data: sprints, error: sprintsError } = await supabase.from('sprints').select('*');
    if (sprintsError) throw sprintsError;
    
    console.log(`📊 Found ${teams.length} teams and ${sprints.length} sprints`);
    
    // Add remaining roadmap items
    console.log('✨ Creating remaining sprint roadmap items...');
    const newItems = [];
    
    for (const item of remainingItems) {
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
    
    console.log(`\n🎉 Successfully created ${newItems.length} remaining roadmap items!`);
    
    // Summary by team and sprint
    console.log('\n📋 Remaining Items by Team and Sprint:');
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
    
    console.log('\n✨ Your roadmap now has ALL the sprint items from the provided roadmap!');
    console.log('🔄 Refresh your browser to see the complete populated sprint columns!');
    
  } catch (error) {
    console.error('❌ Error during remaining roadmap item creation:', error);
  }
}

addRemainingSprintItems();
