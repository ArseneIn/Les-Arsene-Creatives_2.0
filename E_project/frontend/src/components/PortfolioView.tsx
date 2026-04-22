'use client';

import React from 'react';
import './PortfolioView.css';
import { useProject } from '@/context/ProjectContext';

export default function PortfolioView() {
  const { projects, setSelectedProject } = useProject();

  // Aggregated stats for Portfolio
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const avgProgress = Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects);

  return (
    <div className="portfolio-container animate-fade-in">
      {/* ── Portfolio KPI Row ── */}
      <section className="portfolio-kpi-row">
        <div className="p-kpi-card card">
          <div className="p-kpi-top">
            <div className="p-kpi-icon blue-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <div className="p-kpi-label">Total Projects</div>
          </div>
          <div className="p-kpi-value">{totalProjects}</div>
          <div className="p-kpi-footer">Across 4 departments</div>
        </div>

        <div className="p-kpi-card card">
          <div className="p-kpi-top">
            <div className="p-kpi-icon green-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <div className="p-kpi-label">Active Now</div>
          </div>
          <div className="p-kpi-value green-text">{activeProjects}</div>
          <div className="p-kpi-footer">2 projects on track</div>
        </div>

        <div className="p-kpi-card card">
          <div className="p-kpi-top">
            <div className="p-kpi-icon blue-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            </div>
            <div className="p-kpi-label">Avg. Progress</div>
          </div>
          <div className="p-kpi-value">{avgProgress}%</div>
          <div className="p-kpi-footer">
            <div className="mini-progress-bg">
              <div className="mini-progress-fill" style={{ width: `${avgProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="p-kpi-card card">
          <div className="p-kpi-top">
            <div className="p-kpi-icon dark-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div className="p-kpi-label">Resources</div>
          </div>
          <div className="p-kpi-value">84%</div>
          <div className="p-kpi-footer">Optimal utilization</div>
        </div>
      </section>

      {/* ── Project Grid ── */}
      <div className="portfolio-header">
        <h2 className="portfolio-title">Active Projects Portfolio</h2>
        <div className="portfolio-actions">
          <button className="btn btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export CSV
          </button>
          <button className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Project
          </button>
        </div>
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="project-card card" 
            onClick={() => setSelectedProject(project)}
            style={{ borderTop: `4px solid ${project.color}` }}
          >
            <div className="p-card-header">
              <div className="p-card-badge" style={{ backgroundColor: `${project.color}15`, color: project.color }}>
                {project.client}
              </div>
              <div className={`p-status-dot ${project.status.toLowerCase()}`} style={{ backgroundColor: project.color }} />
            </div>
            
            <h3 className="p-card-name" style={{ color: project.color }}>{project.name}</h3>
            
            <div className="p-card-meta">
              <div className="p-meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {project.dueDate}
              </div>
            </div>

            <div className="p-progress-section">
              <div className="p-progress-header">
                <span className="p-progress-label">Completion</span>
                <span className="p-progress-val">{project.progress}%</span>
              </div>
              <div className="p-progress-bg">
                <div className="p-progress-fill" style={{ width: `${project.progress}%`, backgroundColor: project.color }} />
              </div>
            </div>

            <div className="p-card-footer">
              <div className="avatar-stack">
                <div className="avatar" style={{ background: '#018bf1' }}>A</div>
                <div className="avatar" style={{ background: '#34C759' }}>B</div>
                <div className="avatar" style={{ background: '#AF52DE' }}>C</div>
                <div className="avatar-more">+2</div>
              </div>
              <button className="p-view-btn">
                View Details
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
