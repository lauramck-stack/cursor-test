import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, PointerSensor, useSensor, useSensors, useDraggable } from '@dnd-kit/core';
import { create } from 'zustand';
import { RoadmapItemCard } from './RoadmapItemCard';
import { SprintColumn } from './SprintColumn';
import { FilterBar } from './FilterBar';

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Team {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface SuperDomain {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  color: string;
  super_domain_id: string;
}

export interface Sprint {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  effort: string;
  due_date?: string;
  team_id: string;
  domain_id: string;
  sprint_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface FilterState {
  teams: string[];
  domains: string[];
  superDomains: string[];
}

// Draggable Backlog Item Component
const DraggableBacklogItem: React.FC<{ item: RoadmapItem }> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white border border-gray-200 rounded-md p-3 cursor-move hover:shadow-sm transition-shadow ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm truncate">
            {item.title}
          </h4>
          {item.description && (
            <p className="text-xs text-gray-600 mt-1 truncate">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              item.priority === 'high' ? 'bg-red-100 text-red-800' :
              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {item.priority}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              item.effort === 'large' ? 'bg-purple-100 text-purple-800' :
              item.effort === 'medium' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {item.effort}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Zustand store for optimistic updates
interface RoadmapStore {
  items: RoadmapItem[];
  teams: Team[];
  domains: Domain[];
  superDomains: SuperDomain[];
  sprints: Sprint[];
  filters: {
    teams: string[];
    domains: string[];
    superDomains: string[];
  };
  isLoading: boolean;
  error: string | null;

  setItems: (items: RoadmapItem[]) => void;
  setTeams: (teams: Team[]) => void;
  setDomains: (domains: Domain[]) => void;
  setSuperDomains: (superDomains: SuperDomain[]) => void;
  setSprints: (sprints: Sprint[]) => void;
  updateItemSprint: (itemId: string, newSprintId: string | null) => void;
  updateItemTitle: (itemId: string, newTitle: string) => void;
  updateItemWorkstream: (itemId: string, newDomainId: string) => void;
  setFilters: (filters: Partial<RoadmapStore['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getFilteredItems: () => RoadmapItem[];
  getGroupedSprints: () => { [key: string]: Sprint[] };
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  items: [],
  teams: [],
  domains: [],
  superDomains: [],
  sprints: [],
  filters: {
    teams: [],
    domains: [],
    superDomains: [],
  },
  isLoading: false,
  error: null,

  setItems: (items) => set({ items }),
  setTeams: (teams) => set({ teams }),
  setDomains: (domains) => set({ domains }),
  setSuperDomains: (superDomains) => set({ superDomains }),
  setSprints: (sprints) => set({ sprints }),
  updateItemSprint: (itemId, newSprintId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, sprint_id: newSprintId } : item
      ),
    }));
  },
  updateItemTitle: (itemId, newTitle) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, title: newTitle } : item
      ),
    }));
  },
  updateItemWorkstream: (itemId, newDomainId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, domain_id: newDomainId } : item
      ),
    }));
  },
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getFilteredItems: () => {
    const state = get();
    let filtered = state.items;

    if (state.filters.teams.length > 0) {
      filtered = filtered.filter((item) => state.filters.teams.includes(item.team_id));
    }

    if (state.filters.domains.length > 0) {
      filtered = filtered.filter((item) => state.filters.domains.includes(item.domain_id));
    }

    if (state.filters.superDomains.length > 0) {
      const domainIds = state.domains
        .filter((domain) => state.filters.superDomains.includes(domain.super_domain_id))
        .map((domain) => domain.id);
      filtered = filtered.filter((item) => domainIds.includes(item.domain_id));
    }

    return filtered;
  },

  getGroupedSprints: () => {
    const state = get();
    const grouped: { [key: string]: Sprint[] } = {};
    
    // Group sprints by fiscal quarter based on their names and dates
    state.sprints.forEach((sprint) => {
      let quarter = 'Other';
      
      // Handle fiscal year sprints
      if (sprint.name.includes('FY25')) {
        quarter = 'Q4 FY25';
      } else if (sprint.name.includes('FY26')) {
        // Determine quarter based on sprint number
        const sprintNum = parseInt(sprint.name.replace(/\D/g, ''));
        if (sprintNum >= 1 && sprintNum <= 7) {
          quarter = 'Q1 FY26';
        } else if (sprintNum >= 8 && sprintNum <= 14) {
          quarter = 'Q2 FY26';
        } else if (sprintNum >= 15 && sprintNum <= 20) {
          quarter = 'Q3 FY26';
        } else if (sprintNum >= 21 && sprintNum <= 26) {
          quarter = 'Q4 FY26';
        }
      } else {
        // Fallback: try to extract quarter from sprint name
        const quarterMatch = sprint.name.match(/^(Q[1-4])\s+(\d{4})/);
        if (quarterMatch) {
          quarter = quarterMatch[1] + ' ' + quarterMatch[2];
        }
      }
      
      if (!grouped[quarter]) {
        grouped[quarter] = [];
      }
      grouped[quarter].push(sprint);
    });

    // Sort quarters chronologically
    const sortedGrouped: { [key: string]: Sprint[] } = {};
    Object.keys(grouped)
      .sort((a, b) => {
        if (a === 'Other') return 1; // Put "Other" at the end
        if (b === 'Other') return -1;
        
        // Extract year and quarter for sorting
        const aMatch = a.match(/Q([1-4])\s+(FY\d{2})/);
        const bMatch = b.match(/Q([1-4])\s+(FY\d{2})/);
        
        if (aMatch && bMatch) {
          const aYear = parseInt(aMatch[2].replace('FY', '20'));
          const aQuarter = parseInt(aMatch[1]);
          const bYear = parseInt(bMatch[2].replace('FY', '20'));
          const bQuarter = parseInt(bMatch[1]);
          
          if (aYear !== bYear) return aYear - bYear;
          return aQuarter - bQuarter;
        }
        
        return a.localeCompare(b);
      })
      .forEach(key => {
        sortedGrouped[key] = grouped[key];
      });

    return sortedGrouped;
  },
}));

