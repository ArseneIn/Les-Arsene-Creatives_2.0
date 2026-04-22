'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';

interface RightSidebarProps {
  mode: 'dashboard' | 'reports';
}

export default function RightSidebar({ mode }: RightSidebarProps) {
  const { selectedProject } = useProject();

  // ── Portfolio Sidebar (No Selection) ──
  if (!selectedProject) {
    return (
      <div className="dashboard-right-column">
        <div className="side-widget card">
          <div className="side-widget-header">
            <div className="widget-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            </div>
            <div className="widget-header-text">
              <h3 className="widget-title">Portfolio Health</h3>
              <p className="widget-subtitle">Across all projects</p>
            </div>
          </div>
          <div className="side-stat-list">
             <div className="s-stat-item">
                <span className="s-stat-label">On Track</span>
                <span className="s-stat-badge tag-green-text">7 projects</span>
             </div>
             <div className="s-stat-item">
                <span className="s-stat-label">At Risk</span>
                <span className="s-stat-badge tag-red-text">2 projects</span>
             </div>
             <div className="s-stat-item">
                <span className="s-stat-label">Paused</span>
                <span className="s-stat-badge tag-blue-text">1 project</span>
             </div>
          </div>
        </div>

        <div className="side-widget card" style={{ marginTop: '12px' }}>
          <div className="side-widget-header">
            <h3 className="widget-title" style={{ fontSize: '0.9rem' }}>Recent Performance</h3>
          </div>
          <div className="mini-chart-placeholder">
             {/* Simple visual indicator */}
             <div className="mini-bar-stack">
                <div style={{ height: '40%', background: '#F1F5F9' }} />
                <div style={{ height: '60%', background: '#F1F5F9' }} />
                <div style={{ height: '80%', background: 'var(--primary-blue)' }} />
                <div style={{ height: '50%', background: '#F1F5F9' }} />
                <div style={{ height: '70%', background: '#F1F5F9' }} />
             </div>
             <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>Velocity has increased by 14% this month</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Project Specific Sidebar ──
  return (
    <div className="dashboard-right-column">
      {mode === 'dashboard' ? (
        <>
          <div className="side-widget card">
            <div className="side-widget-header">
              <div className="widget-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z" fill="currentColor"></path>
                </svg>
              </div>
              <div className="widget-header-text">
                <h3 className="widget-title">Overdue Status</h3>
                <p className="widget-subtitle">Project specific metrics</p>
              </div>
            </div>
            <div className="side-widget-cards">
              <div className="side-stat-card">
                <div className="side-stat-top">
                  <div className="stat-icon-wrapper text-blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                  </div>
                  <div className="stat-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                </div>
                <div className="side-stat-bottom">
                  <div className="side-stat-label">Overdue<br/>Tasks</div>
                  <div className="side-stat-value">1</div>
                </div>
              </div>
              <div className="side-stat-card">
                <div className="side-stat-top">
                  <div className="stat-icon-wrapper text-yellow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                  </div>
                  <div className="stat-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                </div>
                <div className="side-stat-bottom">
                  <div className="side-stat-label">Upcoming<br/>Overdue</div>
                  <div className="side-stat-value">3</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="side-widget card">
            <div className="side-widget-header">
              <div className="widget-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div className="widget-header-text">
                <h3 className="widget-title">Top Contributors</h3>
                <p className="widget-subtitle">By Velocity</p>
              </div>
            </div>
            <div className="contributor-list">
               {[
                 { name: 'Alice Johnson', tasks: 12, color: '#018bf1' },
                 { name: 'David Smith', tasks: 9, color: '#34C759' },
                 { name: 'Carol White', tasks: 7, color: '#AF52DE' },
               ].map((c, i) => (
                 <div key={i} className="contributor-item">
                    <div className="c-avatar" style={{ background: c.color }}>{c.name[0]}</div>
                    <div className="c-info">
                       <span className="c-name">{c.name}</span>
                       <span className="c-tasks">{c.tasks} Tasks completed</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="side-widget card" style={{ marginTop: '12px' }}>
            <div className="side-widget-header">
               <div className="widget-icon">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#AF52DE" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
               </div>
               <h3 className="widget-title">Strategic Insights</h3>
            </div>
            <div className="insight-list">
               <div className="insight-item">
                  <div className="insight-dot success" />
                  <p>Velocity is <strong>15% above</strong> project baseline.</p>
               </div>
               <div className="insight-item">
                  <div className="insight-dot warning" />
                  <p><strong>3 Milestones</strong> approaching in next 7 days.</p>
               </div>
            </div>
          </div>
        </>
      )}

      {/* Common Deadlines List (Shown in both project modes) */}
      <div className="side-widget card" style={{ marginTop: '12px', borderTop: '3px solid #FF3B30' }}>
        <div className="side-widget-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="widget-icon" style={{ background: '#FEE2E2', color: '#FF3B30' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 className="widget-title">Deadlines</h3>
          </div>
          <span className="dropdown-badge">This Week</span>
        </div>
        <div className="deadlines-mini">
           {[
             { title: 'Brand Deck Review', due: 'Today', priority: 'High' },
             { title: 'API Integration', due: 'Tomorrow', priority: 'Med' },
           ].map((d, i) => (
             <div key={i} className="deadline-mini-item">
                <div className="dm-left">
                   <div className="dm-title">{d.title}</div>
                   <div className="dm-due">{d.due}</div>
                </div>
                <div className={`dm-priority ${d.priority.toLowerCase()}`}>{d.priority}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
