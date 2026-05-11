'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const { startTransition } = useLoading();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition();
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <div className="login-page">
      {/* Left side: The Branding Monolith */}
      <div className="login-side-main">
        <div className="main-side-content">
          <div className="main-side-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L20 6V18L12 22L4 18V6L12 2Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M12 22V12M12 12L20 6M12 12L4 6" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="main-side-title">
            E-Project <span>System</span>
          </h1>
          <p className="main-side-desc">
            The definitive digital orchestration engine. 
            Synthesizing Rwandan cultural heritage with precision project 
            intelligence through a unified administrative core.
          </p>

          <div className="main-side-stats">
            <div className="m-stat">
              <span className="m-stat-val">100%</span>
              <span className="m-stat-lbl">Uptime</span>
            </div>
            <div className="m-stat">
              <span className="m-stat-val">2.4k</span>
              <span className="m-stat-lbl">Nodes</span>
            </div>
            <div className="m-stat">
              <span className="m-stat-val">Global</span>
              <span className="m-stat-lbl">Reach</span>
            </div>
          </div>
        </div>

        <div className="security-ledger">
          <div className="ledger-dot" />
          System Active: Identity Verification Required
        </div>
      </div>

      {/* Right side: The Form Terminal */}
      <div className="login-side-form">
        <div className="form-wrapper">
          <div className="form-header">
            <h2 className="form-title">Identity Validation</h2>
            <p className="form-subtitle">Enter your credentials to access the workspace.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Access Email</label>
              <input 
                type="email" 
                className="login-input" 
                placeholder="name@arsene.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Security Key</label>
              <input 
                type="password" 
                className="login-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" style={{ marginRight: '8px' }} />
                Stay Linked
              </label>
              <a href="#" className="forgot-link">Lost Access?</a>
            </div>

            <div className="submit-area">
              <button type="submit" className="btn btn-primary btn-auth">
                VALIDATE IDENTITY
              </button>
            </div>
          </form>

          <p className="signup-prompt">
            Need an operative account? <a href="#" className="signup-link">Request Access</a>
          </p>
        </div>
      </div>
    </div>
  );
}
