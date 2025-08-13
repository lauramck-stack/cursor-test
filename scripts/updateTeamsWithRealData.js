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

// Real team data with distinct colors
const realTeams = [
  { name: "Phoenix", description: "Team led by Jenny Owen", color: "#DC2626" },        // Red
  { name: "Sleipnir", description: "Team led by Adam Davies", color: "#7C3AED" },      // Purple
  { name: "Cerberus", description: "Team led by James Moore", color: "#059669" },      // Emerald
  { name: "Leviathan", description: "Team led by Adam Haynes", color: "#0EA5E9" },     // Sky Blue
  { name: "Owner App", description: "Team led by Adam Haynes", color: "#F59E0B" },     // Amber
  { name: "Titans", description: "Team led by Simon Wareham", color: "#8B5CF6" },      // Violet
  { name: "Kraken", description: "Team led by Matt Mincher", color: "#10B981" },       // Green
  { name: "Labubu Acellor", description: "External team", color: "#6B7280" },          // Gray
  { name: "Yogi", description: "Team led by Michael Evans", color: "#F97316" },        // Orange
  { name: "Wyvern", description: "Team led by Matt Lister", color: "#06B6D4" },        // Cyan
  { name: "Pegasus", description: "Team led by Alex Theobold", color: "#EC4899" },     // Pink
  { name: "Leprechaun", description: "Team led by Vaugen Wakeli", color: "#84CC16" },  // Lime
  { name: "Drake", description: "Team led by James Fairhurst", color: "#6366F1" },      // Indigo
  { name: "Goblin", description: "Team led by Phil Walker", color: "#EF4444" },        // Red
  { name: "Basilisk", description: "Team led by Andrew Beattie", color: "#8B5CF6" }     // Violet
];

async function updateTeamsWithRealData() {
  try {
    console.log('🔄 Starting team update with real team names...');
    
    // First, let's see what teams currently exist
    const { data: existingTeams, error: fetchError } = await supabase
      .from('teams')
      .select('*');

    if (fetchError) throw fetchError;

    console.log(`📊 Found ${existingTeams.length} existing teams:`);
    existingTeams.forEach(team => {
      console.log(`  - ${team.name} (${team.id})`);
    });

    // Delete all existing teams
    console.log('🗑️  Deleting all existing teams...');
    
    const { error: deleteError } = await supabase
      .from('teams')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a dummy condition)

    if (deleteError) throw deleteError;
    console.log('✅ Deleted all existing teams');

    // Create new teams with real data
    console.log('✨ Creating new teams with real names...');
    
    const newTeams = [];
    for (const team of realTeams) {
      const { data: newTeam, error: insertError } = await supabase
        .from('teams')
        .insert({
          name: team.name,
          description: team.description,
          color: team.color
        })
        .select()
        .single();

      if (insertError) {
        console.error(`❌ Error creating team ${team.name}: ${insertError.message}`);
        continue;
      }

      newTeams.push(newTeam);
      console.log(`✅ Created: ${team.name} (${team.color})`);
    }

    console.log(`\n🎉 Successfully created ${newTeams.length} new teams!`);
    
    // Show the final team list
    console.log('\n📋 Final Team List:');
    newTeams.forEach(team => {
      console.log(`  ${team.name} - ${team.description}`);
    });

    console.log('\n✨ Your roadmap now has the real team names!');
    console.log('🔄 Refresh your browser to see the new team columns!');

  } catch (error) {
    console.error('❌ Error during team update:', error);
  }
}

updateTeamsWithRealData();
