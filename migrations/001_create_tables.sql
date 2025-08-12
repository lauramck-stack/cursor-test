-- Create teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create super_domains table
CREATE TABLE super_domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create domains table
CREATE TABLE domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  super_domain_id UUID REFERENCES super_domains(id) ON DELETE CASCADE,
  color VARCHAR(7) DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sprints table
CREATE TABLE sprints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  year INTEGER NOT NULL,
  quarter INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roadmap_items table
CREATE TABLE roadmap_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  effort_estimate INTEGER, -- in story points
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  domain_id UUID REFERENCES domains(id) ON DELETE SET NULL,
  sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  target_sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_roadmap_items_team_id ON roadmap_items(team_id);
CREATE INDEX idx_roadmap_items_domain_id ON roadmap_items(domain_id);
CREATE INDEX idx_roadmap_items_sprint_id ON roadmap_items(sprint_id);
CREATE INDEX idx_roadmap_items_status ON roadmap_items(status);
CREATE INDEX idx_domains_super_domain_id ON domains(super_domain_id);
CREATE INDEX idx_sprints_year_quarter ON sprints(year, quarter);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic read access for now)
CREATE POLICY "Allow read access to teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Allow read access to super_domains" ON super_domains FOR SELECT USING (true);
CREATE POLICY "Allow read access to domains" ON domains FOR SELECT USING (true);
CREATE POLICY "Allow read access to sprints" ON sprints FOR SELECT USING (true);
CREATE POLICY "Allow read access to roadmap_items" ON roadmap_items FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_super_domains_updated_at BEFORE UPDATE ON super_domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sprints_updated_at BEFORE UPDATE ON sprints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roadmap_items_updated_at BEFORE UPDATE ON roadmap_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

