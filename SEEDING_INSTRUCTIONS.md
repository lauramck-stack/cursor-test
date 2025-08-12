# Database Seeding Instructions

## Setup Instructions

### 1. Run the SQL Migration
Copy and paste the contents of `migrations/001_create_tables.sql` into your Supabase SQL Editor and run it.

### 2. Set Environment Variables
Create a `.env` file in your project root with:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Seed Script
```bash
npm run seed
```

## What Gets Created

- **3 Teams**: Frontend, Backend, DevOps
- **3 Super Domains**: User Experience, Platform Infrastructure, Business Features  
- **6 Domains**: Authentication, Dashboard, API Performance, Database, Payments, Reporting
- **8 Sprints**: 2 years of quarterly sprints (Q1-Q4 for current year + next year)
- **10 Roadmap Items**: Various features with different priorities, statuses, and effort estimates

## Database Schema

The migration creates a complete roadmap management system with:
- Teams for organization
- Super domains and domains for categorization
- Sprints for time-based planning
- Roadmap items with status, priority, and effort tracking
- Proper foreign key relationships and indexes
- Row Level Security enabled
- Automatic timestamp updates
