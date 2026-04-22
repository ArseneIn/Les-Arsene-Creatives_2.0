'use client';

import { useState, useEffect } from 'react';
import type { ProjectTask, Priority } from '@/app/tasks/page';
import './TaskDrawer.css';

const PRIORITY_CONFIG: Record<Priority, { color: string; label: string }> = {
  Critical: { color: '#FF3B30', label: 'Critical' },
  High: { color: '#FF9500', label: 'High' },
  Medium: { color: '#018bf1', label: 'Medium' },
  Low: { color: '#34C759', label: 'Low' },
};

const MOCK_ACTIVITY = [
  { type: 'status', actor: 'Alice Johnson', text: 'moved this task to', detail: 'In Review', time: '2h ago' },
  { type: 'comment', actor: 'David Smith', text: 'Added the OAuth token refresh logic. Ready for review.', time: '3h ago' },
  { type: 'status', actor: 'Carol White', text: 'changed priority to', detail: 'High', time: 'yesterday' },
  { type: 'comment', actor: 'Alice Johnson', text: 'Let\'s align on the UX before we start coding the auth flow.', time: '2d ago' },
];

export default function TaskDrawer({ task, onClose }: { task: ProjectTask; onClose: () => void }) {
  const [tab, setTab] = useState<'details' | 'activity'>('details');
  const [visible, setVisible] = useState(false);
  const p = PRIORITY_CONFIG[task.priority];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    return () => setVisible(false);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  return (
    <>
      <div className={`drawer-backdrop ${visible ? 'visible' : ''}`} onClick={handleClose} />

      <div className={`task-drawer ${visible ? 'open' : ''}`}>
        {/* ── Header ── */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span className="drawer-task-id">TASK-{task.id.toUpperCase()}</span>
            <div className="drawer-header-divider" />
            <span
              className="drawer-priority-badge"
              style={{ color: p.color, background: `${p.color}15` }}
            >
              <span className="dp-dot" style={{ background: p.color }} />
              {p.label}
            </span>
          </div>
          <div className="drawer-header-actions">
            <button className="dh-btn" title="Share">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
            <button className="dh-btn close-btn" onClick={handleClose} title="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className="drawer-scroll-area">
          {/* ── Title ── */}
          <div className="drawer-title-section">
            <h2 className="drawer-task-title">{task.title}</h2>
            <div className="drawer-tags">
              {task.tags.map(t => <span key={t} className="drawer-tag">{t}</span>)}
              <button className="add-tag-btn">+ Add Tag</button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="drawer-tabs">
            <button className={`dtab ${tab === 'details' ? 'active' : ''}`} onClick={() => setTab('details')}>Details</button>
            <button className={`dtab ${tab === 'activity' ? 'active' : ''}`} onClick={() => setTab('activity')}>
              Activity
              {task.commentsCount > 0 && <span className="dtab-badge">{task.commentsCount}</span>}
            </button>
          </div>

          {/* ── Content Area ── */}
          <div className="drawer-body">
            {tab === 'details' ? (
              <div className="tab-content animate-fade-in">
                {/* Metadata Grid */}
                <div className="meta-grid">
                  <div className="meta-row">
                    <span className="meta-label">Status</span>
                    <div className="meta-value">
                      <span className="meta-status-pill">{task.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Assignees</span>
                    <div className="meta-value">
                      <div className="assignee-list">
                        {task.assignees.length > 0 ? task.assignees.map(a => (
                          <div key={a.name} className="avatar-chip-sm" style={{ background: a.color }}>{a.name[0]}</div>
                        )) : <span className="meta-empty">Unassigned</span>}
                        <button className="meta-add-btn">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Due Date</span>
                    <div className="meta-value date-val">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {task.dueDate ?? <span className="meta-empty">Not set</span>}
                    </div>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Story Points</span>
                    <div className="meta-value sp-val">{task.storyPoints ?? <span className="meta-empty">—</span>}</div>
                  </div>

                  {task.customFields && task.customFields.length > 0 && (
                    <>
                      <div className="meta-divider" />
                      <div className="meta-section-label">Custom Fields</div>
                      {task.customFields.map(cf => (
                        <div key={cf.label} className="meta-row">
                          <span className="meta-label">{cf.label}</span>
                          <div className="meta-value">{cf.value}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="drawer-section">
                  <div className="ds-header">
                    <span className="ds-label">Description</span>
                    <button className="ds-edit-btn">Edit</button>
                  </div>
                  <div className="ds-description">
                    {task.description ?? 'Add a detailed description to provide project context and requirements…'}
                  </div>
                </div>

                <div className="drawer-section">
                  <div className="ds-header">
                    <span className="ds-label">Subtasks</span>
                    <span className="ds-count">1/3 Done</span>
                  </div>
                  <div className="subtask-list">
                    <div className="subtask-item done">
                      <div className="subtask-checkbox checked">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="subtask-text">Initial research & scoping</span>
                    </div>
                    <div className="subtask-item">
                      <div className="subtask-checkbox" />
                      <span className="subtask-text">Draft initial wireframes</span>
                    </div>
                    <div className="subtask-item">
                      <div className="subtask-checkbox" />
                      <span className="subtask-text">Stakeholder sign-off</span>
                    </div>
                  </div>
                  <button className="add-subtask-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add subtask
                  </button>
                </div>
              </div>
            ) : (
              <div className="tab-content animate-fade-in">
                <div className="activity-list">
                  {MOCK_ACTIVITY.map((a, i) => (
                    <div key={i} className="activity-item">
                      <div className="activity-avatar" style={{ background: a.actor.includes('Alice') ? '#018bf1' : a.actor.includes('David') ? '#34C759' : '#AF52DE' }}>
                        {a.actor[0]}
                      </div>
                      <div className="activity-content">
                        {a.type === 'comment' ? (
                          <div className="activity-comment-block">
                            <div className="activity-header">
                              <span className="actor-name">{a.actor}</span>
                              <span className="activity-time">{a.time}</span>
                            </div>
                            <div className="activity-comment-text">{a.text}</div>
                          </div>
                        ) : (
                          <div className="activity-event-row">
                            <span className="actor-name">{a.actor}</span>
                            <span className="event-text">{a.text}</span>
                            <span className="event-detail">{a.detail}</span>
                            <span className="activity-time-dot">•</span>
                            <span className="activity-time">{a.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer / Comment area ── */}
        <div className="drawer-footer">
          <div className="comment-input-container">
            <div className="comment-avatar-pill">AJ</div>
            <input className="comment-field" placeholder="Share your feedback or @mention team members…" />
            <button className="send-comment-btn">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
