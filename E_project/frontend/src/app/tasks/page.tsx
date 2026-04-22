'use client';
import { useState } from 'react';
import './tasks.css';
import TaskDrawer from '@/components/TaskDrawer';

// ── Types ──────────────────────────────────────────────────────────────────
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  assignees: { name: string; color: string }[];
  tags: string[];
  dueDate?: string;
  storyPoints?: number;
  customFields?: { label: string; value: string }[];
  commentsCount: number;
  attachmentsCount: number;
}

// ── Seed data ──────────────────────────────────────────────────────────────
const initialTasks: ProjectTask[] = [
  { id: 't1', title: 'Define product requirements document', priority: 'High', status: 'todo', assignees: [{ name: 'Alice', color: '#018bf1' }, { name: 'Bob', color: '#34C759' }], tags: ['Planning'], dueDate: '28 Apr', storyPoints: 5, commentsCount: 3, attachmentsCount: 1, customFields: [{ label: 'Client', value: 'Acme Corp' }] },
  { id: 't2', title: 'Brand identity design system', priority: 'Critical', status: 'todo', assignees: [{ name: 'Carol', color: '#FF9500' }], tags: ['Design'], dueDate: '30 Apr', storyPoints: 8, commentsCount: 7, attachmentsCount: 4, customFields: [{ label: 'Budget', value: '$2,000' }] },
  { id: 't3', title: 'Set up Next.js monorepo scaffold', priority: 'High', status: 'in_progress', assignees: [{ name: 'Dave', color: '#AF52DE' }], tags: ['Engineering'], dueDate: '25 Apr', storyPoints: 3, commentsCount: 2, attachmentsCount: 0 },
  { id: 't4', title: 'Implement authentication flow (OAuth + JWT)', priority: 'Critical', status: 'in_progress', assignees: [{ name: 'Alice', color: '#018bf1' }], tags: ['Engineering', 'Security'], dueDate: '27 Apr', storyPoints: 13, commentsCount: 5, attachmentsCount: 2 },
  { id: 't5', title: 'Client onboarding deck (v2)', priority: 'Medium', status: 'in_progress', assignees: [{ name: 'Eve', color: '#FF3B30' }, { name: 'Bob', color: '#34C759' }], tags: ['Marketing'], dueDate: '29 Apr', storyPoints: 2, commentsCount: 1, attachmentsCount: 3 },
  { id: 't6', title: 'Dashboard analytics integration', priority: 'High', status: 'review', assignees: [{ name: 'Dave', color: '#AF52DE' }], tags: ['Engineering'], dueDate: '24 Apr', storyPoints: 8, commentsCount: 9, attachmentsCount: 1 },
  { id: 't7', title: 'UX audit & accessibility review', priority: 'Medium', status: 'review', assignees: [{ name: 'Carol', color: '#FF9500' }, { name: 'Alice', color: '#018bf1' }], tags: ['Design', 'QA'], dueDate: '23 Apr', storyPoints: 5, commentsCount: 4, attachmentsCount: 2 },
  { id: 't8', title: 'Set up CI/CD pipeline (GitHub Actions)', priority: 'Low', status: 'done', assignees: [{ name: 'Dave', color: '#AF52DE' }], tags: ['DevOps'], dueDate: '20 Apr', storyPoints: 3, commentsCount: 0, attachmentsCount: 0 },
  { id: 't9', title: 'Project kickoff meeting & minutes', priority: 'Low', status: 'done', assignees: [{ name: 'Alice', color: '#018bf1' }, { name: 'Eve', color: '#FF3B30' }], tags: ['Planning'], dueDate: '15 Apr', storyPoints: 1, commentsCount: 2, attachmentsCount: 1 },
  { id: 't10', title: 'Competitor landscape research', priority: 'Medium', status: 'backlog', assignees: [], tags: ['Research'], storyPoints: 3, commentsCount: 0, attachmentsCount: 0 },
  { id: 't11', title: 'Notification microservice architecture', priority: 'High', status: 'backlog', assignees: [{ name: 'Dave', color: '#AF52DE' }], tags: ['Engineering'], storyPoints: 8, commentsCount: 1, attachmentsCount: 0 },
];

const COLUMNS: { id: TaskStatus; label: string; accent: string }[] = [
  { id: 'backlog', label: 'Backlog', accent: '#94A3B8' },
  { id: 'todo', label: 'To Do', accent: '#018bf1' },
  { id: 'in_progress', label: 'In Progress', accent: '#FF9500' },
  { id: 'review', label: 'In Review', accent: '#AF52DE' },
  { id: 'done', label: 'Done', accent: '#34C759' },
];

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string }> = {
  Critical: { color: '#FF3B30', bg: 'rgba(255,59,48,0.1)' },
  High: { color: '#FF9500', bg: 'rgba(255,149,0,0.1)' },
  Medium: { color: '#018bf1', bg: 'rgba(1,139,241,0.1)' },
  Low: { color: '#34C759', bg: 'rgba(52,199,89,0.1)' },
};