// Main component
const RoadmapBoard: React.FC = () => {
  console.log('🎬 RoadmapBoard component function called');
  
  const {
    items,
    teams,
    domains,
    superDomains,
    sprints,
    filters,
    isLoading,
    error,
    setItems,
    setTeams,
    setDomains,
    setSuperDomains,
    setSprints,
    setLoading,
    setError,
    getFilteredItems,
    getGroupedSprints,
  } = useRoadmapStore();

  // Get computed values
  const filteredItems = getFilteredItems();
  const groupedSprints = getGroupedSprints();

  const [activeItem, setActiveItem] = useState<RoadmapItem | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    status: 'planned' as const,
    priority: 'medium' as const,
    effort: 'medium' as const,
    team_id: '',
    domain_id: '',
    sprint_id: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    console.log('🔄 Starting to fetch data...');
    setLoading(true);
    setError(null);

    try {
      console.log('📡 Fetching teams...');
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (teamsError) throw teamsError;
      console.log('✅ Teams fetched:', teamsData);

      console.log('📡 Fetching super domains...');
      // Fetch super domains
      const { data: superDomainsData, error: superDomainsError } = await supabase
        .from('super_domains')
        .select('*')
        .order('name');

      if (superDomainsError) throw superDomainsError;
      console.log('✅ Super domains fetched:', superDomainsData);

      console.log('📡 Fetching domains...');
      // Fetch domains
      const { data: domainsData, error: domainsError } = await supabase
        .from('domains')
        .select('*')
        .order('name');

      if (domainsError) throw domainsError;
      console.log('✅ Domains fetched:', domainsData);

      console.log('📡 Fetching sprints...');
      // Fetch sprints
      const { data: sprintsData, error: sprintsError } = await supabase
        .from('sprints')
        .select('*')
        .order('start_date');

      if (sprintsError) throw sprintsError;
      console.log('✅ Sprints fetched:', sprintsData);

      console.log('📡 Fetching roadmap items...');
      // Fetch roadmap items
      const { data: itemsData, error: itemsError } = await supabase
        .from('roadmap_items')
        .select('*')
        .order('created_at');

      if (itemsError) throw itemsError;
      console.log('✅ Roadmap items fetched:', itemsData);

      console.log('💾 Setting data in store...');
      setTeams(teamsData);
      setSuperDomains(superDomainsData);
      setDomains(domainsData);
      setSprints(sprintsData);
      setItems(itemsData);
      
      console.log('🎉 All data set successfully!');
      console.log('Store state after setting data:', {
        teams: teamsData?.length || 0,
        superDomains: superDomainsData?.length || 0,
        domains: domainsData?.length || 0,
        sprints: sprintsData?.length || 0,
        items: itemsData?.length || 0
      });
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  }, [setItems, setTeams, setDomains, setSuperDomains, setSprints, setLoading, setError]);

  useEffect(() => {
    console.log('🚀 RoadmapBoard component mounted, calling fetchData...');
    fetchData();
  }, [fetchData]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('📊 State updated:', {
      itemsCount: items.length,
      teamsCount: teams.length,
      domainsCount: domains.length,
      superDomainsCount: superDomains.length,
      sprintsCount: sprints.length,
      isLoading,
      error,
      filteredItemsCount: filteredItems.length,
      groupedSprintsKeys: Object.keys(groupedSprints)
    });
  }, [items, teams, domains, superDomains, sprints, isLoading, error, filteredItems, groupedSprints]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const item = items.find((i) => i.id === event.active.id);
    setActiveItem(item || null);
  };

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const itemId = active.id as string;
    const newSprintId = over.id as string;

    // Check if the drop target is a sprint column
    const isSprintColumn = sprints.some(sprint => sprint.id === newSprintId);
    
    if (!isSprintColumn) return;

    try {
      // Update in Supabase
      const { error } = await supabase
        .from('roadmap_items')
        .update({ sprint_id: newSprintId })
        .eq('id', itemId);

      if (error) throw error;

      // Update local state
      useRoadmapStore.getState().updateItemSprint(itemId, newSprintId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  // Handle inline editing
  const handleTitleEdit = async (itemId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    // Optimistic update
    useRoadmapStore.getState().updateItemTitle(itemId, newTitle);
    setEditingItem(null);

    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ title: newTitle })
        .eq('id', itemId);

      if (error) {
        // Revert optimistic update on error
        const originalItem = items.find((i) => i.id === itemId);
        if (originalItem) {
          useRoadmapStore.getState().updateItemTitle(itemId, originalItem.title);
        }
        throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update title');
    }
  };

  const handleWorkstreamEdit = async (itemId: string, newDomainId: string) => {
    // Optimistic update
    useRoadmapStore.getState().updateItemWorkstream(itemId, newDomainId);

    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ domain_id: newDomainId })
        .eq('id', itemId);

      if (error) {
        // Revert optimistic update on error
        const originalItem = items.find((i) => i.id === itemId);
        if (originalItem) {
          useRoadmapStore.getState().updateItemWorkstream(itemId, originalItem.domain_id);
        }
        throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workstream');
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title.trim()) return;

    try {
      // Create new item in Supabase
      const { data: newItemData, error } = await supabase
        .from('roadmap_items')
        .insert({
          title: newItem.title,
          description: newItem.description,
          status: newItem.status,
          priority: newItem.priority,
          effort: newItem.effort,
          team_id: newItem.team_id || null,
          domain_id: newItem.domain_id || null,
          sprint_id: newItem.sprint_id || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local store
      setItems([...items, newItemData]);

      // Reset form
      setNewItem({
        title: '',
        description: '',
        status: 'planned',
        priority: 'medium',
        effort: 'medium',
        team_id: '',
        domain_id: '',
        sprint_id: ''
      });
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  const handleMoveToBacklog = async (itemId: string) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('roadmap_items')
        .update({ sprint_id: null })
        .eq('id', itemId);

      if (error) throw error;

      // Update local state
      useRoadmapStore.getState().updateItemSprint(itemId, null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move item to backlog');
    }
  };

  if (isLoading) {
    console.log('⏳ Rendering loading state...');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading roadmap...</div>
      </div>
    );
  }

  if (error) {
    console.log('❌ Rendering error state:', error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          <h3 className="font-medium">Error loading roadmap</h3>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchData}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('🎨 Rendering main component with data:', {
    itemsCount: items.length,
    teamsCount: teams.length,
    domainsCount: domains.length,
    superDomainsCount: superDomains.length,
    sprintsCount: sprints.length,
    filteredItemsCount: filteredItems.length,
    groupedSprintsKeys: Object.keys(groupedSprints)
  });

  try {
    return (
      <div className="h-full flex flex-col">
        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 mb-4">
          <h3 className="font-medium text-yellow-800">Debug Info</h3>
          <p className="text-sm text-yellow-700">
            Items: {items.length} | Teams: {teams.length} | Domains: {domains.length} | 
            Sprints: {sprints.length} | Loading: {isLoading.toString()} | Error: {error || 'none'}
          </p>
          <p className="text-sm text-yellow-700">
            Filtered Items: {filteredItems.length} | Grouped Sprints: {Object.keys(groupedSprints).length}
          </p>
          <p className="text-sm text-yellow-700">
            Backlog Items: {filteredItems.filter((item) => !item.sprint_id).length} | 
            Sprint Items: {filteredItems.filter((item) => item.sprint_id).length}
          </p>
          <p className="text-sm text-yellow-700">
            Grouped Sprints: {Object.keys(groupedSprints).join(', ')}
          </p>
          <p className="text-sm text-yellow-700">
            Sprint Details: {Object.entries(groupedSprints).map(([quarter, sprints]) => 
              `${quarter}: ${sprints.length} sprint(s) - ${sprints.map(s => s.name).join(', ')}`
            ).join(' | ')}
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-yellow-700 font-medium">Raw Data</summary>
            <div className="mt-2 text-xs bg-yellow-100 p-2 rounded">
              <p><strong>Teams:</strong> {JSON.stringify(teams.map(t => ({ id: t.id, name: t.name })))}</p>
              <p><strong>Domains:</strong> {JSON.stringify(domains.map(d => ({ id: d.id, name: d.name })))}</p>
              <p><strong>Sprints:</strong> {JSON.stringify(sprints.map(s => ({ id: s.id, name: s.name })))}</p>
              <p><strong>Items:</strong> {JSON.stringify(items.map(i => ({ id: i.id, title: i.title, sprint_id: i.sprint_id, team_id: i.team_id, domain_id: i.domain_id })))}</p>
              <p><strong>Filtered Items:</strong> {JSON.stringify(filteredItems.map(i => ({ id: i.id, title: i.title, sprint_id: i.sprint_id, team_id: i.team_id, domain_id: i.domain_id })))}</p>
              <p><strong>Grouped Sprints:</strong> {JSON.stringify(groupedSprints)}</p>
            </div>
          </details>
        </div>

        {/* Filter Bar */}
        <FilterBar
          teams={teams}
          domains={domains}
          superDomains={superDomains}
          filters={filters}
          onFiltersChange={useRoadmapStore.getState().setFilters}
        />

        {/* Add Item Button */}
        <div className="px-4 mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showAddForm ? 'Cancel' : '+ Add New Item'}
          </button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mx-4 mb-4">
            <h3 className="font-medium text-gray-800 mb-4">Add New Roadmap Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  value={newItem.team_id}
                  onChange={(e) => setNewItem({ ...newItem, team_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <select
                  value={newItem.domain_id}
                  onChange={(e) => setNewItem({ ...newItem, domain_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Domain</option>
                  {domains.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sprint</label>
                <select
                  value={newItem.sprint_id}
                  onChange={(e) => setNewItem({ ...newItem, sprint_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Backlog (No Sprint)</option>
                  {sprints.map((sprint) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newItem.priority}
                  onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effort</label>
                <select
                  value={newItem.effort}
                  onChange={(e) => setNewItem({ ...newItem, effort: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newItem.status}
                  onChange={(e) => setNewItem({ ...newItem, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleAddItem}
                disabled={!newItem.title.trim()}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Item
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mx-4 mt-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Roadmap Board */}
        <div className="p-4">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Team Backlog Section */}
            <div className="px-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Backlog</h2>
              <div className="flex gap-4 pb-2">
                {teams.map((team) => {
                  const teamBacklogItems = filteredItems.filter(
                    (item) => !item.sprint_id && item.team_id === team.id
                  );
                  
                  return (
                    <div key={team.id} className="w-80 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: team.color || '#6B7280' }}
                        ></div>
                        <h3 className="font-medium text-gray-700">{team.name}</h3>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          {teamBacklogItems.length} items
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {teamBacklogItems.length > 0 ? (
                          teamBacklogItems.map((item) => (
                            <DraggableBacklogItem key={item.id} item={item} />
                          ))
                        ) : (
                          <div className="text-center text-gray-500 text-sm py-8">
                            No backlog items for this team
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              {/* Sprint Columns */}
              {Object.entries(groupedSprints).map(([quarter, quarterSprints]) => (
                <div key={quarter} className="flex gap-4">
                  {quarterSprints.map((sprint) => (
                    <SprintColumn
                      key={sprint.id}
                      sprint={sprint}
                      items={filteredItems.filter((item) => item.sprint_id === sprint.id)}
                      teams={teams}
                      domains={domains}
                      editingItem={editingItem}
                      onEditStart={setEditingItem}
                      onEditEnd={() => setEditingItem(null)}
                      onTitleEdit={handleTitleEdit}
                      onWorkstreamEdit={handleWorkstreamEdit}
                      onMoveToBacklog={handleMoveToBacklog}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeItem && (
                <RoadmapItemCard
                  item={activeItem}
                  team={teams.find((t) => t.id === activeItem.team_id)}
                  domain={domains.find((d) => d.id === activeItem.domain_id)}
                  domains={domains}
                  isDragging
                  onEditStart={() => {}}
                  onEditEnd={() => {}}
                  onTitleEdit={() => {}}
                  onWorkstreamEdit={() => {}}
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    );
  } catch (renderError) {
    console.error('❌ Error rendering RoadmapBoard:', renderError);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          <h3 className="font-medium">Error rendering roadmap</h3>
          <p className="text-sm mt-1">{renderError instanceof Error ? renderError.message : 'Unknown error'}</p>
          <pre className="text-xs mt-2 bg-red-100 p-2 rounded overflow-auto">
            {renderError instanceof Error ? renderError.stack : 'No stack trace'}
          </pre>
        </div>
      </div>
    );
  }
};

export default RoadmapBoard;
