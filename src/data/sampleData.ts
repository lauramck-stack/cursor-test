// Sample data for the roadmap app
export const sampleData = {
  categories: [
    {
      id: '1',
      name: 'Frontend Development',
      color: '#3B82F6',
      description: 'User interface and user experience improvements'
    },
    {
      id: '2',
      name: 'Backend Development',
      color: '#10B981',
      description: 'Server-side functionality and API development'
    },
    {
      id: '3',
      name: 'Testing & QA',
      color: '#F59E0B',
      description: 'Quality assurance and testing procedures'
    },
    {
      id: '4',
      name: 'DevOps & Infrastructure',
      color: '#8B5CF6',
      description: 'Deployment and infrastructure management'
    },
    {
      id: '5',
      name: 'Documentation',
      color: '#6B7280',
      description: 'Technical documentation and guides'
    }
  ],
  items: [
    {
      id: '1',
      title: 'Implement User Authentication',
      description: 'Add login/signup functionality with Clerk integration',
      status: 'completed',
      priority: 'high',
      category: '1',
      estimatedHours: 8,
      actualHours: 7,
      dueDate: '2024-01-15',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Create Roadmap Dashboard',
      description: 'Build the main dashboard to display roadmap items',
      status: 'in-progress',
      priority: 'high',
      category: '1',
      estimatedHours: 12,
      actualHours: 6,
      dueDate: '2024-02-01',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '3',
      title: 'Design Database Schema',
      description: 'Plan and create the database structure for roadmap items',
      status: 'completed',
      priority: 'high',
      category: '2',
      estimatedHours: 6,
      actualHours: 5,
      dueDate: '2024-01-05',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-05T00:00:00Z'
    },
    {
      id: '4',
      title: 'API Endpoints for CRUD Operations',
      description: 'Create REST API endpoints for roadmap item management',
      status: 'in-progress',
      priority: 'high',
      category: '2',
      estimatedHours: 10,
      actualHours: 4,
      dueDate: '2024-01-25',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '5',
      title: 'Unit Tests for Components',
      description: 'Write comprehensive unit tests for React components',
      status: 'not-started',
      priority: 'medium',
      category: '3',
      estimatedHours: 8,
      dueDate: '2024-02-15',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '6',
      title: 'Integration Testing',
      description: 'Set up end-to-end testing with Playwright',
      status: 'not-started',
      priority: 'medium',
      category: '3',
      estimatedHours: 6,
      dueDate: '2024-02-20',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '7',
      title: 'Docker Configuration',
      description: 'Containerize the application for easy deployment',
      status: 'not-started',
      priority: 'low',
      category: '4',
      estimatedHours: 4,
      dueDate: '2024-03-01',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '8',
      title: 'CI/CD Pipeline Setup',
      description: 'Configure GitHub Actions for automated testing and deployment',
      status: 'not-started',
      priority: 'low',
      category: '4',
      estimatedHours: 6,
      dueDate: '2024-03-15',
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '9',
      title: 'API Documentation',
      description: 'Create comprehensive API documentation using OpenAPI/Swagger',
      status: 'not-started',
      priority: 'medium',
      category: '5',
      estimatedHours: 5,
      dueDate: '2024-02-10',
      createdAt: '2024-01-25T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    },
    {
      id: '10',
      title: 'User Guide',
      description: 'Write user manual and getting started guide',
      status: 'not-started',
      priority: 'low',
      category: '5',
      estimatedHours: 4,
      dueDate: '2024-03-01',
      createdAt: '2024-01-25T00:00:00Z',
      updatedAt: '2024-01-25T00:00:00Z'
    }
  ]
};
