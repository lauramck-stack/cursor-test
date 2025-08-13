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
  onDescriptionEdit: (itemId: string, newDescription: string) => void;
  onPriorityEdit: (itemId: string, newPriority: string) => void;
  onEffortEdit: (itemId: string, newEffort: string) => void;
  onStatusEdit: (itemId: string, newStatus: string) => void;
  onDueDateEdit: (itemId: string, newDueDate: string) => void;
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
  onDescriptionEdit,
  onPriorityEdit,
  onEffortEdit,
  onStatusEdit,
  onDueDateEdit,
  onMoveToBacklog,
}) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingWorkstream, setEditingWorkstream] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const [editingEffort, setEditingEffort] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingDueDate, setEditingDueDate] = useState(false);
  
  const [titleValue, setTitleValue] = useState(item.title);
  const [descriptionValue, setDescriptionValue] = useState(item.description || '');
  const [workstreamValue, setWorkstreamValue] = useState(item.domain_id);
  const [priorityValue, setPriorityValue] = useState(item.priority);
  const [effortValue, setEffortValue] = useState(item.effort || 'medium');
  const [statusValue, setStatusValue] = useState(item.status);
  const [dueDateValue, setDueDateValue] = useState(item.due_date || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: item.id,
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

  const handleDescriptionSubmit = () => {
    if (descriptionValue !== item.description) {
      onDescriptionEdit(item.id, descriptionValue);
    }
    setEditingDescription(false);
  };

  const handleDescriptionCancel = () => {
    setDescriptionValue(item.description || '');
    setEditingDescription(false);
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

  const handlePrioritySubmit = () => {
    if (priorityValue !== item.priority) {
      onPriorityEdit(item.id, priorityValue);
    }
    setEditingPriority(false);
  };

  const handlePriorityCancel = () => {
    setPriorityValue(item.priority);
    setEditingPriority(false);
  };

  const handleEffortSubmit = () => {
    if (effortValue !== item.effort) {
      onEffortEdit(item.id, effortValue);
    }
    setEditingEffort(false);
  };

  const handleEffortCancel = () => {
    setEffortValue(item.effort || 'medium');
    setEditingEffort(false);
  };

  const handleStatusSubmit = () => {
    if (statusValue !== item.status) {
      onStatusEdit(item.id, statusValue);
    }
    setEditingStatus(false);
  };

  const handleStatusCancel = () => {
    setStatusValue(item.status);
    setEditingStatus(false);
  };

  const handleDueDateSubmit = () => {
    if (dueDateValue !== item.due_date) {
      onDueDateEdit(item.id, dueDateValue);
    }
    setEditingDueDate(false);
  };

  const handleDueDateCancel = () => {
    setDueDateValue(item.due_date || '');
    setEditingDueDate(false);
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
      case 'completed': return 'text-white';
      case 'in-progress': return 'text-white';
      case 'planned': return 'text-white';
      case 'cancelled': return 'text-white';
      default: return 'text-white';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'large': return 'text-white';
      case 'medium': return 'text-white';
      case 'small': return 'text-white';
      default: return 'text-white';
    }
  };

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'critical': return 'bg-purple-600';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#1B3A29]'; // Dark green
      case 'in-progress': return 'bg-[#77AA89]'; // Light green
      case 'planned': return 'bg-[#CBE3E1] text-[#1B3A29]'; // Light blue with dark green text
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getEffortBgColor = (effort: string) => {
    switch (effort) {
      case 'large': return 'bg-[#1B3A29]'; // Dark green
      case 'medium': return 'bg-[#77AA89]'; // Light green
      case 'small': return 'bg-[#CBE3E1] text-[#1B3A29]'; // Light blue with dark green text
      default: return 'bg-gray-600';
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
              className="flex-1 text-sm font-medium border border-[#77AA89] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
              autoFocus
            />
            <button
              onClick={handleTitleSubmit}
              className="text-[#1B3A29] hover:text-[#77AA89] text-xs"
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
      <div className="mb-2">
        {editingDescription ? (
          <div className="flex gap-1">
            <textarea
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDescriptionSubmit();
                if (e.key === 'Escape') handleDescriptionCancel();
              }}
              onBlur={handleDescriptionSubmit}
              className="flex-1 text-xs border border-[#77AA89] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
              autoFocus
            />
            <button
              onClick={handleDescriptionSubmit}
              className="text-[#1B3A29] hover:text-[#77AA89] text-xs"
            >
              ✓
            </button>
            <button
              onClick={handleDescriptionCancel}
              className="text-gray-600 hover:text-gray-800 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            className="text-xs text-gray-600 cursor-pointer hover:bg-gray-50 px-1 py-1 rounded -ml-1"
            onClick={() => setEditingDescription(true)}
            title="Click to edit"
          >
            {item.description || 'Add a description...'}
          </div>
        )}
      </div>

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
              className="flex-1 text-xs border border-[#77AA89] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
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
              className="text-[#1B3A29] hover:text-[#77AA89] text-xs"
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

      {/* Priority Badge */}
      <div className="mb-2">
        {editingPriority ? (
          <div className="flex gap-1">
            <select
              value={priorityValue}
              onChange={(e) => setPriorityValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePrioritySubmit();
                if (e.key === 'Escape') handlePriorityCancel();
              }}
              onBlur={handlePrioritySubmit}
              className="text-xs border border-[#77AA89] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
              autoFocus
            >
              <option value="high">High</option>
              <option value="critical">Critical</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              onClick={handlePrioritySubmit}
              className="text-[#1B3A29] hover:text-[#77AA89] text-xs"
            >
              ✓
            </button>
            <button
              onClick={handlePriorityCancel}
              className="text-gray-600 hover:text-gray-800 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            className="text-xs text-gray-500 cursor-pointer hover:bg-gray-50 px-1 py-1 rounded -ml-1"
            onClick={() => setEditingPriority(true)}
            title="Click to change priority"
          >
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBgColor(item.priority)} ${getPriorityColor(item.priority)}`}>
              {item.priority}
            </span>
          </div>
        )}
      </div>

      {/* Effort Badge */}
      <div className="mb-2">
        {editingEffort ? (
          <div className="flex gap-1">
            <select
              value={effortValue}
              onChange={(e) => setEffortValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEffortSubmit();
                if (e.key === 'Escape') handleEffortCancel();
              }}
              onBlur={handleEffortSubmit}
              className="text-xs border border-[#77AA89] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
              autoFocus
            >
              <option value="large">Large</option>
              <option value="medium">Medium</option>
              <option value="small">Small</option>
            </select>
            <button
              onClick={handleEffortSubmit}
              className="text-[#1B3A29] hover:text-[#77AA89] text-xs"
            >
              ✓
            </button>
            <button
              onClick={handleEffortCancel}
              className="text-gray-600 hover:text-gray-800 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            className="text-xs text-gray-500 cursor-pointer hover:bg-gray-50 px-1 py-1 rounded -ml-1"
            onClick={() => setEditingEffort(true)}
            title="Click to change effort"
          >
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEffortBgColor(item.effort)} ${getEffortColor(item.effort)}`}>
              {item.effort || 'Medium'}
            </span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-2">
        {editingStatus ? (
          <div className="flex gap-1">
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStatusSubmit();
                if (e.key === 'Escape') handleStatusCancel();
              }}
              onBlur={handleStatusSubmit}
              className="text-xs border border-[#77AA89] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
              autoFocus
            >
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="planned">Planned</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleStatusSubmit}
              className="text-[#1B3A29] hover:text-[#77AA89] text-xs"
            >
              ✓
            </button>
            <button
              onClick={handleStatusCancel}
              className="text-gray-600 hover:text-gray-800 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            className="text-xs text-gray-500 cursor-pointer hover:bg-gray-50 px-1 py-1 rounded -ml-1"
            onClick={() => setEditingStatus(true)}
            title="Click to change status"
          >
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBgColor(item.status)} ${getStatusColor(item.status)}`}>
              {item.status.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Due Date */}
      <div className="mb-2">
        {editingDueDate ? (
          <div className="flex gap-1">
            <input
              type="date"
              value={dueDateValue}
              onChange={(e) => setDueDateValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDueDateSubmit();
                if (e.key === 'Escape') handleDueDateCancel();
              }}
              onBlur={handleDueDateSubmit}
              className="text-xs border border-[#77AA89] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#77AA89]"
              autoFocus
            />
            <button
              onClick={handleDueDateSubmit}
              className="text-[#1B3A29] hover:text-[#77AA89] text-xs"
            >
              ✓
            </button>
            <button
              onClick={handleDueDateCancel}
              className="text-gray-600 hover:text-gray-800 text-xs"
            >
              ✕
            </button>
          </div>
        ) : (
          <div
            className="text-xs text-gray-500 cursor-pointer hover:bg-gray-50 px-1 py-1 rounded -ml-1"
            onClick={() => setEditingDueDate(true)}
            title="Click to set due date"
          >
            {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'No due date'}
          </div>
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
    </div>
  );
};
