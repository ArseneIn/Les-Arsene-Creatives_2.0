'use client';

import { useParams } from 'next/navigation';
import '../users.css';
import RightSidebar from '@/components/RightSidebar';

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
            <div className="profile-cover" style={{ backgroundColor: user.avatarColor + '15' }}>
              <div className="cover-pattern" />
              <div className="cover-gradient" />
            </div>
            <div className="profile-identity">
                <div className="profile-avatar-lg" style={{ backgroundColor: user.avatarColor }}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                    <div className={`status-indicator-lg ${user.status.toLowerCase().replace(' ', '-')}`}>
                      <div className="status-ping" />
                    </div>
                </div>
                <div className="profile-info-main">
                    <h1 className="profile-name">{user.name}</h1>
                    <div className="profile-meta-row">
                        <span className="profile-role-badge-cool">{user.role.toUpperCase()}</span>
                        <div className="meta-divider" />
                        <span className="profile-dept-cool">{user.department}</span>
                        <div className="meta-divider" />
                        <span className="profile-email-cool text-link">{user.email}</span>
                    </div>
                </div>
                <div className="profile-actions-top">
                    <button className="btn btn-outline btn-profile">Edit Profile</button>
                    <button className="btn btn-primary btn-profile">Message</button>
                </div>
            </div>
          </header>

          <div className="profile-grid-container">
            <div className="profile-left-col">
                <section className="profile-section card">
                    <div className="p-section-header">
                        <h2 className="section-title">About</h2>
                    </div>
                    <div className="bio-container">
                        <p className="profile-bio">{user.bio}</p>
                    </div>
                    <div className="stats-accent-row">
                        <div className="p-stat">
                            <span className="p-stat-val font-numeric">124</span>
                            <span className="p-stat-label">Tasks Finished</span>
                        </div>
                        <div className="p-stat">
                            <span className="p-stat-val font-numeric">98%</span>
                            <span className="p-stat-label">On-time Delivery</span>
                        </div>
                        <div className="p-stat">
                            <span className="p-stat-val font-numeric">4.9</span>
                            <span className="p-stat-label">Rating</span>
                        </div>
                    </div>
                </section>

                <section className="profile-section card">
                    <div className="section-header-row">
                        <h2 className="section-title">Assigned Projects</h2>
                        <button className="view-all-premium">
                            View All
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
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
                                <div className="pc-progress-wrapper">
                                    <div className="pc-progress-bar">
                                        <div className="pc-progress-fill" style={{ width: `${proj.progress}%`, background: proj.color }} />
                                    </div>
                                    <span className="pc-val font-numeric">{proj.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="profile-right-col">
                <section className="profile-section card">
                    <h2 className="section-title">Monthly Capacity</h2>
                    <div className="capacity-chart-container">
                        <div className="cap-bar-group">
                            {[
                                { m: 'Feb', h: 60, a: false },
                                { m: 'Mar', h: 85, a: false },
                                { m: 'Apr', h: user.workload, a: true },
                                { m: 'May', h: 40, a: false }
                            ].map(b => (
                                <div key={b.m} className="cap-bar-col">
                                    <div className={`cap-bar ${b.a ? 'active' : ''}`} style={{ height: `${b.h}%` }} />
                                    <span className={`cap-label ${b.a ? 'active' : ''}`}>{b.m}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="cap-hint">Current workload of <strong className="font-numeric">{user.workload}%</strong> is considered <span className={user.workload > 85 ? 'text-red' : 'text-green'}>{user.workload > 85 ? 'High' : 'Optimal'}</span>.</p>
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
        .profile-header { padding: 0; overflow: hidden; position: relative; margin-bottom: 24px; border-radius: 28px; border: 1px solid var(--border-color); background: white; }
        .profile-cover { height: 160px; width: 100%; position: relative; overflow: hidden; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .cover-pattern { position: absolute; inset: 0; background-image: radial-gradient(var(--border-color) 1px, transparent 1px); background-size: 24px 24px; opacity: 0.2; }
        .cover-gradient { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.4)); }
        
        .profile-identity { padding: 0 40px 40px; display: flex; align-items: flex-end; gap: 32px; margin-top: -60px; position: relative; width: calc(100% - 80px); }
        
        .profile-avatar-lg { width: 140px; height: 140px; border-radius: 36px; border: 8px solid white; display: flex; align-items: center; justify-content: center; font-size: 2.75rem; font-weight: 800; color: white; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.15); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); flex-shrink: 0; }
        .profile-avatar-lg:hover { transform: scale(1.02); }
        
        .status-indicator-lg { position: absolute; bottom: 8px; right: 8px; width: 22px; height: 22px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status-ping { position: absolute; inset: -4px; border-radius: 50%; background: inherit; opacity: 0.4; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes ping { 75%, 100% { transform: scale(2.5); opacity: 0; } }

        .profile-info-main { flex: 1; min-width: 0; }
        .profile-name { font-size: 2.5rem; font-weight: 800; color: #0F172A; margin-bottom: 10px; letter-spacing: -0.03em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .profile-meta-row { display: flex; align-items: center; gap: 16px; margin-top: 4px; flex-wrap: wrap; }
        .meta-divider { width: 1px; height: 16px; background: #E2E8F0; flex-shrink: 0; }
        
        .profile-role-badge-cool { background: #F1F5F9; color: #475569; padding: 6px 16px; border-radius: 12px; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.05em; border: 1px solid rgba(0,0,0,0.03); white-space: nowrap; }
        .profile-dept-cool { font-size: 0.95rem; font-weight: 500; color: #64748B; white-space: nowrap; }
        .profile-email-cool { font-size: 0.95rem; font-weight: 500; color: var(--primary-blue); cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
        .text-link:hover { text-decoration: underline; }
        
        .profile-actions-top { display: flex; gap: 16px; padding-bottom: 12px; flex-shrink: 0; }
        .btn-profile { padding: 12px 24px; min-width: 140px; }

        .profile-grid-container { display: grid; grid-template-columns: 1.15fr 340px; gap: 24px; }
        .profile-section { padding: 32px; border-radius: 28px; background: white; border: 1px solid var(--border-color); margin-bottom: 20px; }
        .section-title { font-size: 1.1rem; font-weight: 700; color: #0F172A; text-transform: none; }
        
        .p-section-header { margin-bottom: 12px; }
        .bio-container { border-left: 3px solid var(--primary-blue); padding-left: 20px; margin: 8px 0 24px 0; }
        .profile-bio { font-size: 0.95rem; line-height: 1.65; color: #475569; margin: 0; }
        
        .stats-accent-row { display: flex; justify-content: space-between; padding: 24px; background: #F8FAFC; border-radius: 20px; border: 1px solid rgba(0,0,0,0.02); }
        .p-stat { display: flex; flex-direction: column; gap: 4px; }
        .p-stat-val { font-size: 1.85rem; font-weight: 800; color: #0F172A; letter-spacing: -0.03em; }
        .p-stat-label { font-size: 0.75rem; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .section-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        
        .view-all-premium {
            background: #F1F5F9;
            color: var(--primary-blue);
            border: none;
            padding: 8px 16px;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .view-all-premium:hover {
            background: #E0F2FE;
            gap: 10px;
            transform: translateY(-1px);
        }

        .view-all-premium svg {
            transition: transform 0.2s ease;
        }
        
        .project-list-compact { display: flex; flex-direction: column; gap: 12px; }
        .project-compact-card { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: #F8FAFC; border-radius: 18px; border: 1px solid transparent; transition: all 0.2s ease; }
        .project-compact-card:hover { background: white; border-color: var(--border-color); transform: translateX(4px); box-shadow: 0 4px 15px rgba(0,0,0,0.04); }
        
        .pc-info { display: flex; align-items: center; gap: 16px; }
        .pc-dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 0 4px rgba(0,0,0,0.02); }
        .pc-text { display: flex; flex-direction: column; }
        .pc-name { font-size: 0.95rem; font-weight: 600; color: #0F172A; }
        .pc-role { font-size: 0.8rem; color: #64748B; }
        
        .pc-progress-wrapper { display: flex; align-items: center; gap: 20px; width: 180px; }
        .pc-progress-bar { height: 8px; background: #E2E8F0; border-radius: 99px; flex: 1; overflow: hidden; border: 1px solid rgba(0,0,0,0.01); }
        .pc-progress-fill { height: 100%; border-radius: 99px; }
        .pc-val { font-size: 0.85rem; font-weight: 700; color: #0F172A; min-width: 40px; text-align: right; }
        
        .capacity-chart-container { margin: 16px 0 24px 0; padding: 24px; background: #F8FAFC; border-radius: 24px; border: 1px solid rgba(0,0,0,0.01); }
        .cap-bar-group { display: flex; align-items: flex-end; justify-content: space-around; height: 110px; }
        .cap-bar-col { display: flex; flex-direction: column; align-items: center; gap: 14px; height: 100%; justify-content: flex-end; }
        .cap-bar { width: 44px; background: #E2E8F0; border-radius: 12px 12px 4px 4px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .cap-bar.active { background: linear-gradient(180deg, #018bf1 0%, #0070E0 100%); box-shadow: 0 8px 20px rgba(1, 139, 241, 0.25); border: 2px solid white; }
        .cap-label { font-size: 0.8rem; font-weight: 600; color: #94A3B8; }
        .cap-label.active { color: var(--primary-blue); font-weight: 800; }
        
        .cap-hint { font-size: 0.95rem; color: #475569; margin: 0; text-align: center; }
        .text-red { color: var(--danger-red); font-weight: 800; }
        .text-green { color: var(--success-green); font-weight: 800; }
        
        .profile-activity-feed { display: flex; flex-direction: column; gap: 20px; }
        .p-activity-item { display: flex; gap: 16px; padding: 4px 0; }
        .p-act-dot { width: 10px; height: 10px; background: #018bf1; border-radius: 50%; margin-top: 6px; flex-shrink: 0; box-shadow: 0 0 0 4px rgba(1, 139, 241, 0.12); border: 2px solid white; }
        .p-act-msg { font-size: 0.9rem; line-height: 1.55; color: #334155; margin: 0; }
        .p-act-time { font-size: 0.8rem; font-weight: 500; color: #94A3B8; margin-top: 2px; display: block; }
        
        .status-indicator-lg.active { background: var(--success-green); }
        .status-indicator-lg.away { background: var(--warning-yellow); }
      `}</style>
    </main>
  );
}
