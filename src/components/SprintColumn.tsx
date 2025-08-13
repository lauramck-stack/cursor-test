import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { RoadmapItem, Team, Domain, Sprint } from './RoadmapBoard';
import { RoadmapItemCard } from './RoadmapItemCard';

interface SprintColumnProps {
  sprint: Sprint;
  items: RoadmapItem[];
  teams: Team[];
  domains: Domain[];
  editingItem: string | null;
  onEditStart: (itemId: string) => void;
  onEditEnd: () => void;
  onTitleEdit: (itemId: string, newTitle: string) => void;
  onWorkstreamEdit: (itemId: string, newDomainId: string) => void;
  onDescriptionEdit: (itemId: string, newDescription: string) => void;
  onPriorityEdit: (itemId: string, newPriority: string) => void;
  onEffortEdit: (itemId: string, newEffort: string) => void;
  onStatusEdit: (itemId: string, newStatus: string) => void;
  onDueDateEdit: (itemId: string, newDueDate: string) => void;
  onMoveToBacklog: (itemId: string) => void;
}

export const SprintColumn: React.FC<SprintColumnProps> = ({
  sprint,
  items,
  teams,
  domains,
  editingItem,
  onEditStart,
  onEditEnd,
  onTitleEdit,
  onWorkstreamEdit,
  onDescriptionEdit,
  onPriorityEdit,
  onEffortEdit,
  onStatusEdit,
  onDueDateEdit,
  onMoveToBacklog,
}) => {
  const { setNodeRef } = useDroppable({
    id: sprint.id,
    data: {
      type: 'sprint',
      sprint,
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getSprintStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Sprint Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{sprint.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSprintStatusColor(sprint.status)}`}>
            {sprint.status}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(sprint.start_date)} - {formatDate(sprint.end_date)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className="bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors"
      >
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item) => (
              <RoadmapItemCard
                key={item.id}
                item={item}
                team={teams.find((t) => t.id === item.team_id)}
                domain={domains.find((d) => d.id === item.domain_id)}
                domains={domains}
                isEditing={editingItem === item.id}
                onEditStart={() => onEditStart(item.id)}
                onEditEnd={onEditEnd}
                onTitleEdit={onTitleEdit}
                onWorkstreamEdit={onWorkstreamEdit}
                onDescriptionEdit={onDescriptionEdit}
                onPriorityEdit={onPriorityEdit}
                onEffortEdit={onEffortEdit}
                onStatusEdit={onStatusEdit}
                onDueDateEdit={onDueDateEdit}
                onMoveToBacklog={onMoveToBacklog}
              />
            ))}
          </div>
        </SortableContext>
        
        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm">Drop items here</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
