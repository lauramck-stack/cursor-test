-- RLS Policies for Roadmap App
-- Run this script in your Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_item_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON teams;
DROP POLICY IF EXISTS "Enable insert access for all users" ON teams;
DROP POLICY IF EXISTS "Enable update access for all users" ON teams;
DROP POLICY IF EXISTS "Enable delete access for all users" ON teams;

DROP POLICY IF EXISTS "Enable read access for all users" ON super_domains;
DROP POLICY IF EXISTS "Enable insert access for all users" ON super_domains;
DROP POLICY IF EXISTS "Enable update access for all users" ON super_domains;
DROP POLICY IF EXISTS "Enable delete access for all users" ON super_domains;

DROP POLICY IF EXISTS "Enable read access for all users" ON domains;
DROP POLICY IF EXISTS "Enable insert access for all users" ON domains;
DROP POLICY IF EXISTS "Enable update access for all users" ON domains;
DROP POLICY IF EXISTS "Enable delete access for all users" ON domains;

DROP POLICY IF EXISTS "Enable read access for all users" ON sprints;
DROP POLICY IF EXISTS "Enable insert access for all users" ON sprints;
DROP POLICY IF EXISTS "Enable update access for all users" ON sprints;
DROP POLICY IF EXISTS "Enable delete access for all users" ON sprints;

DROP POLICY IF EXISTS "Enable read access for all users" ON roadmap_items;
DROP POLICY IF EXISTS "Enable insert access for all users" ON roadmap_items;
DROP POLICY IF EXISTS "Enable update access for all users" ON roadmap_items;
DROP POLICY IF EXISTS "Enable delete access for all users" ON roadmap_items;

DROP POLICY IF EXISTS "Enable read access for all users" ON roadmap_item_history;
DROP POLICY IF EXISTS "Enable insert access for all users" ON roadmap_item_history;
DROP POLICY IF EXISTS "Enable update access for all users" ON roadmap_item_history;
DROP POLICY IF EXISTS "Enable delete access for all users" ON roadmap_item_history;

-- Teams table policies
CREATE POLICY "Enable read access for all users" ON teams FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON teams FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON teams FOR DELETE USING (true);

-- Super domains table policies
CREATE POLICY "Enable read access for all users" ON super_domains FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON super_domains FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON super_domains FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON super_domains FOR DELETE USING (true);

-- Domains table policies
CREATE POLICY "Enable read access for all users" ON domains FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON domains FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON domains FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON domains FOR DELETE USING (true);

-- Sprints table policies
CREATE POLICY "Enable read access for all users" ON sprints FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON sprints FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON sprints FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON sprints FOR DELETE USING (true);

-- Roadmap items table policies
CREATE POLICY "Enable read access for all users" ON roadmap_items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON roadmap_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON roadmap_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON roadmap_items FOR DELETE USING (true);

-- Roadmap item history table policies (for audit logging)
CREATE POLICY "Enable read access for all users" ON roadmap_item_history FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON roadmap_item_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON roadmap_item_history FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON roadmap_item_history FOR DELETE USING (true);

-- Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('teams', 'super_domains', 'domains', 'sprints', 'roadmap_items', 'roadmap_item_history')
ORDER BY tablename, policyname;
