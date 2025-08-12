-- Temporarily disable RLS for seeding
-- Run this before seeding your database

-- Disable RLS on all tables
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE super_domains DISABLE ROW LEVEL SECURITY;
ALTER TABLE domains DISABLE ROW LEVEL SECURITY;
ALTER TABLE sprints DISABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('teams', 'super_domains', 'domains', 'sprints', 'roadmap_items');
