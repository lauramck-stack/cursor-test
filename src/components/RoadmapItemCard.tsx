import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { RoadmapItem, Team, Domain } from './RoadmapBoard';

interface RoadmapItemCardProps {
  item: RoadmapItem;
  team?: Team;
  domain?: Domain;
  domains: Domain[];
  isEditing?: boolean;
  isDragging?: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
  onTitleEdit: (itemId: string, newTitle: string) => void;
  onWorkstreamEdit: (itemId: string, newDomainId: string) => void;
  onMoveToBacklog?: (itemId: string) => void;
}

export const RoadmapItemCard: React.FC<RoadmapItemCardProps> = ({
  item,
  team,
  domain,
  domains,
  isEditing,
  isDragging,
  onTitleEdit,
  onWorkstreamEdit,
  onMoveToBacklog,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingWorkstream, setEditingWorkstream] = useState(false);
  const [titleValue, setTitleValue] = useState(item.title);
  const [workstreamValue, setWorkstreamValue] = useState(item.domain_id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'roadmap-item',
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleTitleSubmit = () => {
    if (titleValue.trim() && titleValue !== item.title) {
      onTitleEdit(item.id, titleValue.trim());
    }
    setEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTitleValue(item.title);
    setEditingTitle(false);
  };

  const handleWorkstreamSubmit = () => {
    if (workstreamValue !== item.domain_id) {
      onWorkstreamEdit(item.id, workstreamValue);
    }
    setEditingWorkstream(false);
  };

  const handleWorkstreamCancel = () => {
    setWorkstreamValue(item.domain_id);
    setEditingWorkstream(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-purple-100 text-purple-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-move
        hover:shadow-md transition-shadow duration-200
        ${isDragging ? 'shadow-lg scale-105' : ''}
        ${isEditing ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {/* Team and Domain Tags */}
      <div className="flex items-center gap-2 mb-2">
        {team && (
          <div className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: team.color || '#6B7280' }}
              title={team.name}
            />
            <span className="text-xs text-gray-700 font-medium">
              {team.name}
            </span>
          </div>
        )}
        {domain && (
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {domain.name}
          </span>
        )}
      </div>

      {/* Title */}
      <div className="mb-2">
        {editingTitle ? (
          <div className="flex gap-1">
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') handleTitleCancel();
              }}
              onBlur={handleTitleSubmit}
              className="flex-1 text-sm font-medium border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleTitleSubmit}
              className="text-blue-600 hover:text-blue-800 text-xs"
            >
              ✓
            </button>
            <button
              onClick={handleTitleCancel}
              className="text-gray-600 hover:text-gray-800 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            className="text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-50 px-1 py-1 rounded -ml-1"
            onDoubleClick={() => setEditingTitle(true)}
            title="Double-click to edit"
          >
            {item.title}
          </div>
        )}
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Workstream Selection */}
      <div className="mb-2">
        {editingWorkstream ? (
          <div className="flex gap-1">
            <select
              value={workstreamValue}
              onChange={(e) => setWorkstreamValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleWorkstreamSubmit();
                if (e.key === 'Escape') handleWorkstreamCancel();
              }}
              onBlur={handleWorkstreamSubmit}
              className="flex-1 text-xs border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            >
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleWorkstreamSubmit}
              className="text-blue-600 hover:text-blue-800 text-xs"
            >
              ✓
            </button>
            <button
              onClick={handleWorkstreamCancel}
              className="text-gray-600 hover:text-gray-800 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            className="text-xs text-gray-500 cursor-pointer hover:bg-gray-50 px-1 py-1 rounded -ml-1"
            onDoubleClick={() => setEditingWorkstream(true)}
            title="Double-click to change workstream"
          >
            Workstream: {domain?.name || 'Unknown'}
          </div>
        )}
      </div>

      {/* Status and Priority Badges */}
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
          {item.status.replace('-', ' ')}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
          {item.priority}
        </span>
        {item.effort && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {item.effort}
          </span>
        )}
      </div>

      {/* Move to Backlog Button */}
      {onMoveToBacklog && (
        <div className="mt-2">
          <button
            onClick={() => onMoveToBacklog(item.id)}
            className="w-full text-xs text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
            title="Move item back to team backlog"
          >
            ← Move to Backlog
          </button>
        </div>
      )}

      {/* Due Date */}
      {item.due_date && (
        <div className="mt-2 text-xs text-gray-500">
          Due: {new Date(item.due_date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};
