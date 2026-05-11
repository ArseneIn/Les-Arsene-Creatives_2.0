'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useProject } from '@/context/ProjectContext';
import Skeleton from '@/components/Skeleton';
import TaskDrawer from '@/components/TaskDrawer';
import PortfolioView from '@/components/PortfolioView';
import './tasks/tasks.css'; 
import './page.css';

// ── Types ──────────────────────────────────────────────────────────────────
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  assignees: { name: string; color: string }[];
  tags: string[];
  dueDate?: string;
  commentsCount: number;
  attachmentsCount: number;
}

export interface LogframeNode {
  id: string;
  type: 'Outcome' | 'Output' | 'Activity';
  indicator: string;
  baseline: string;
  target: string;
  actual: string;
  variance: string;
  budget: string;
  verification: string;
  deadline: string;
  status: 'In Progress' | 'On Track' | 'Delayed' | 'Completed';
  mov: string; 
  assumptions: string;
  source: 'ODK' | 'Kobo' | 'Manual';
}

const DASHBOARD_COLUMNS: { id: TaskStatus; label: string; accent: string }[] = [
  { id: 'todo', label: 'To Do', accent: '#018bf1' },
  { id: 'in_progress', label: 'In Progress', accent: '#FF9500' },
  { id: 'review', label: 'In Review', accent: '#AF52DE' },
  { id: 'done', label: 'Done', accent: '#34C759' },
];

const INITIAL_LOGFRAME: LogframeNode[] = [
  { id: 'L1', type: 'Outcome', indicator: 'Adoption Rate across Focalized Agencies', baseline: '0%', target: '95%', actual: '82%', variance: '-13%', budget: '$124,000', verification: 'Apr 20, 2024', deadline: 'May 15, 2024', status: 'On Track', mov: 'System Access Logs including centralized node authentication records.', assumptions: 'Network stability remains > 99% across regional hubs.', source: 'ODK' },
  { id: 'L2', type: 'Output', indicator: 'Node Infrasynchronization (Regional Hubs)', baseline: '2', target: '24', actual: '18', variance: '-25%', budget: '$64,200', verification: 'Apr 22, 2024', deadline: 'May 10, 2024', status: 'In Progress', mov: 'Network Map Audit and real-time node heartbeat validation.', assumptions: 'Hardware delivery timelines hit Q2 without logistical latency.', source: 'Kobo' },
  { id: 'L3', type: 'Activity', indicator: 'Deploy Multi-Protocol Identity Nodes', baseline: '0', target: '48', actual: '48', variance: '0%', budget: '$18,500', verification: 'Apr 18, 2024', deadline: 'Completed', status: 'Completed', mov: 'Server Logs and encryption handshake validation.', assumptions: 'N/A', source: 'Manual' },
];

const MOCK_TASKS: ProjectTask[] = [
  { id: 't1', projectId: 'p1', title: 'Synchronize E-Project System Core Architecture', priority: 'High', status: 'todo', assignees: [{ name: 'Nuru', color: '#018bf1' }], tags: ['Engineering'], dueDate: '24 Apr', commentsCount: 3, attachmentsCount: 2 },
  { id: 't2', projectId: 'p1', title: 'Imigongo Heritage Design Assets', priority: 'Critical', status: 'in_progress', assignees: [{ name: 'Freddy', color: '#FF9500' }], tags: ['Design'], dueDate: '25 Apr', commentsCount: 5, attachmentsCount: 8 },
  { id: 't3', projectId: 'p1', title: 'Identity Nexus Security Audit', priority: 'High', status: 'review', assignees: [{ name: 'Alice', color: '#AF52DE' }], tags: ['Security'], dueDate: '26 Apr', commentsCount: 2, attachmentsCount: 1 },
  { id: 't4', projectId: 'p1', title: 'Finalize High-Density UI Metrics', priority: 'Medium', status: 'in_progress', assignees: [{ name: 'Nuru', color: '#018bf1' }], tags: ['UX'], dueDate: '27 Apr', commentsCount: 1, attachmentsCount: 0 },
];

