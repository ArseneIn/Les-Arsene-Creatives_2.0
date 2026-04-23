'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useProject, Project } from '@/context/ProjectContext';
import ProjectModal from './ProjectModal';

export default function TopHeader() {
  const pathname = usePathname();
  const { selectedProject, setSelectedProject, projects } = useProject();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/tasks': return 'My Tasks';
      case '/reports': return 'Reports';
      case '/calendar': return 'Calendar';
      case '/media': return 'Media Library';
      case '/messages': return 'Messages';
      case '/users': return 'Team Management';
      default: return 'Dashboard';
    }
  };

  const handleProjectSelect = (project: Project | null) => {
    setSelectedProject(project);
    setIsDropdownOpen(false);
  };

  return (
    <header className="top-header">
      <div className="breadcrumb-selector">
        <span className="breadcrumb-main">{getPageTitle()}</span>
        <span className="breadcrumb-separator">/</span>
        <div className="project-dropdown-container">
          <button 
            className={`project-select-btn ${isDropdownOpen ? 'active' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={`project-indicator ${!selectedProject ? 'portfolio' : ''}`} style={{ backgroundColor: selectedProject?.color }} />
            <span className="selected-project-name">
              {selectedProject ? selectedProject.name : 'Portfolio (All Projects)'}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`chevron ${isDropdownOpen ? 'up' : ''}`}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="project-dropdown-menu animate-slide-down">
              <div className="dropdown-header">Select Project</div>
              <div className="dropdown-search">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                 <input type="text" placeholder="Filter projects..." />
              </div>
              <div className="dropdown-list">
                <button 
                  className={`dropdown-item ${!selectedProject ? 'selected' : ''}`}
                  onClick={() => handleProjectSelect(null)}
                >
                  <div className="project-indicator portfolio" />
                  Portfolio (All Projects)
                </button>
                {projects.map((project) => (
                  <button 
                    key={project.id}
                    className={`dropdown-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <div className="project-indicator" style={{ backgroundColor: project.color }} />
                    <div className="project-item-info">
                      <span className="project-item-name">{project.name}</span>
                      <span className="project-item-client">{project.client}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="add-project-btn" onClick={() => { setIsProjectModalOpen(true); setIsDropdownOpen(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Create New Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="top-header-actions">
        <button className="icon-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <div className="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search data points..." className="search-input" />
        </div>
      </div>

      <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
    </header>
  );
}
