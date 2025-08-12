import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log('🌱 Starting Supabase database seeding...');

    // 1. Create teams
    console.log('Creating teams...');
    const teams = [
      { name: 'Frontend Team', description: 'Responsible for user interface and user experience' },
      { name: 'Backend Team', description: 'Handles server-side logic and database operations' },
      { name: 'DevOps Team', description: 'Manages infrastructure and deployment processes' }
    ];

    const { data: createdTeams, error: teamsError } = await supabase
      .from('teams')
      .insert(teams)
      .select();

    if (teamsError) throw teamsError;
    console.log(`✅ Created ${createdTeams.length} teams`);

    // 2. Create super domains
    console.log('Creating super domains...');
    const superDomains = [
      { name: 'User Experience', description: 'All user-facing features and improvements', color: '#3B82F6' },
      { name: 'Platform Infrastructure', description: 'Core system architecture and performance', color: '#10B981' },
      { name: 'Business Features', description: 'Revenue-generating and business-critical features', color: '#F59E0B' }
    ];

    const { data: createdSuperDomains, error: superDomainsError } = await supabase
      .from('super_domains')
      .insert(superDomains)
      .select();

    if (superDomainsError) throw superDomainsError;
    console.log(`✅ Created ${createdSuperDomains.length} super domains`);

    // 3. Create domains
    console.log('Creating domains...');
    const domains = [
      { 
        name: 'Authentication & Security', 
        description: 'User login, permissions, and security features',
        super_domain_id: createdSuperDomains[0].id,
        color: '#EF4444'
      },
      { 
        name: 'Dashboard & Analytics', 
        description: 'User dashboard and reporting features',
        super_domain_id: createdSuperDomains[0].id,
        color: '#8B5CF6'
      },
      { 
        name: 'API Performance', 
        description: 'Backend API optimization and caching',
        super_domain_id: createdSuperDomains[1].id,
        color: '#06B6D4'
      },
      { 
        name: 'Database Optimization', 
        description: 'Database queries and indexing improvements',
        super_domain_id: createdSuperDomains[1].id,
        color: '#84CC16'
      },
      { 
        name: 'Payment Processing', 
        description: 'Billing and subscription management',
        super_domain_id: createdSuperDomains[2].id,
        color: '#F97316'
      },
      { 
        name: 'Reporting & Insights', 
        description: 'Business intelligence and analytics',
        super_domain_id: createdSuperDomains[2].id,
        color: '#EC4899' }
    ];

    const { data: createdDomains, error: domainsError } = await supabase
      .from('domains')
      .insert(domains)
      .select();

    if (domainsError) throw domainsError;
    console.log(`✅ Created ${createdDomains.length} domains`);

    // 4. Create sprints for 2 years (8 quarters)
    console.log('Creating sprints...');
    const sprints = [];
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear; year < currentYear + 2; year++) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const quarterStartMonth = (quarter - 1) * 3;
        const startDate = new Date(year, quarterStartMonth, 1);
        const endDate = new Date(year, quarterStartMonth + 3, 0); // Last day of the quarter
        
        sprints.push({
          name: `Q${quarter} ${year}`,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          year: year,
          quarter: quarter,
          is_active: year === currentYear && quarter === 1 // Only current quarter is active
        });
      }
    }

    const { data: createdSprints, error: sprintsError } = await supabase
      .from('sprints')
      .insert(sprints)
      .select();

    if (sprintsError) throw sprintsError;
    console.log(`✅ Created ${createdSprints.length} sprints`);

    // 5. Create roadmap items
    console.log('Creating roadmap items...');
    const roadmapItems = [
      {
        title: 'Implement SSO Authentication',
        description: 'Add Single Sign-On support for enterprise customers using SAML and OAuth',
        status: 'planned',
        priority: 'high',
        effort_estimate: 13,
        team_id: createdTeams[0].id,
        domain_id: createdDomains[0].id,
        target_sprint_id: createdSprints[1].id
      },
      {
        title: 'Dashboard Performance Optimization',
        description: 'Improve dashboard loading times by implementing lazy loading and caching',
        status: 'in_progress',
        priority: 'medium',
        effort_estimate: 8,
        team_id: createdTeams[0].id,
        domain_id: createdDomains[1].id,
        sprint_id: createdSprints[0].id
      },
      {
        title: 'API Rate Limiting',
        description: 'Implement rate limiting for all public APIs to prevent abuse',
        status: 'planned',
        priority: 'critical',
        effort_estimate: 5,
        team_id: createdTeams[1].id,
        domain_id: createdDomains[2].id,
        target_sprint_id: createdSprints[0].id
      },
      {
        title: 'Database Query Optimization',
        description: 'Optimize slow database queries and add missing indexes',
        status: 'planned',
        priority: 'high',
        effort_estimate: 21,
        team_id: createdTeams[1].id,
        domain_id: createdDomains[3].id,
        target_sprint_id: createdSprints[2].id
      },
      {
        title: 'Stripe Payment Integration',
        description: 'Integrate Stripe for subscription billing and one-time payments',
        status: 'planned',
        priority: 'high',
        effort_estimate: 13,
        team_id: createdTeams[1].id,
        domain_id: createdDomains[4].id,
        target_sprint_id: createdSprints[1].id
      },
      {
        title: 'Advanced Analytics Dashboard',
        description: 'Create comprehensive analytics dashboard with charts and metrics',
        status: 'planned',
        priority: 'medium',
        effort_estimate: 34,
        team_id: createdTeams[0].id,
        domain_id: createdDomains[5].id,
        target_sprint_id: createdSprints[3].id
      },
      {
        title: 'CI/CD Pipeline Setup',
        description: 'Set up automated testing and deployment pipeline',
        status: 'in_progress',
        priority: 'high',
        effort_estimate: 13,
        team_id: createdTeams[2].id,
        domain_id: createdSuperDomains[1].id,
        sprint_id: createdSprints[0].id
      },
      {
        title: 'User Onboarding Flow',
        description: 'Improve new user experience with guided tours and tutorials',
        status: 'planned',
        priority: 'medium',
        effort_estimate: 8,
        team_id: createdTeams[0].id,
        domain_id: createdDomains[0].id,
        target_sprint_id: createdSprints[2].id
      },
      {
        title: 'Monitoring & Alerting',
        description: 'Implement comprehensive system monitoring and alerting',
        status: 'planned',
        priority: 'high',
        effort_estimate: 13,
        team_id: createdTeams[2].id,
        domain_id: createdSuperDomains[1].id,
        target_sprint_id: createdSprints[1].id
      },
      {
        title: 'Multi-language Support',
        description: 'Add internationalization support for multiple languages',
        status: 'planned',
        priority: 'low',
        effort_estimate: 21,
        team_id: createdTeams[0].id,
        domain_id: createdDomains[0].id,
        target_sprint_id: createdSprints[4].id
      }
    ];

    const { data: createdRoadmapItems, error: roadmapItemsError } = await supabase
      .from('roadmap_items')
      .insert(roadmapItems)
      .select();

    if (roadmapItemsError) throw roadmapItemsError;
    console.log(`✅ Created ${createdRoadmapItems.length} roadmap items`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`- Teams: ${createdTeams.length}`);
    console.log(`- Super Domains: ${createdSuperDomains.length}`);
    console.log(`- Domains: ${createdDomains.length}`);
    console.log(`- Sprints: ${createdSprints.length}`);
    console.log(`- Roadmap Items: ${createdRoadmapItems.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
