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

// Sprint data from the user's table
const sprintData = [
  // Q4 FY25
  { name: 'S21 FY25', start_date: '2025-07-03', end_date: '2025-07-16' },
  { name: 'S22 FY25', start_date: '2025-07-17', end_date: '2025-07-30' },
  { name: 'S23 FY25', start_date: '2025-07-31', end_date: '2025-08-13' },
  { name: 'S24 FY25', start_date: '2025-08-14', end_date: '2025-08-27' },
  { name: 'S25 FY25', start_date: '2025-08-28', end_date: '2025-09-10' },
  { name: 'S26 FY25', start_date: '2025-09-11', end_date: '2025-09-24' },
  
  // Q1 FY26
  { name: 'S1', start_date: '2025-09-25', end_date: '2025-10-08' },
  { name: 'S2', start_date: '2025-10-09', end_date: '2025-10-22' },
  { name: 'S3', start_date: '2025-10-23', end_date: '2025-11-05' },
  { name: 'S4', start_date: '2025-11-06', end_date: '2025-11-19' },
  { name: 'S5', start_date: '2025-11-20', end_date: '2025-12-03' },
  { name: 'S6', start_date: '2025-12-04', end_date: '2025-12-17' },
  { name: 'S7', start_date: '2025-12-18', end_date: '2025-12-31' },
  
  // Q2 FY26
  { name: 'S8', start_date: '2026-01-01', end_date: '2026-01-14' },
  { name: 'S9', start_date: '2026-01-15', end_date: '2026-01-28' },
  { name: 'S10', start_date: '2026-01-29', end_date: '2026-02-11' },
  { name: 'S11', start_date: '2026-02-12', end_date: '2026-02-25' },
  { name: 'S12', start_date: '2026-02-26', end_date: '2026-03-11' },
  { name: 'S13', start_date: '2026-03-12', end_date: '2026-03-25' },
  { name: 'S14', start_date: '2026-03-26', end_date: '2026-04-08' },
  
  // Q3 FY26
  { name: 'S15', start_date: '2026-04-09', end_date: '2026-04-22' },
  { name: 'S16', start_date: '2026-04-23', end_date: '2026-05-06' },
  { name: 'S17', start_date: '2026-05-07', end_date: '2026-05-20' },
  { name: 'S18', start_date: '2026-05-21', end_date: '2026-06-03' },
  { name: 'S19', start_date: '2026-06-04', end_date: '2026-06-17' },
  { name: 'S20', start_date: '2026-06-18', end_date: '2026-07-01' },
  
  // Q4 FY26
  { name: 'S21', start_date: '2026-07-02', end_date: '2026-07-15' },
  { name: 'S22', start_date: '2026-07-16', end_date: '2026-07-29' },
  { name: 'S23', start_date: '2026-07-30', end_date: '2026-08-12' },
  { name: 'S24', start_date: '2026-08-13', end_date: '2026-08-26' },
  { name: 'S25', start_date: '2026-08-27', end_date: '2026-09-09' },
  { name: 'S26', start_date: '2026-09-10', end_date: '2026-09-23' }
];

async function updateSprintsWithRealData() {
  try {
    console.log('🔄 Starting sprint update with real fiscal year data...');
    
    // First, let's see what sprints currently exist
    const { data: existingSprints, error: fetchError } = await supabase
      .from('sprints')
      .select('*');

    if (fetchError) throw fetchError;

    console.log(`📊 Found ${existingSprints.length} existing sprints`);

    // Check if there are any items currently assigned to sprints
    const { data: itemsWithSprints, error: itemsError } = await supabase
      .from('roadmap_items')
      .select('*')
      .not('sprint_id', 'is', null);

    if (itemsError) {
      console.log(`⚠️  Could not check items: ${itemsError.message}`);
    } else {
      console.log(`📦 Found ${itemsWithSprints?.length || 0} items currently assigned to sprints`);
      
      if (itemsWithSprints && itemsWithSprints.length > 0) {
        console.log('⚠️  These items will be moved to backlog (sprint_id set to null)');
        console.log('   You may need to reassign them to new sprints after the update');
      }
    }

    // Delete all existing sprints (this will cascade and remove sprint_id references)
    console.log('🗑️  Deleting all existing sprints...');
    
    const { error: deleteError } = await supabase
      .from('sprints')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a dummy condition)

    if (deleteError) throw deleteError;
    console.log('✅ Deleted all existing sprints');

    // Create new sprints with real data
    console.log('✨ Creating new sprints with real fiscal year data...');
    
    const newSprints = [];
    for (const sprint of sprintData) {
      const { data: newSprint, error: insertError } = await supabase
        .from('sprints')
        .insert({
          name: sprint.name,
          start_date: sprint.start_date,
          end_date: sprint.end_date
        })
        .select()
        .single();

      if (insertError) {
        console.error(`❌ Error creating sprint ${sprint.name}: ${insertError.message}`);
        continue;
      }

      newSprints.push(newSprint);
      console.log(`✅ Created: ${sprint.name} (${sprint.start_date} to ${sprint.end_date})`);
    }

    console.log(`\n🎉 Successfully created ${newSprints.length} new sprints!`);
    
    // Show the final structure grouped by fiscal quarters
    console.log('\n📋 Final Sprint Structure (Grouped by Fiscal Quarters):');
    const quarters = {
      'Q4 FY25': newSprints.slice(0, 6),
      'Q1 FY26': newSprints.slice(6, 13),
      'Q2 FY26': newSprints.slice(13, 20),
      'Q3 FY26': newSprints.slice(20, 26),
      'Q4 FY26': newSprints.slice(26, 32)
    };

    Object.entries(quarters).forEach(([quarter, sprints]) => {
      if (sprints.length > 0) {
        console.log(`  ${quarter}: ${sprints.map(s => s.name).join(', ')}`);
      }
    });

    console.log('\n✨ Your roadmap now has the real fiscal year sprint structure!');
    console.log('🔄 Refresh your browser to see the new sprint columns!');
    
    if (itemsWithSprints && itemsWithSprints.length > 0) {
      console.log('\n⚠️  Note: Any items that were previously assigned to sprints are now in the backlog.');
      console.log('   You can drag them from the team backlogs to the new sprint columns.');
    }

  } catch (error) {
    console.error('❌ Error during sprint update:', error);
  }
}

updateSprintsWithRealData();
