import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
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
  due_date?: string | null;
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
// const DraggableBacklogItem: React.FC<{ item: RoadmapItem }> = ({ item }) => {
//   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//     id: item.id,
//   });

//   const style = transform ? {
//     transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
//   } : undefined;

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...listeners}
//       {...attributes}
//       className={`bg-white border border-gray-200 rounded-md p-3 cursor-move hover:shadow-sm transition-shadow ${isDragging ? 'opacity-50' : ''}`}
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1 min-w-0">
//           <h4 className="font-medium text-gray-800 text-sm truncate">
//             {item.title}
//           </h4>
//           {item.description && (
//             <p className="text-xs text-gray-600 mt-1 truncate">
//               {item.description}
//             </p>
//           )}
//           <div className="flex items-center gap-2 mt-2">
//             <span className={`text-xs px-2 py-1 rounded ${
//               item.priority === 'high' ? 'bg-red-100 text-red-800' :
//               item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//               'bg-green-100 text-green-800'
//             }`}>
//               {item.priority}
//             </span>
//             <span className={`text-xs px-2 py-1 rounded ${
//               item.priority === 'large' ? 'bg-purple-100 text-purple-800' :
//               item.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
//               'bg-gray-100 text-gray-800'
//             }`}>
//               {item.effort}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

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
  updateItemDescription: (itemId: string, newDescription: string) => void;
  updateItemPriority: (itemId: string, newPriority: string) => void;
  updateItemEffort: (itemId: string, newEffort: string) => void;
  updateItemStatus: (itemId: string, newStatus: string) => void;
  updateItemDueDate: (itemId: string, newDueDate: string | null) => void;
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
  updateItemDescription: (itemId, newDescription) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, description: newDescription } : item
      ),
    }));
  },
  updateItemPriority: (itemId, newPriority) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, priority: newPriority } : item
      ),
    }));
  },
  updateItemEffort: (itemId, newEffort) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, effort: newEffort } : item
      ),
    }));
  },
  updateItemStatus: (itemId, newStatus) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      ),
    }));
  },
  updateItemDueDate: (itemId, newDueDate) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, due_date: newDueDate } : item
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
    setLoading(true);
    setError(null);

    try {
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (teamsError) throw teamsError;

      // Fetch super domains
      const { data: superDomainsData, error: superDomainsError } = await supabase
        .from('super_domains')
        .select('*')
        .order('name');

      if (superDomainsError) throw superDomainsError;

      // Fetch domains
      const { data: domainsData, error: domainsError } = await supabase
        .from('domains')
        .select('*')
        .order('name');

      if (domainsError) throw domainsError;

      // Fetch sprints
      const { data: sprintsData, error: sprintsError } = await supabase
        .from('sprints')
        .select('*')
        .order('start_date');

      if (sprintsError) throw sprintsError;

      // Fetch roadmap items
      const { data: itemsData, error: itemsError } = await supabase
        .from('roadmap_items')
        .select('*')
        .order('created_at');

      if (itemsError) throw itemsError;

      setTeams(teamsData);
      setSuperDomains(superDomainsData);
      setDomains(domainsData);
      setSprints(sprintsData);
      setItems(itemsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [setItems, setTeams, setDomains, setSuperDomains, setSprints, setLoading, setError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleDescriptionEdit = async (itemId: string, newDescription: string) => {
    // Optimistic update
    useRoadmapStore.getState().updateItemDescription(itemId, newDescription);

    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ description: newDescription })
        .eq('id', itemId);

      if (error) {
        // Revert optimistic update on error
        const originalItem = items.find((i) => i.id === itemId);
        if (originalItem) {
          useRoadmapStore.getState().updateItemDescription(itemId, originalItem.description);
        }
        throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update description');
    }
  };

  const handlePriorityEdit = async (itemId: string, newPriority: string) => {
    // Optimistic update
    useRoadmapStore.getState().updateItemPriority(itemId, newPriority);

    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ priority: newPriority })
        .eq('id', itemId);

      if (error) {
        // Revert optimistic update on error
        const originalItem = items.find((i) => i.id === itemId);
        if (originalItem) {
          useRoadmapStore.getState().updateItemPriority(itemId, originalItem.priority);
        }
        throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update priority');
    }
  };

  const handleEffortEdit = async (itemId: string, newEffort: string) => {
    // Optimistic update
    useRoadmapStore.getState().updateItemEffort(itemId, newEffort);

    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ effort: newEffort })
        .eq('id', itemId);

      if (error) {
        // Revert optimistic update on error
        const originalItem = items.find((i) => i.id === itemId);
        if (originalItem) {
          useRoadmapStore.getState().updateItemEffort(itemId, originalItem.effort);
        }
        throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update effort');
    }
  };

  const handleStatusEdit = async (itemId: string, newStatus: string) => {
    // Optimistic update
    useRoadmapStore.getState().updateItemStatus(itemId, newStatus);

    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ status: newStatus })
        .eq('id', itemId);

      if (error) {
        // Revert optimistic update on error
        const originalItem = items.find((i) => i.id === itemId);
        if (originalItem) {
          useRoadmapStore.getState().updateItemStatus(itemId, originalItem.status);
        }
        throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDueDateEdit = async (itemId: string, newDueDate: string) => {
    // Optimistic update
    useRoadmapStore.getState().updateItemDueDate(itemId, newDueDate);

    try {
      const { error } = await supabase
        .from('roadmap_items')
        .update({ due_date: newDueDate || null })
        .eq('id', itemId);

      if (error) {
        // Revert optimistic update on error
        const originalItem = items.find((i) => i.id === itemId);
        if (originalItem) {
          useRoadmapStore.getState().updateItemDueDate(itemId, originalItem.due_date || null);
        }
        throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update due date');
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading roadmap...</div>
      </div>
    );
  }

  if (error) {
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

  try {
    return (
      <div className="h-full flex flex-col">
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
            className="bg-[#1B3A29] text-white px-4 py-2 rounded-lg hover:bg-[#77AA89] transition-colors"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
                  placeholder="Enter item title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  value={newItem.team_id}
                  onChange={(e) => setNewItem({ ...newItem, team_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
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
                className="bg-[#1B3A29] text-white px-4 py-2 rounded-md hover:bg-[#77AA89] disabled:bg-gray-300 disabled:cursor-not-allowed"
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
            {/* Roadmap (Sprint Columns) */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 px-4">Roadmap</h2>
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
                        onDescriptionEdit={handleDescriptionEdit}
                        onPriorityEdit={handlePriorityEdit}
                        onEffortEdit={handleEffortEdit}
                        onStatusEdit={handleStatusEdit}
                        onDueDateEdit={handleDueDateEdit}
                        onMoveToBacklog={handleMoveToBacklog}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Team Backlog Section */}
            <div className="px-4">
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
                            <RoadmapItemCard
                              key={item.id}
                              item={item}
                              team={teams.find((t) => t.id === item.team_id)}
                              domain={domains.find((d) => d.id === item.domain_id)}
                              domains={domains}
                              isEditing={editingItem === item.id}
                              onEditStart={() => setEditingItem(item.id)}
                              onEditEnd={() => setEditingItem(null)}
                              onTitleEdit={handleTitleEdit}
                              onWorkstreamEdit={handleWorkstreamEdit}
                              onDescriptionEdit={handleDescriptionEdit}
                              onPriorityEdit={handlePriorityEdit}
                              onEffortEdit={handleEffortEdit}
                              onStatusEdit={handleStatusEdit}
                              onDueDateEdit={handleDueDateEdit}
                            />
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
                  onDescriptionEdit={() => {}}
                  onPriorityEdit={() => {}}
                  onEffortEdit={() => {}}
                  onStatusEdit={() => {}}
                  onDueDateEdit={() => {}}
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    );
  } catch (renderError) {
    console.error('Error rendering RoadmapBoard:', renderError);
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
