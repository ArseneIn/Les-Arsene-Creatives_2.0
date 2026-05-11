'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './settings.css';

type SettingsTab = 'profile' | 'security' | 'preferences' | 'organization';
type OperativeRole = 'Lead Orchestrator' | 'Admin Head' | 'M&E Auditor';

export default function SettingsHub() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [operativeRole, setOperativeRole] = useState<OperativeRole>('Lead Orchestrator');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-content-area animate-slide-up">
            <div className="profile-hero-card">
              <div className="hero-avatar">NF</div>
              <div className="hero-details">
                <h4>Nuru Freddy</h4>
                <p>{operativeRole} — Global Alpha Clearance</p>
                <button className="btn-ghost-sm">Update Profile Image</button>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header">
                <h3>Personal Information</h3>
                <p>Private details and communication channels.</p>
              </div>
              <div className="settings-form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" defaultValue="Nuru Freddy" />
                </div>
                <div className="form-group">
                  <label className="form-label">Active Email</label>
                  <input type="email" className="form-input" defaultValue="nuru.freddy@eprojekt.com" />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Professional Bio (Short)</label>
                  <input type="text" className="form-input" defaultValue="Directing the E-PROJEKT Nexus with high-fidelity orchestration." />
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header">
                <h3>Regional Data</h3>
                <p>Configure your locale and timezone nodes.</p>
              </div>
              <div className="settings-form-grid">
                <div className="form-group">
                  <label className="form-label">Primary Timezone</label>
                  <input type="text" className="form-input" defaultValue="Africa/Lagos (GMT+1)" />
                </div>
                <div className="form-group">
                  <label className="form-label">Language Node</label>
                  <input type="text" className="form-input" defaultValue="English (UK)" />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="settings-content-area animate-slide-up">
            <div className="settings-card">
              <div className="card-header">
                <h3>Administrative Roles</h3>
                <p>Switch between operational clearances to adapt the console.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '8px' }}>
                {(['Lead Orchestrator', 'Admin Head', 'M&E Auditor'] as OperativeRole[]).map(role => (
                  <button 
                    key={role} 
                    className={`btn-ghost-sm ${operativeRole === role ? 'active-role' : ''}`} 
                    onClick={() => setOperativeRole(role)}
                    style={{ 
                      padding: '16px', 
                      height: 'auto', 
                      textAlign: 'left', 
                      borderColor: operativeRole === role ? 'var(--primary-blue)' : '#E2E8F0',
                      background: operativeRole === role ? 'rgba(1, 139, 241, 0.03)' : 'transparent'
                    }}
                  >
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>OPERATIVE</span>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{role}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header">
                <h3>Authentication Ciphers</h3>
                <p>Safeguard your project access with secure credentials.</p>
              </div>
              <div className="settings-form-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Current Strategic PIN</label>
                  <input type="password" placeholder="••••" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">New PIN</label>
                  <input type="password" placeholder="••••" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New PIN</label>
                  <input type="password" placeholder="••••" className="form-input" />
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '24px', height: '48px', width: '200px', borderRadius: '12px' }}>Update Security</button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="settings-content-area animate-slide-up">
            <div className="settings-card">
              <div className="card-header">
                <h3>Interface Preferences</h3>
                <p>Manage how information is visualized across your viewport.</p>
              </div>
              
              <div className="setting-toggle-row">
                <div className="toggle-info">
                  <h5>High-Density Mode</h5>
                  <p>Increase data throughput across orchestration layers.</p>
                </div>
                <label className="ui-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="ui-slider"></span>
                </label>
              </div>

              <div className="setting-toggle-row">
                <div className="toggle-info">
                  <h5>Collaborative Shimmer</h5>
                  <p>Show live team presence in task nodes and M&E ledger.</p>
                </div>
                <label className="ui-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="ui-slider"></span>
                </label>
              </div>

              <div className="setting-toggle-row" style={{ border: 'none' }}>
                <div className="toggle-info">
                  <h5>Protocol Alerts (Email)</h5>
                  <p>Receive summaries of next-day milestones.</p>
                </div>
                <label className="ui-switch">
                  <input type="checkbox" />
                  <span className="ui-slider"></span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'organization':
        return (
          <div className="settings-content-area animate-slide-up">
            <div className="settings-card">
              <div className="card-header">
                <h3>Global Asset Parent</h3>
                <p>Parent organization details and global hierarchies.</p>
              </div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '48px', height: '48px', background: '#334155', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontWeight: 800 }}>SL</div>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontWeight: 800 }}>Smart Logistics Corp</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Authority Node: Lagos-Cluster-Main</p>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header">
                <h3>Assigned Thresholds</h3>
                <p>Administrative and financial approval constraints.</p>
              </div>
              <div className="settings-form-grid">
                <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Spend Authority</label>
                  <p className="font-numeric" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>$500,000</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#34C759', fontWeight: 700 }}>VERIFIED CLEARANCE</p>
                </div>
                <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Stakeholder Access</label>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Global</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 700 }}>PRIMARY ORCHESTRATOR</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-container animate-fade-in">
      <header className="settings-master-header">
        <div className="header-left">
          <Link href="/" className="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            BACK TO DASHBOARD
          </Link>
          <h1>Account Settings</h1>
        </div>
        <div className="header-right">
          <div className="uptime-box">
            <p style={{ margin: '0 0 4px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>UPTIME NODE</p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>12:44:02 PM</p>
          </div>
        </div>
      </header>

      <div className="settings-main-layout">
        <aside className="settings-nav-rail">
          <button className={`nav-rail-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <span style={{ fontSize: '1.2rem' }}>👤</span> User Profile
          </button>
          <button className={`nav-rail-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <span style={{ fontSize: '1.2rem' }}>🛡️</span> Roles & Permissions
          </button>
          <button className={`nav-rail-item ${activeTab === 'preferences' ? 'active' : ''}`} onClick={() => setActiveTab('preferences')}>
            <span style={{ fontSize: '1.2rem' }}>⚙️</span> Preferences
          </button>
          <button className={`nav-rail-item ${activeTab === 'organization' ? 'active' : ''}`} onClick={() => setActiveTab('organization')}>
            <span style={{ fontSize: '1.2rem' }}>🏢</span> Organization
          </button>
        </aside>

        <main className="settings-workspace">
           {renderContent()}
        </main>
      </div>
    </div>
  );
}
