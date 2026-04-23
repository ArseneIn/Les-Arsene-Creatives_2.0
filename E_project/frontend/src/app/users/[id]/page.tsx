'use client';

import { useParams } from 'next/navigation';
import '../users.css';
import RightSidebar from '@/components/RightSidebar';
import Link from 'next/link';

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_TEAM = [
  { id: 'u1', name: 'Arsene Creatives', email: 'arsene@creatives.com', role: 'Admin', department: 'Leadership', status: 'Active', workload: 45, tasksCount: 12, joinedDate: 'Jan 2024', avatarColor: '#018bf1', bio: 'Founding member and Principal Creative. Leading organization strategy and vision.' },
  { id: 'u4', name: 'Carol White', email: 'carol.w@creatives.com', role: 'Technical Lead', department: 'Engineering', status: 'Away', workload: 95, tasksCount: 31, joinedDate: 'Jan 2024', avatarColor: '#AF52DE', bio: 'Technical architect and lead developer. Managing high-scale cloud infrastructure.' },
];

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const user = MOCK_TEAM.find(u => u.id === userId) || MOCK_TEAM[0];

  return (
    <main className="dashboard-layout">
      <div className="dashboard-main-column">
        <div className="user-profile-page animate-fade-in">
          
          <header className="profile-header card">
            <div className="profile-cover" style={{ backgroundColor: user.avatarColor + '22' }} />
            <div className="profile-identity">
                <div className="profile-avatar-lg" style={{ backgroundColor: user.avatarColor }}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                    <span className={`status-indicator-lg ${user.status.toLowerCase().replace(' ', '-')}`} />
                </div>
                <div className="profile-info-main">
                    <h1 className="profile-name">{user.name}</h1>
                    <div className="profile-meta-row">
                        <span className="profile-role-badge">{user.role}</span>
                        <span className="meta-sep">•</span>
                        <span className="profile-dept">{user.department}</span>
                        <span className="meta-sep">•</span>
                        <span className="profile-email">{user.email}</span>
                    </div>
                </div>
                <div className="profile-actions-top">
                    <button className="toolbar-btn">Edit Profile</button>
                    <button className="toolbar-btn primary">Message</button>
                </div>
            </div>
          </header>

          <div className="profile-grid-container">
            <div className="profile-left-col">
                <section className="profile-section card">
                    <h2 className="section-title">About</h2>
                    <p className="profile-bio">{user.bio}</p>
                    <div className="stats-horizontal">
                        <div className="p-stat">
                            <span className="p-stat-val">124</span>
                            <span className="p-stat-label">Tasks Finished</span>
                        </div>
                        <div className="p-stat">
                            <span className="p-stat-val">98%</span>
                            <span className="p-stat-label">On-time Delivery</span>
                        </div>
                        <div className="p-stat">
                            <span className="p-stat-val">4.9</span>
                            <span className="p-stat-label">Rating</span>
                        </div>
                    </div>
                </section>

                <section className="profile-section card">
                    <div className="section-header">
                        <h2 className="section-title">Assigned Projects</h2>
                        <button className="text-action-link">View All</button>
                    </div>
                    <div className="project-list-compact">
                        {[
                            { name: 'Acme Brand System', role: 'Lead', progress: 75, color: '#018bf1' },
                            { name: 'Global Tech Scaffold', role: 'Architect', progress: 40, color: '#AF52DE' },
                            { name: 'Marketing Deck Q3', role: 'Collaborator', progress: 90, color: '#FF9500' }
                        ].map(proj => (
                            <div key={proj.name} className="project-compact-card">
                                <div className="pc-info">
                                    <span className="pc-dot" style={{ background: proj.color }} />
                                    <div className="pc-text">
                                        <span className="pc-name">{proj.name}</span>
                                        <span className="pc-role">{proj.role}</span>
                                    </div>
                                </div>
                                <div className="pc-progress">
                                    <div className="pc-progress-bar">
                                        <div className="pc-progress-fill" style={{ width: `${proj.progress}%`, background: proj.color }} />
                                    </div>
                                    <span className="pc-val">{proj.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="profile-right-col">
                <section className="profile-section card">
                    <h2 className="section-title">Monthly Capacity</h2>
                    <div className="capacity-chart-placeholder">
                        <div className="cap-bar-group">
                            <div className="cap-bar" style={{ height: '60%' }} />
                            <div className="cap-bar" style={{ height: '85%' }} />
                            <div className="cap-bar active" style={{ height: `${user.workload}%` }} />
                            <div className="cap-bar" style={{ height: '40%' }} />
                        </div>
                        <div className="cap-labels">
                            <span>Feb</span><span>Mar</span><span className="active">Apr</span><span>May</span>
                        </div>
                    </div>
                    <p className="cap-hint">Current workload of {user.workload}% is considered {user.workload > 85 ? 'High' : 'Optimal'}.</p>
                </section>

                <section className="profile-section card">
                    <h2 className="section-title">Recent Activity</h2>
                    <div className="profile-activity-feed">
                        {[
                            { action: 'Completed task', task: 'Brand identity design system', time: '2h ago' },
                            { action: 'Commented on', task: 'Q2 Project Proposal', time: '5h ago' },
                            { action: 'Merged PR', task: 'auth-flow-logic', time: 'Yesterday' }
                        ].map((act, i) => (
                            <div key={i} className="p-activity-item">
                                <span className="p-act-dot" />
                                <div className="p-act-text">
                                    <p className="p-act-msg"><strong>{act.action}</strong>: {act.task}</p>
                                    <span className="p-act-time">{act.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
          </div>

        </div>
      </div>

      <div className="dashboard-right-column">
        <RightSidebar mode="dashboard" />
      </div>

      <style jsx>{`
        .profile-header { padding: 0; overflow: hidden; position: relative; margin-bottom: 24px; }
        .profile-cover { height: 120px; width: 100%; border-bottom: 1px solid var(--border-color); }
        .profile-identity { padding: 0 32px 32px; display: flex; align-items: flex-end; gap: 24px; margin-top: -40px; position: relative; }
        .profile-avatar-lg { width: 100px; height: 100px; border-radius: 24px; border: 4px solid white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: white; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .status-indicator-lg { position: absolute; bottom: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; border: 4px solid white; }
        .profile-name { font-size: 2rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
        .profile-meta-row { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; color: var(--text-muted); }
        .profile-role-badge { background: #F1F5F9; color: var(--text-main); padding: 4px 12px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; }
        .profile-actions-top { margin-left: auto; display: flex; gap: 12px; padding-bottom: 8px; }
        .profile-grid-container { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        .profile-section { padding: 24px; display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; }
        .stats-horizontal { display: flex; justify-content: space-between; padding: 20px 0; border-top: 1px solid #F1F5F9; margin-top: 10px; }
        .p-stat { display: flex; flex-direction: column; gap: 4px; }
        .p-stat-val { font-size: 1.5rem; font-weight: 700; color: var(--text-main); }
        .p-stat-label { font-size: 0.8rem; color: var(--text-muted); }
        .project-list-compact { display: flex; flex-direction: column; gap: 12px; }
        .project-compact-card { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #F8FAFC; border-radius: 12px; }
        .pc-info { display: flex; align-items: center; gap: 12px; }
        .pc-dot { width: 8px; height: 8px; border-radius: 50%; }
        .pc-text { display: flex; flex-direction: column; }
        .pc-name { font-size: 0.9rem; font-weight: 600; color: var(--text-main); }
        .pc-role { font-size: 0.75rem; color: var(--text-muted); }
        .pc-progress { display: flex; align-items: center; gap: 12px; width: 120px; }
        .pc-progress-bar { height: 4px; background: #E2E8F0; border-radius: 99px; flex: 1; overflow: hidden; }
        .pc-progress-fill { height: 100%; transition: width 0.4s; }
        .pc-val { font-size: 0.75rem; font-weight: 600; color: var(--text-main); width: 24px; }
        .capacity-chart-placeholder { height: 120px; display: flex; flex-direction: column; justify-content: flex-end; gap: 12px; margin: 20px 0; }
        .cap-bar-group { display: flex; align-items: flex-end; justify-content: space-between; height: 80px; padding: 0 10px; }
        .cap-bar { width: 32px; background: #E2E8F0; border-radius: 6px; transition: all 0.3s; }
        .cap-bar.active { background: var(--primary-blue); }
        .cap-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); padding: 0 8px; }
        .cap-labels .active { color: var(--primary-blue); font-weight: 700; }
        .profile-activity-feed { display: flex; flex-direction: column; gap: 16px; }
        .p-activity-item { display: flex; gap: 12px; }
        .p-act-dot { width: 6px; height: 6px; background: var(--primary-blue); border-radius: 50%; margin-top: 8px; flex-shrink: 0; }
        .p-act-msg { font-size: 0.85rem; line-height: 1.4; color: var(--text-main); margin: 0; }
        .p-act-time { font-size: 0.75rem; color: var(--text-muted); }
        .status-indicator-lg.active { background: var(--success-green); }
        .status-indicator-lg.away { background: var(--warning-yellow); }
      `}</style>
    </main>
  );
}
