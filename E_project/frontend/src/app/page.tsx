'use client';

import { useState } from 'react';
import { useProject } from "@/context/ProjectContext";
import PortfolioView from "@/components/PortfolioView";
import RightSidebar from "@/components/RightSidebar";
import "./page.css";

// ── Kanban seed data ────────────────────────────────────────────────────────
const COLUMNS = [
  { id: 'todo',        label: 'To Do',       accent: '#018bf1', count: 2 },
  { id: 'in_progress', label: 'In Progress',  accent: '#FF9500', count: 3 },
  { id: 'review',      label: 'In Review',    accent: '#AF52DE', count: 2 },
  { id: 'done',        label: 'Done',         accent: '#34C759', count: 2 },
];

const TASKS = [
  { id: 't1', col: 'todo',        title: 'Define product requirements document', priority: 'High',     tag: 'Planning',     due: '28 Apr', assignees: ['#018bf1', '#34C759'] },
  { id: 't2', col: 'todo',        title: 'Brand identity design system',          priority: 'Critical', tag: 'Design',       due: '30 Apr', assignees: ['#FF9500'] },
  { id: 't3', col: 'in_progress', title: 'Set up Next.js monorepo scaffold',      priority: 'High',     tag: 'Engineering',  due: '25 Apr', assignees: ['#AF52DE'] },
  { id: 't4', col: 'in_progress', title: 'Implement authentication flow (OAuth)', priority: 'Critical', tag: 'Security',     due: '27 Apr', assignees: ['#018bf1'] },
  { id: 't5', col: 'in_progress', title: 'Client onboarding deck (v2)',           priority: 'Medium',   tag: 'Marketing',    due: '29 Apr', assignees: ['#FF3B30', '#34C759'] },
  { id: 't6', col: 'review',      title: 'Dashboard analytics integration',       priority: 'High',     tag: 'Engineering',  due: '24 Apr', assignees: ['#AF52DE'] },
  { id: 't7', col: 'review',      title: 'UX audit & accessibility review',       priority: 'Medium',   tag: 'QA',           due: '23 Apr', assignees: ['#FF9500', '#018bf1'] },
  { id: 't8', col: 'done',        title: 'Set up CI/CD pipeline (GitHub Actions)',priority: 'Low',      tag: 'DevOps',       due: '20 Apr', assignees: ['#AF52DE'] },
  { id: 't9', col: 'done',        title: 'Project kickoff meeting & minutes',     priority: 'Low',      tag: 'Planning',     due: '15 Apr', assignees: ['#018bf1', '#FF3B30'] },
];


// ── List view seed data ─────────────────────────────────────────────────────
const LIST_TASKS = [
  { title: 'Define product requirements document', status: 'To Do',       priority: 'High',     assignee: 'Alice',  due: '28 Apr' },
  { title: 'Brand identity design system',          status: 'To Do',       priority: 'Critical', assignee: 'Carol',  due: '30 Apr' },
  { title: 'Set up Next.js monorepo scaffold',      status: 'In Progress', priority: 'High',     assignee: 'Dave',   due: '25 Apr' },
  { title: 'Implement authentication flow',         status: 'In Progress', priority: 'Critical', assignee: 'Alice',  due: '27 Apr' },
  { title: 'Dashboard analytics integration',       status: 'In Review',   priority: 'High',     assignee: 'Dave',   due: '24 Apr' },
  { title: 'UX audit & accessibility review',       status: 'In Review',   priority: 'Medium',   assignee: 'Carol',  due: '23 Apr' },
  { title: 'Set up CI/CD pipeline',                 status: 'Done',        priority: 'Low',      assignee: 'Dave',   due: '20 Apr' },
];


// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { selectedProject } = useProject();
  const [view, setView] = useState<'gantt' | 'board' | 'list'>('gantt');

  return (
    <div className="dashboard-layout animate-fade-in">
      <div className="dashboard-main-column">
        {!selectedProject ? (
          <PortfolioView />
        ) : (
          <>
            {/* ── KPI Section ── */}
            <section className="kpi-outer-wrapper card">
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <div className="kpi-icon-group">
                      <div className="kpi-icon blue-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                      </div>
                      <span className="kpi-title">Assigned Tasks</span>
                    </div>
                    <span className="kpi-value">10</span>
                  </div>
                  <div className="kpi-card-body">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: '60%' }}></div>
                    </div>
                    <div className="kpi-footer">
                      <span className="kpi-footer-label">Submitted</span>
                      <span className="kpi-footer-val">6</span>
                    </div>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <div className="kpi-icon green-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                    </div>
                    <div className="kpi-action-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                  <div className="kpi-card-body mt-auto">
                    <div className="kpi-footer">
                      <span className="kpi-footer-title">Approved</span>
                      <span className="kpi-value-lg">4</span>
                    </div>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <div className="kpi-icon dark-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                    </div>
                    <div className="kpi-action-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                  <div className="kpi-card-body mt-auto">
                    <div className="kpi-footer">
                      <span className="kpi-footer-title">Under Review</span>
                      <span className="kpi-value-lg">2</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── View Switcher ── */}
            <div className="view-switcher-row">
              <div className="schedule-toggle">
                <div className={`toggle-btn ${view === 'gantt' ? 'active' : ''}`} onClick={() => setView('gantt')}>Gantt</div>
                <div className={`toggle-btn ${view === 'board' ? 'active' : ''}`} onClick={() => setView('board')}>Board</div>
                <div className={`toggle-btn ${view === 'list'  ? 'active' : ''}`} onClick={() => setView('list')}>List</div>
              </div>
            </div>

            {/* Detailed Views */}
            {view === 'gantt' && (
              <section className="schedule-card card">
                <div className="schedule-header">
                  <div className="schedule-title-group">
                    <div className="schedule-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <h2 className="schedule-title">Task Schedule</h2>
                  </div>
                </div>
                {/* Timeline Grid omitted for brevity */}
                <p style={{ padding: '20px', color: 'var(--text-muted)' }}>Project Timeline Grid active for {selectedProject.name}</p>
              </section>
            )}

            {view === 'board' && (
              <section className="kanban-section card">
                <div className="kanban-scroll">
                  {COLUMNS.map(col => (
                    <div key={col.id} className="kanban-col">
                      <div className="kanban-col-header">
                        <span className="kanban-col-label">{col.label}</span>
                      </div>
                      {TASKS.filter(t => t.col === col.id).map(task => (
                        <div key={task.id} className="kanban-card">
                          <p className="kc-title">{task.title}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {view === 'list' && (
              <section className="list-section card">
                {LIST_TASKS.map((t, i) => (
                  <div key={i} className="list-row">
                    <span className="lr-title">{t.title}</span>
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>

      <RightSidebar mode="dashboard" />
    </div>
  );
}