// ── Sub-components ─────────────────────────────────────────────────────────
function DashboardTaskCard({ task, onClick }: { task: ProjectTask; onClick: () => void }) {
  return (
    <div className="kboard-card" onClick={onClick}>
      <div className="kcard-header">
        <div className="kcard-tags">{task.tags.map(t => <span key={t} className="kcard-tag">{t}</span>)}</div>
        <span className="kcard-priority-dot" style={{ background: task.priority === 'Critical' ? '#FF3B30' : task.priority === 'High' ? '#FF9500' : '#018bf1' }} />
      </div>
      <p className="kcard-title" style={{ fontSize: '0.9rem', marginBottom: '12px', fontWeight: 600 }}>{task.title}</p>
      <div className="kcard-footer">
        <div className="kcard-avatars">
          {task.assignees.map(a => (<div key={a.name} className="avatar-chip" style={{ background: a.color, width: '24px', height: '24px', fontSize: '0.65rem' }}>{a.name[0]}</div>))}
        </div>
        <span className="kcard-due font-numeric" style={{ fontSize: '0.75rem' }}>{task.dueDate}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { selectedProject } = useProject();
  const [activeLayer, setActiveLayer] = useState<'intelligence' | 'performance' | 'me_hub'>('performance');
  const [perfView, setPerfView] = useState<'board' | 'list' | 'gantt'>('board');
  const [tabLoading, setTabLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  
  const [logframeNodes, setLogframeNodes] = useState<LogframeNode[]>(INITIAL_LOGFRAME);
  const [selectedLognode, setSelectedLognode] = useState<LogframeNode | null>(null);

  const userClearance = 'Lead Orchestrator';

  useEffect(() => {
    const timer = setTimeout(() => setTabLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeLayer, perfView, selectedProject]);

  const switchLayer = (layer: 'intelligence' | 'performance' | 'me_hub') => {
    setTabLoading(true);
    setActiveLayer(layer);
  };

  const filteredTasks = useMemo(() => {
    if (!selectedProject) return MOCK_TASKS;
    return MOCK_TASKS.filter(t => t.projectId === selectedProject.id || selectedProject.id === 'p1'); 
  }, [selectedProject]);

  const handleUpdateNode = (id: string, field: keyof LogframeNode, value: string) => {
    setLogframeNodes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const handleAddNode = () => {
    const newNode: LogframeNode = {
      id: `L${logframeNodes.length + 1}`,
      type: 'Activity',
      indicator: 'New indicator node',
      baseline: '0',
      target: '100',
      actual: '0',
      variance: '0%',
      budget: '$0',
      verification: new Date().toLocaleDateString(),
      deadline: 'Pending',
      status: 'In Progress',
      mov: 'External technical audit.',
      assumptions: 'Standard operative conditions.',
      source: 'Manual'
    };
    setLogframeNodes([...logframeNodes, newNode]);
  };

  if (!selectedProject) {
    return <PortfolioView />;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* ── PROJECT DASHBOARD HEADER ── */}
      <div className="dashboard-header-nexus" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 8px' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.05em', margin: 0 }}>{selectedProject.name}</h1>
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary-blue)', fontSize: '0.95rem' }}>{selectedProject.client}</span>
            <span style={{ width: '1px', height: '14px', background: '#E2E8F0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span className="font-numeric">Jan 12 ➔ Dec 30, 2024</span>
              <span style={{ marginLeft: '4px', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>Progress: 29.5%</span>
              <span style={{ marginLeft: '4px', color: 'var(--primary-blue)', fontWeight: 700 }}>{userClearance}</span>
            </div>
          </div>
        </div>
        <div className="primary-layer-tabs" style={{ display: 'flex', gap: '12px', background: '#F1F5F9', padding: '6px', borderRadius: '16px' }}>
          <button className={`tasks-v-btn ${activeLayer === 'intelligence' ? 'active' : ''}`} onClick={() => switchLayer('intelligence')}>Governance & Charter</button>
          <button className={`tasks-v-btn ${activeLayer === 'performance' ? 'active' : ''}`} onClick={() => switchLayer('performance')}>Work Management</button>
          <button className={`tasks-v-btn ${activeLayer === 'me_hub' ? 'active' : ''}`} onClick={() => switchLayer('me_hub')}>M&E Framework</button>
        </div>
      </div>

      <div className="layer-content-nexus" style={{ flex: 1, minHeight: 0 }}>
        {tabLoading ? <Skeleton variant="kanban" count={4} /> : (
          <>
            {/* ── LAYER 1: GOVERNANCE & CHARTER (TOTAL RECONSTRUCTION) ── */}
            {activeLayer === 'intelligence' && (
              <div className="intelligence-layer-view animate-slide-up">
                <div className="intel-main-col" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Executive Summary Hero */}
                  <div className="intel-hero-card">
                    <h2 className="intel-hero-title">Executive Summary</h2>
                    <p className="intel-hero-brief">Defining strategic orchestration and industrial scope for the {selectedProject.name} digital infrastructure. This framework secures the governance nexus and validates all operational nodes.</p>
                    <div className="intel-stat-row">
                      <div className="intel-stat-item"><label>Strategic Status</label><span>Authorized</span></div>
                      <div className="intel-stat-item"><label>Budget Allocated</label><span className="font-numeric">$424,000</span></div>
                      <div className="intel-stat-item"><label>Reporting Cadence</label><span>Weekly Executive</span></div>
                    </div>
                  </div>

                  {/* Milestone Ledger */}
                  <div className="card charter-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 className="charter-title" style={{ margin: 0 }}>Project Milestone Schedule</h3>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-blue)' }}>4 of 12 GATES CLEARED</span>
                    </div>
                    <div className="charter-table-wrap">
                      <table className="charter-table">
                        <thead><tr><th>Milestone Node</th><th className="font-numeric">Target Date</th><th>Status</th></tr></thead>
                        <tbody>
                          <tr><td>System Infrastructure Initialization</td><td className="font-numeric">Feb 10, 2024</td><td><span className="lr-status" style={{ background: '#34C75915', color: '#34C759' }}>CLEARED</span></td></tr>
                          <tr><td>Heritage Design Assets Protocol</td><td className="font-numeric">Mar 15, 2024</td><td><span className="lr-status" style={{ background: '#34C75915', color: '#34C759' }}>CLEARED</span></td></tr>
                          <tr><td>Identity Validation Alpha Node</td><td className="font-numeric">Apr 30, 2024</td><td><span className="lr-status" style={{ background: '#FF950015', color: '#FF9500' }}>IN PROGRESS</span></td></tr>
                          <tr><td>Security Audit & Zero-Knowledge Test</td><td className="font-numeric">May 20, 2024</td><td><span className="lr-status" style={{ background: '#F1F5F9', color: 'var(--text-muted)' }}>PENDING</span></td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="intel-side-col" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Risk Profile */}
                  <div className="intel-side-card">
                    <h3 className="charter-label">Risk Assessment Profile</h3>
                    <div className="risk-meter-wrap" style={{ margin: '20px 0' }}>
                      <div className="risk-meter"><div className="risk-pointer" style={{ left: '35%' }} /></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 800, marginTop: '8px' }}><span>LOW</span><span>MODERATE</span><span>HIGH</span></div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Operational risk is currently <strong>Moderate</strong> based on hardware delivery constraints in Q2.</p>
                  </div>

                  <div className="intel-side-card">
                    <h3>Project Repository</h3>
                    <div className="asset-item" style={{ background: '#F8FAFC' }}>
                      <div className="asset-icon-box" style={{ background: 'var(--primary-blue)', color: 'white' }}>PDF</div>
                      <div style={{ flex: 1 }}><p style={{ margin: 0, fontWeight: 700, fontSize: '0.8rem' }}>Project_Charter_V4.pdf</p><p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.6 }}>Updated yesterday</p></div>
                    </div>
                    <button className="btn btn-outline" style={{ width: '100%', marginTop: '16px', borderRadius: '10px', height: '36px', fontSize: '0.75rem' }}>View All Assets</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── LAYER 2: WORK MANAGEMENT (TOTAL RECONSTRUCTION) ── */}
            {activeLayer === 'performance' && (
              <div className="performance-layer-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[{l:'SPI',v:'0.94',t:'+2d Ahead'},{l:'Resource Burn',v:'64%',t:'On Budget'},{l:'Work Packages',v:'12 Active',t:'Nominal'},{l:'Milestone Due',v:'Apr 30',t:'In 6d'}].map(k => (
                    <div key={k.l} className="kpi-card">
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{k.l}</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{k.v}</div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-blue)' }}>{k.t}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="tasks-v-switcher" style={{ background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
                    {(['board', 'list', 'gantt'] as const).map(v => (<button key={v} className={`tasks-v-btn ${perfView === v ? 'active' : ''}`} onClick={() => setPerfView(v)}>{v === 'board' ? 'Kanban board' : v.toUpperCase() + ' View'}</button>))}
                  </div>
                  <button className="btn btn-primary" style={{ padding: '0 16px', height: '36px', fontSize: '0.85rem', borderRadius: '10px' }}>+ New Work Item</button>
                </div>

                <div className="dashboard-content-area">
                  {perfView === 'board' ? (
                    <div className="kboard-scroll-wrapper" style={{ paddingBottom: '40px' }}><div className="kboard-grid" style={{ display: 'flex', gap: '24px' }}>
                      {DASHBOARD_COLUMNS.map(col => (
                        <div key={col.id} className={`kboard-column phase-${col.id}`} style={{ width: '320px', minWidth: '320px' }}>
                          <div className="kboard-col-header"><div className="kboard-col-title"><span className="kboard-col-dot" style={{ background: col.accent }} /><span className="kboard-col-label">{col.label} Status</span><span className="kboard-col-count">{filteredTasks.filter(t => t.status === col.id).length}</span></div></div>
                          <div className="kboard-cards" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                             {filteredTasks.filter(t => t.status === col.id).map(t => (<DashboardTaskCard key={t.id} task={t} onClick={() => setSelectedTask(t)} />))}
                             <button className="kboard-add-card" style={{ padding: '16px', background: '#F8FAFC', border: '1px dashed #E2E8F0', borderRadius: '16px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>+ Add Work Package</button>
                          </div>
                        </div>
                      ))}
                    </div></div>
                  ) : perfView === 'list' ? (
                    <div className="card" style={{ padding: '24px', background: 'white', borderRadius: '24px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', borderBottom: '1.5px solid #F1F5F9' }}><th style={{ padding: '12px' }}>Operational Activity</th><th style={{ padding: '12px' }}>Status</th><th style={{ padding: '12px' }}>Assignee</th><th style={{ padding: '12px' }}>Deadline</th></tr></thead>
                        <tbody>{filteredTasks.map(t => (<tr key={t.id} className="ledger-row" onClick={() => setSelectedTask(t)} style={{ borderBottom: '1px solid #F1F5F9', cursor: 'pointer' }}><td style={{ padding: '16px 12px', fontWeight: 600 }}>{t.title}</td><td><span className={`status-pill pill-${t.status}`} style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem' }}>{t.status.replace('_',' ')}</span></td><td>{t.assignees[0].name}</td><td className="font-numeric">{t.dueDate}</td></tr>))}</tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="card" style={{ padding: '60px', textAlign: 'center', background: 'white', borderRadius: '32px' }}>
                      <h3 style={{ color: 'var(--text-main)', margin: '0 0 12px' }}>Temporal Schedule Engine</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Gantt timeline active and synchronizing terminal dates.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── LAYER 3: M&E FRAMEWORK (FULL UPGRADE) ── */}
            {activeLayer === 'me_hub' && (
              <div className="me-hub-layer animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="me-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {[
                    { l: 'Indicator Progress (IAI)', v: '87%', t: 'On Target', c: 'var(--primary-blue)' },
                    { l: 'Budget Efficiency', v: '92%', t: '$182k Spent', c: '#34C759' },
                    { l: 'Data Verification', v: '18 nodes', t: 'Heartbeat: Stable', c: '#AF52DE' },
                    { l: 'Negative Variance', v: '03 Areas', t: 'Attention Required', c: '#FF9500' }
                  ].map(k => (
                    <div key={k.l} className="card" style={{ padding: '20px', borderLeft: `4px solid ${k.c}` }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{k.l}</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0' }}>{k.v}</div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: k.c }}>{k.t}</span>
                    </div>
                  ))}
                </div>

                <div className="card charter-card" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div><h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.4rem' }}>Logframe Performance Ledger</h2><p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Administrative calibration of indicators and output validation.</p></div>
                    <button className="btn btn-primary" onClick={handleAddNode} style={{ borderRadius: '12px' }}>+ Initialize Logframe Item</button>
                  </div>
                  <div className="logframe-grid">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr', gap: '16px', padding: '12px', borderBottom: '1.5px solid #F1F5F9', marginBottom: '12px', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      <span>Indicator Hierachy</span><span>Budget</span><span>Baseline/Target</span><span>Actual</span><span>Variance</span><span>Next Report</span><span>Status</span>
                    </div>
                    {logframeNodes.map(node => (
                      <div key={node.id} className="logframe-row-interactive" onClick={() => setSelectedLognode(node)} style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr', gap: '16px', padding: '16px 12px', borderBottom: '1px solid #F1F5F9', alignItems: 'center', cursor: 'pointer' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span className="node-type-badge">{node.type}</span>
                            <span className={`source-pill source-${node.source.toLowerCase()}`}>{node.source}</span>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4', display: 'block' }}>{node.indicator}</span>
                        </div>
                        <span className="font-numeric" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>{node.budget}</span>
                        <div className="font-numeric" style={{ fontSize: '0.85rem' }}>{node.baseline} ➔ {node.target}</div>
                        <span className="font-numeric" style={{ fontWeight: 800, color: 'var(--primary-blue)' }}>{node.actual}</span>
                        <span className="font-numeric" style={{ color: node.variance.includes('-') ? '#FF3B30' : '#34C759', fontWeight: 700 }}>{node.variance}</span>
                        <span className="font-numeric" style={{ fontSize: '0.8rem', opacity: 0.8 }}>{node.deadline}</span>
                        <span className="lr-status" style={{ background: node.status === 'On Track' ? '#34C75915' : '#FF950015', color: node.status === 'On Track' ? '#34C759' : '#FF9500' }}>{node.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Drawer (Preserved High Fidelity) */}
                {selectedLognode && (
                  <div className="intel-side-drawer-overlay" onClick={() => setSelectedLognode(null)}>
                    <div className="intel-side-drawer" onClick={e => e.stopPropagation()}>
                       <div style={{ padding: '40px 32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Audit: {selectedLognode.indicator}</h2>
                          <button onClick={() => setSelectedLognode(null)} style={{ border: 'none', background: '#F1F5F9', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                          <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '12px' }}><label className="settings-label" style={{ fontSize: '0.6rem' }}>Baseline</label><p className="font-numeric" style={{ margin: 0, fontWeight: 800 }}>{selectedLognode.baseline}</p></div>
                          <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '12px' }}><label className="settings-label" style={{ fontSize: '0.6rem' }}>Target</label><p className="font-numeric" style={{ margin: 0, fontWeight: 800 }}>{selectedLognode.target}</p></div>
                          <div style={{ padding: '12px', background: 'var(--primary-blue)', color: 'white', borderRadius: '12px' }}><label className="settings-label" style={{ fontSize: '0.6rem' }}>Actual</label><p className="font-numeric" style={{ margin: 0, fontWeight: 800 }}>{selectedLognode.actual}</p></div>
                        </div>
                        <div className="settings-form-group"><label className="settings-label">Means of Verification (MoV)</label><textarea className="settings-input" style={{ minHeight: '120px' }} defaultValue={selectedLognode.mov} onBlur={e => handleUpdateNode(selectedLognode.id, 'mov', e.target.value)} /></div>
                        <div className="settings-form-group"><label className="settings-label">Strategic Assumptions</label><textarea className="settings-input" style={{ minHeight: '120px' }} defaultValue={selectedLognode.assumptions} onBlur={e => handleUpdateNode(selectedLognode.id, 'assumptions', e.target.value)} /></div>
                        <button className="btn btn-primary" style={{ width: '100%', height: '54px', borderRadius: '16px', fontWeight: 700 }} onClick={() => setSelectedLognode(null)}>Commit M&E Validation</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}