// ── Sub-components ─────────────────────────────────────────────────────────
function TaskCard({ task, onClick }: { task: ProjectTask; onClick: () => void }) {
  const p = PRIORITY_CONFIG[task.priority];
  return (
    <div className="kboard-card" onClick={onClick}>
      <div className="kcard-header">
        <div className="kcard-tags">
          {task.tags.map(t => <span key={t} className="kcard-tag">{t}</span>)}
        </div>
        <span className="kcard-priority-dot" style={{ background: p.color }} title={task.priority} />
      </div>

      <p className="kcard-title">{task.title}</p>

      {task.customFields?.map(cf => (
        <div key={cf.label} className="kcard-custom-field">
          <span className="cf-label">{cf.label}</span>
          <span className="cf-value">{cf.value}</span>
        </div>
      ))}

      <div className="kcard-footer">
        <div className="kcard-avatars">
          {task.assignees.slice(0, 3).map(a => (
            <div key={a.name} className="avatar-chip" style={{ background: a.color }} title={a.name}>
              {a.name[0]}
            </div>
          ))}
        </div>
        <div className="kcard-meta">
          {task.dueDate && (
            <span className="kcard-due">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              {task.dueDate}
            </span>
          )}
          {task.storyPoints && <span className="kcard-sp">{task.storyPoints} pts</span>}
          {task.commentsCount > 0 && (
            <span className="kcard-comments">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {task.commentsCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ column, tasks, onCardClick }: {
  column: typeof COLUMNS[0];
  tasks: ProjectTask[];
  onCardClick: (task: ProjectTask) => void;
}) {
  return (
    <div className="kboard-column">
      <div className="kboard-col-header">
        <div className="kboard-col-title">
          <span className="kboard-col-dot" style={{ background: column.accent }} />
          <span className="kboard-col-label">{column.label}</span>
          <span className="kboard-col-count">{tasks.length}</span>
        </div>
        <button className="kboard-col-add" title="Add task">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

      <div className="kboard-cards">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={() => onCardClick(task)} />
        ))}
        <button className="kboard-add-card">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add task
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function TasksPage() {
  const [tasks] = useState<ProjectTask[]>(initialTasks);
  const [activeView, setActiveView] = useState<'board' | 'list' | 'gantt' | 'backlog'>('board');
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);

  const getColumnTasks = (status: TaskStatus) =>
    tasks.filter(t => t.status === status);

  return (
    <div className="tasks-page animate-fade-in">
      {/* Page Toolbar */}
      <div className="tasks-toolbar">
        <div className="tasks-project-info">
          <div className="project-breadcrumb">
            <span className="breadcrumb-org">Les Arsène Creatives</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span className="breadcrumb-project">ERP Platform</span>
          </div>
          <h1 className="tasks-page-title">ERP Platform — Sprint 3</h1>
        </div>

        <div className="tasks-toolbar-right">
          {/* View Switcher */}
          <div className="view-switcher">
            {([['board', 'Board'], ['list', 'List'], ['gantt', 'Gantt'], ['backlog', 'Backlog']] as const).map(([v, label]) => (
              <button
                key={v}
                className={`view-btn ${activeView === v ? 'active' : ''}`}
                onClick={() => setActiveView(v)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="toolbar-divider" />

          {/* Filter & Group controls */}
          <button className="toolbar-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Filter
          </button>
          <button className="toolbar-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Group by
          </button>

          {/* Assignee Avatars (filters by person) */}
          <div className="toolbar-assignees">
            {[{ name: 'Alice', color: '#018bf1' }, { name: 'Dave', color: '#AF52DE' }, { name: 'Carol', color: '#FF9500' }].map(a => (
              <div key={a.name} className="avatar-chip" style={{ background: a.color }}>{a.name[0]}</div>
            ))}
          </div>

          <button className="toolbar-btn primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {activeView === 'board' && (
        <div className="kboard-scroll-wrapper">
          <div className="kboard-grid">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={getColumnTasks(col.id)}
                onCardClick={setSelectedTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Placeholder for other views */}
      {activeView !== 'board' && (
        <div className="view-placeholder">
          <div className="vp-icon">
            {activeView === 'list' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
            {activeView === 'gantt' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            {activeView === 'backlog' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>}
          </div>
          <h2 className="vp-title">{activeView === 'list' ? 'List View' : activeView === 'gantt' ? 'Gantt Chart' : 'Backlog'}</h2>
          <p className="vp-sub">Coming up next — this view is being built.</p>
        </div>
      )}

      {/* Sliding Drawer */}
      {selectedTask && (
        <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
