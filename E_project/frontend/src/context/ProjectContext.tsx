'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Pending';
  progress: number;
  color: string;
  dueDate: string;
}

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Acme Product Launch', client: 'Acme Corp', status: 'Active', progress: 65, color: '#018bf1', dueDate: 'May 12, 2026' },
  { id: 'p2', name: 'Global Rebranding', client: 'Starlight Inc', status: 'Active', progress: 40, color: '#AF52DE', dueDate: 'June 20, 2026' },
  { id: 'p3', name: 'Internal HR Portal', client: 'Internal', status: 'Pending', progress: 10, color: '#FF9500', dueDate: 'July 05, 2026' },
  { id: 'p4', name: 'Smart Logistics App', client: 'LogiCore', status: 'Completed', progress: 100, color: '#34C759', dueDate: 'Mar 30, 2026' },
];

interface ProjectContextType {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  projects: Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject, projects: MOCK_PROJECTS }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
