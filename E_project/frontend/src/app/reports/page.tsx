'use client';

import React, { useState } from 'react';
import './reports.css';
import '../page.css'; // Reuse common dashboard styles
import { LineChart, BarChart, DonutChart } from '@/components/Charts';
import { useProject } from '@/context/ProjectContext';
import RightSidebar from '@/components/RightSidebar';

// ── Mock Data ──────────────────────────────────────────────────────────────
const PERFORMANCE_DATA = [12, 19, 15, 25, 22, 30, 28];
const PERFORMANCE_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const RESOURCE_DATA = [
  { label: 'Alice', value: 85, color: '#018bf1' },
  { label: 'Bob', value: 60, color: '#34C759' },
  { label: 'Carol', value: 95, color: '#FF9500' },
  { label: 'Dave', value: 40, color: '#AF52DE' },
  { label: 'Eve', value: 75, color: '#FF3B30' },
];

const DONUT_DATA = [
  { label: 'Done', value: 45, color: '#34C759' },
  { label: 'In Progress', value: 25, color: '#FF9500' },
  { label: 'Under Review', value: 15, color: '#AF52DE' },
  { label: 'Todo', value: 15, color: '#018bf1' },
];

const BUDGET_DATA = [
  { category: 'Development', planned: '$15,000', actual: '$12,400', variance: '+17.3%', status: 'Under' },
  { category: 'Design', planned: '$5,000', actual: '$5,200', variance: '-4.0%', status: 'Over' },
  { category: 'Marketing', planned: '$8,000', actual: '$7,100', variance: '+11.2%', status: 'Under' },
  { category: 'Infrastructure', planned: '$3,000', actual: '$3,450', variance: '-15.0%', status: 'Over' },
];

export default function ReportsPage() {
  const { selectedProject } = useProject();
  const [view, setView] = useState<'performance' | 'resources' | 'financials'>('performance');

  return (
    <div className="dashboard-layout animate-fade-in">
      <div className="dashboard-main-column">
        {!selectedProject ? (
          <div className="reports-empty-state">
            <div className="empty-state-card card">
              <div className="empty-icon-wrapper">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="1.5"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
              </div>
              <h2 className="empty-state-title">No Project Selected</h2>
              <p className="empty-state-text">Please select a project from the header to view its analytics and performance reports.</p>
              <div className="empty-state-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
                Select a project above
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ── KPI Row ── */}
            <section className="kpi-outer-wrapper card">
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <div className="kpi-icon-group">
                      <div className="kpi-icon blue-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
                      </div>
                      <span className="kpi-title">Avg. Velocity</span>
                    </div>
                    <span className="kpi-value">24.5</span>
                  </div>
                  <div className="kpi-card-body">
                    <div className="trend-indicator trend-up">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                      +12% vs last week
                    </div>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <div className="kpi-icon green-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <span className="kpi-title">On-Time Delivery</span>
                  </div>
                  <div className="kpi-card-body mt-auto">
                    <span className="kpi-value-lg">92%</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-card-header">
                    <div className="kpi-icon dark-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </div>
                    <span className="kpi-title">Build Success</span>
                  </div>
                  <div className="kpi-card-body mt-auto">
                    <span className="kpi-value-lg">98.4%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── View Switcher ── */}
            <div className="view-switcher-row">
              <div className="schedule-toggle">
                <div className={`toggle-btn ${view === 'performance' ? 'active' : ''}`} onClick={() => setView('performance')}>Performance</div>
                <div className={`toggle-btn ${view === 'resources' ? 'active' : ''}`} onClick={() => setView('resources')}>Resources</div>
                <div className={`toggle-btn ${view === 'financials' ? 'active' : ''}`} onClick={() => setView('financials')}>Financials</div>
              </div>
            </div>

            {/* Main Content Views */}
            {view === 'performance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <section className="reports-section card">
                  <div className="section-header">
                    <h2 className="section-title">Weekly Burnchart</h2>
                  </div>
                  <LineChart data={PERFORMANCE_DATA} labels={PERFORMANCE_LABELS} />
                </section>
                <section className="reports-section card">
                  <div className="section-header">
                    <h2 className="section-title">Task Status Distribution</h2>
                  </div>
                  <DonutChart data={DONUT_DATA} />
                </section>
              </div>
            )}

            {view === 'resources' && (
              <section className="reports-section card">
                <div className="section-header">
                  <h2 className="section-title">Team Capacity Allocation</h2>
                </div>
                <BarChart data={RESOURCE_DATA} />
                <div style={{ marginTop: '30px' }}>
                  <div className="ds-label" style={{ marginBottom: '15px' }}>Member Availability Grid</div>
                  <div className="heatmap-grid">
                    {RESOURCE_DATA.map(user => (
                      <div key={user.label} className="heatmap-row">
                        <span className="heatmap-label">{user.label}</span>
                        <div className="heatmap-cells">
                          {[1, 1, 1, 0.8, 1, 0.5, 0.2].map((v, i) => (
                            <div 
                              key={i} 
                              className="heatmap-cell" 
                              style={{ background: v > 0.8 ? '#34C759' : v > 0.4 ? '#FF9500' : '#FF3B30', opacity: v }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {view === 'financials' && (
              <section className="reports-section card" style={{ padding: 0 }}>
                <div className="section-header" style={{ padding: '20px 20px 0 20px' }}>
                  <h2 className="section-title">Budget Utilization Summary</h2>
                </div>
                <table className="report-table" style={{ marginTop: '15px' }}>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Planned</th>
                      <th>Actual</th>
                      <th>Variance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BUDGET_DATA.map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{row.category}</td>
                        <td>{row.planned}</td>
                        <td>{row.actual}</td>
                        <td style={{ color: row.variance.startsWith('+') ? '#34C759' : '#FF3B30' }}>{row.variance}</td>
                        <td>
                          <span 
                            className="lr-status" 
                            style={{ 
                              background: row.status === 'Under' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                              color: row.status === 'Under' ? '#34C759' : '#FF3B30'
                            }}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </>
        )}
      </div>

      <RightSidebar mode="reports" />
    </div>
  );
}
