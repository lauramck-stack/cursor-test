export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface SampleData {
  categories: RoadmapCategory[];
  items: RoadmapItem[];
}
