'use client';

import { useState, useMemo } from 'react';
import './users.css';
import RightSidebar from '@/components/RightSidebar';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────
type UserRole = 'Admin' | 'Project Manager' | 'Senior Designer' | 'Technical Lead' | 'Audit';
type UserStatus = 'Active' | 'Offline' | 'In Meeting' | 'Away';

interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  workload: number; // Percentage
  tasksCount: number;
  joinedDate: string;
  avatarColor: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_TEAM: OrganizationMember[] = [
  { id: 'u1', name: 'Arsene Creatives', email: 'arsene@creatives.com', role: 'Admin', department: 'Leadership', status: 'Active', workload: 45, tasksCount: 12, joinedDate: 'Jan 2024', avatarColor: '#018bf1' },
  { id: 'u2', name: 'Alice Johnson', email: 'alice.j@creatives.com', role: 'Project Manager', department: 'Operations', status: 'In Meeting', workload: 88, tasksCount: 24, joinedDate: 'Feb 2024', avatarColor: '#34C759' },
  { id: 'u3', name: 'Bob Smith', email: 'bob.s@creatives.com', role: 'Senior Designer', department: 'Creative', status: 'Active', workload: 72, tasksCount: 18, joinedDate: 'Mar 2024', avatarColor: '#FF9500' },
  { id: 'u4', name: 'Carol White', email: 'carol.w@creatives.com', role: 'Technical Lead', department: 'Engineering', status: 'Away', workload: 95, tasksCount: 31, joinedDate: 'Jan 2024', avatarColor: '#AF52DE' },
  { id: 'u5', name: 'Dave Wilson', email: 'dave.w@creatives.com', role: 'Audit', department: 'Finance', status: 'Offline', workload: 20, tasksCount: 5, joinedDate: 'Apr 2024', avatarColor: '#FF3B30' },
  { id: 'u6', name: 'Eve Davis', email: 'eve.d@creatives.com', role: 'Senior Designer', department: 'Creative', status: 'Active', workload: 60, tasksCount: 14, joinedDate: 'Feb 2024', avatarColor: '#FF2D55' },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const filteredTeam = useMemo(() => {
    return MOCK_TEAM.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) || 
                           member.email.toLowerCase().includes(search.toLowerCase());
      const matchesDept = filterDept === 'All' || member.department === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [search, filterDept]);

  const departments = ['All', 'Leadership', 'Operations', 'Creative', 'Engineering', 'Finance'];

  return (
    <main className="dashboard-layout">
      <div className="dashboard-main-column">
        <div className="users-page animate-fade-in">
          
          <header className="users-toolbar">
            <div className="users-title-group">
                <h1 className="users-title">Team Management</h1>
                <p className="users-subtitle">Manage organization roles, permissions and workload</p>
            </div>

            <div className="users-actions">
                <div className="users-search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input 
                        type="text" 
                        placeholder="Search members..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="toolbar-btn primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Invite Member
                </button>
            </div>
          </header>

          <nav className="users-filters">
            {departments.map(dept => (
                <button 
                    key={dept} 
                    className={`dept-tab ${filterDept === dept ? 'active' : ''}`}
                    onClick={() => setFilterDept(dept)}
                >
                    {dept}
                </button>
            ))}
          </nav>

          <div className="team-grid">
            {filteredTeam.map(member => (
                <Link href={`/users/${member.id}`} key={member.id} className="member-card">
                    <div className="member-header">
                        <div className="member-avatar" style={{ backgroundColor: member.avatarColor }}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                            <span className={`status-indicator ${member.status.toLowerCase().replace(' ', '-')}`} />
                        </div>
                        <div className="member-meta">
                            <h3 className="member-name">{member.name}</h3>
                            <span className="member-role">{member.role}</span>
                        </div>
                    </div>

                    <div className="member-body">
                        <div className="member-info-row">
                            <span className="info-label">Department</span>
                            <span className="info-val">{member.department}</span>
                        </div>
                        <div className="member-info-row">
                            <span className="info-label">Joined</span>
                            <span className="info-val">{member.joinedDate}</span>
                        </div>
                    </div>

                    <div className="member-workload">
                        <div className="workload-header">
                            <span className="workload-label">Workload</span>
                            <span className="workload-val">{member.workload}%</span>
                        </div>
                        <div className="workload-bar-bg">
                            <div 
                                className={`workload-bar-fill ${member.workload > 85 ? 'overloaded' : ''}`} 
                                style={{ width: `${member.workload}%` }} 
                            />
                        </div>
                        <p className="workload-hint">Managing {member.tasksCount} active tasks</p>
                    </div>

                    <div className="member-footer">
                        <button className="profile-btn">View Profile</button>
                    </div>
                </Link>
            ))}
          </div>

        </div>
      </div>

      <div className="dashboard-right-column">
        <RightSidebar mode="dashboard" />
      </div>
    </main>
  );
}
