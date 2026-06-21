// src/app/portfolio/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_PORTFOLIO } from '@/data/portfolio';
import './portfolio.css';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function PortfolioDashboard() {
  // Filters
  const [phaseFilter, setPhaseFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');
  const [search, setSearch] = useState('');

  const phases = ['All', 'Initiation', 'Planning', 'Execution', 'Monitoring', 'Closing'];
  const managers = ['All', ...Array.from(new Set(MOCK_PORTFOLIO.map(p => p.manager)))];

  const filtered = useMemo(() => {
    return MOCK_PORTFOLIO.filter(p => {
      const phaseMatch = phaseFilter === 'All' || p.phase === phaseFilter;
      const managerMatch = managerFilter === 'All' || p.manager === managerFilter;
      const searchMatch = p.name.toLowerCase().includes(search.toLowerCase());
      return phaseMatch && managerMatch && searchMatch;
    });
  }, [phaseFilter, managerFilter, search]);

  // KPI calculations
  const totalBudget = filtered.reduce((sum, p) => sum + p.budget, 0);
  const totalActual = filtered.reduce((sum, p) => sum + p.actual, 0);
  const healthIndex = totalBudget ? Math.round((totalActual / totalBudget) * 100) : 0;
  const criticalRisks = filtered.filter(p => p.riskLevel === 'High').length;

  // Chart data
  const budgetChartData = {
    labels: filtered.map(p => p.name),
    datasets: [
      {
        label: 'Budget',
        data: filtered.map(p => p.budget),
        backgroundColor: '#018bf1',
      },
    ],
  };

  const timelineData = {
    labels: filtered.map(p => p.name),
    datasets: [
      {
        label: 'Next Milestone',
        data: filtered.map(p => {
          const next = p.milestones[0];
          return next ? new Date(next.date).getTime() : 0;
        }),
        backgroundColor: '#34C759',
      },
    ],
  };

  return (
    <div className="portfolio-container">
      {/* Header */}
      <header className="portfolio-header">
        <div>
          <Link href="/" className="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            BACK TO DASHBOARD
          </Link>
          <h1>Portfolio Overview</h1>
        </div>
        <div className="kpi-row">
          <div className="kpi-card">
            <h3>Portfolio Health</h3>
            <p>{healthIndex}%</p>
          </div>
          <div className="kpi-card">
            <h3>Budget Burn</h3>
            <p>${totalActual.toLocaleString()} / ${totalBudget.toLocaleString()}</p>
          </div>
          <div className="kpi-card">
            <h3>Critical Risks</h3>
            <p>{criticalRisks}</p>
          </div>
        </div>
      </header>

      {/* Alerts */}
      <section className="alerts-panel">
        <h4>Portfolio Alerts</h4>
        <ul>
          {filtered
            .filter(p => p.riskLevel === 'High')
            .map(p => (
              <li key={p.id}>⚠️ {p.name} has a HIGH risk level.</li>
            ))}
        </ul>
      </section>

      {/* Filters */}
      <div className="filters-bar">
        <select value={phaseFilter} onChange={e => setPhaseFilter(e.target.value)}>
          {phases.map(ph => (
            <option key={ph} value={ph}>
              {ph}
            </option>
          ))}
        </select>
        <select value={managerFilter} onChange={e => setManagerFilter(e.target.value)}>
          {managers.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Charts */}
      <div className="chart-wrapper">
        <h3>Budget Distribution</h3>
        <Pie data={budgetChartData} />
      </div>
      <div className="chart-wrapper">
        <h3>Upcoming Milestones (timestamp)</h3>
        <Bar data={timelineData} options={{ scales: { y: { ticks: { callback: value => new Date(value as number).toLocaleDateString() } } } }} />
      </div>

      {/* Project Table */}
      <div className="table-wrapper">
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Manager</th>
              <th>Phase</th>
              <th>Budget</th>
              <th>Actual</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.manager}</td>
                <td>{p.phase}</td>
                <td>${p.budget.toLocaleString()}</td>
                <td>${p.actual.toLocaleString()}</td>
                <td>{p.riskLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
