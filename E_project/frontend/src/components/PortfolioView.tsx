'use client';

import React, { useEffect, useRef } from 'react';
import { MOCK_PORTFOLIO } from '@/data/portfolio';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function PortfolioView() {
  const totalBudget   = MOCK_PORTFOLIO.reduce((s, p) => s + p.budget, 0);
  const totalActual   = MOCK_PORTFOLIO.reduce((s, p) => s + p.actual, 0);
  const burnPct       = totalBudget ? Math.round((totalActual / totalBudget) * 100) : 0;
  const activeCount   = MOCK_PORTFOLIO.filter(p => p.status === 'Active').length;
  const criticalCount = MOCK_PORTFOLIO.filter(p => p.riskLevel === 'Critical' || p.riskLevel === 'High').length;
  const avgSPI        = (MOCK_PORTFOLIO.reduce((s, p) => s + p.spi, 0) / MOCK_PORTFOLIO.length).toFixed(2);
  const tasksTotal    = MOCK_PORTFOLIO.reduce((s, p) => s + p.tasksTotal, 0);
  const tasksDone     = MOCK_PORTFOLIO.reduce((s, p) => s + p.tasksCompleted, 0);
  const allMilestones = MOCK_PORTFOLIO.flatMap(p =>
    p.milestones
      .filter(m => m.status !== 'Completed')
      .map(m => ({ ...m, project: p.name }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

  const rc = (r: string) =>
    r === 'Critical' ? '#FF3B30' : r === 'High' ? '#FF9500' : r === 'Medium' ? '#F59E0B' : '#34C759';
  const pc = (ph: string) =>
    ph === 'Execution' ? '#018bf1' : ph === 'Planning' ? '#AF52DE' : ph === 'Initiation' ? '#FF9500' : ph === 'Monitoring' ? '#34C759' : '#64748B';
  const mc = (s: string) =>
    s === 'On Track' ? '#34C759' : s === 'At Risk' ? '#FF9500' : s === 'Delayed' ? '#FF3B30' : '#018bf1';
  const daysUntil  = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  const trendIcon  = (t: string) => t === 'up' ? '↑' : t === 'down' ? '↓' : '→';
  const trendColor = (t: string) => t === 'up' ? '#34C759' : t === 'down' ? '#FF3B30' : '#94A3B8';

  const kpis = [
    { label: 'Active Projects',  value: String(activeCount),                     sub: `of ${MOCK_PORTFOLIO.length} total`,         icon: '◈', color: '#018bf1' },
    { label: 'Portfolio Budget', value: `$${(totalBudget/1000).toFixed(0)}K`,    sub: `$${(totalActual/1000).toFixed(0)}K spent`,  icon: '◎', color: '#34C759' },
    { label: 'Budget Burn',      value: `${burnPct}%`,                           sub: burnPct > 80 ? 'Over-budget watch' : 'Healthy pace', icon: '◉', color: burnPct > 80 ? '#FF3B30' : '#018bf1' },
    { label: 'Avg SPI',          value: avgSPI,                                  sub: Number(avgSPI) >= 1 ? 'Ahead of schedule' : 'Delay risk', icon: '⊕', color: Number(avgSPI) >= 1 ? '#34C759' : '#FF9500' },
    { label: 'Tasks Done',       value: `${tasksDone}/${tasksTotal}`,            sub: `${Math.round((tasksDone/tasksTotal)*100)}% overall`, icon: '◐', color: '#AF52DE' },
    { label: 'Issues & Risks',   value: String(criticalCount),                   sub: 'projects need attention',                  icon: '⊘', color: criticalCount > 0 ? '#FF3B30' : '#34C759' },
  ];

  const sectorColors: Record<string, string> = {
    Technology: '#018bf1', Finance: '#34C759', Government: '#AF52DE', Culture: '#FF9500', Health: '#FF3B30',
  };

  // ── CHART DATA ──────────────────────────────────────────────────────
  const projectColors = ['#018bf1', '#34C759', '#AF52DE', '#FF9500', '#FF3B30'];

  const doughnutData = {
    labels: MOCK_PORTFOLIO.map(p => p.name),
    datasets: [{
      data: MOCK_PORTFOLIO.map(p => p.budget),
      backgroundColor: projectColors.map(c => c + 'CC'),
      borderColor: projectColors,
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 12,
          font: { size: 11, weight: 700 as const },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` $${(ctx.raw as number / 1000).toFixed(0)}K budget`,
        },
      },
    },
  };

  const barData = {
    labels: MOCK_PORTFOLIO.map(p => p.name.split(' ').slice(0, 2).join(' ')),
    datasets: [
      {
        label: 'Completion %',
        data: MOCK_PORTFOLIO.map(p => p.completion),
        backgroundColor: MOCK_PORTFOLIO.map(p =>
          p.completion >= 80 ? '#34C75999' : p.completion >= 50 ? '#018bf199' : '#FF950099'
        ),
        borderColor: MOCK_PORTFOLIO.map(p =>
          p.completion >= 80 ? '#34C759' : p.completion >= 50 ? '#018bf1' : '#FF9500'
        ),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Budget Burn %',
        data: MOCK_PORTFOLIO.map(p => Math.min(100, Math.round((p.actual / p.budget) * 100))),
        backgroundColor: '#64748B33',
        borderColor: '#64748B',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { size: 11, weight: 700 as const }, usePointStyle: true },
      },
      title: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (v: any) => `${v}%`,
          font: { size: 11 },
          color: '#94A3B8',
        },
        grid: { color: '#F1F5F9' },
      },
      x: {
        ticks: { font: { size: 10, weight: 700 as const }, color: '#64748B' },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── HERO COMMAND HEADER (ROUNDED) ───────────────────────────── */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #071425 0%, #0D1F3C 55%, #0A2744 100%)',
          padding: '32px 32px 28px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
        }}>
          {/* Grid overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(1,139,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(1,139,241,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', borderRadius: '20px', pointerEvents: 'none' }} />
          {/* Glows */}
          <div style={{ position: 'absolute', top: '-60px', left: '180px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(1,139,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '-40px', right: '100px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(175,82,222,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: '#018bf1', padding: '3px 10px', background: 'rgba(1,139,241,0.12)', borderRadius: '5px', border: '1px solid rgba(1,139,241,0.2)', textTransform: 'uppercase' }}>PMO Command Center</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34C759', display: 'inline-block', boxShadow: '0 0 6px #34C759' }} />LIVE
                </span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.05em', margin: '0 0 6px', color: 'white' }}>Portfolio Overview</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                {activeCount} active projects · {MOCK_PORTFOLIO.reduce((s, p) => s + p.team.length, 0)} team members · Updated just now
              </p>
            </div>
            {/* Mini KPI pills in hero */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { label: 'Budget', val: `$${(totalBudget/1000).toFixed(0)}K` },
                { label: 'Burn', val: `${burnPct}%` },
                { label: 'Avg SPI', val: avgSPI },
              ].map(pill => (
                <div key={pill.label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 18px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{pill.label}</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: 'white', fontVariantNumeric: 'tabular-nums' }}>{pill.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── KPI ROW inside hero card ─────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0', marginTop: '24px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            {kpis.map((k, i) => (
              <div key={k.label} style={{ padding: '14px 16px', borderRight: i < kpis.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.85rem', color: k.color }}>{k.icon}</span>
                  <span style={{ fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)' }}>{k.label}</span>
                </div>
                <p style={{ margin: '0 0 1px', fontSize: '1.3rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{k.value}</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>{k.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHARTS ROW ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '20px 20px 0' }}>
        {/* Donut — Budget Distribution */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>Budget Distribution</h4>
            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#94A3B8' }}>Planned budget allocation per project</p>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Bar — Completion vs Burn */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>Completion vs Budget Burn</h4>
            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#94A3B8' }}>% complete vs % of budget consumed</p>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '0', padding: '16px 20px 24px', gap: '16px' } as React.CSSProperties}>

        {/* ── PROJECT LEDGER ──────────────────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Project Ledger</h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748B' }}>Live health metrics across all engagements</p>
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#018bf1', background: 'rgba(1,139,241,0.08)', padding: '4px 12px', borderRadius: '6px', letterSpacing: '0.05em' }}>{MOCK_PORTFOLIO.length} PROJECTS</span>
          </div>

          {/* Column Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 90px 100px 110px 70px 70px 80px', gap: '8px', padding: '8px 12px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '8px' }}>
            {['Project', 'Phase', 'Budget', 'Progress', 'SPI', 'CPI', 'Risk'].map(h => (
              <span key={h} style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94A3B8' }}>{h}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {MOCK_PORTFOLIO.map((p, idx) => {
              const budgetPct = Math.min(100, Math.round((p.actual / p.budget) * 100));
              return (
                <div key={p.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 90px 100px 110px 70px 70px 80px',
                  gap: '8px',
                  padding: '14px 12px',
                  background: '#FAFBFC',
                  borderRadius: '12px',
                  border: '1px solid #F1F5F9',
                  alignItems: 'center',
                }}>
                  {/* Project + Client + Team */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: projectColors[idx % projectColors.length], flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>{p.name}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: trendColor(p.trend) }}>{trendIcon(p.trend)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '14px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{p.client}</span>
                      <span style={{ color: '#CBD5E1', fontSize: '0.7rem' }}>·</span>
                      <div style={{ display: 'flex' }}>
                        {p.team.slice(0, 3).map(t => (
                          <div key={t.name} title={`${t.name} — ${t.role}`} style={{ width: '18px', height: '18px', borderRadius: '50%', background: t.color, color: 'white', fontSize: '0.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white', marginLeft: '-3px' }}>{t.initials[0]}</div>
                        ))}
                        {p.team.length > 3 && <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#E2E8F0', color: '#64748B', fontSize: '0.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white', marginLeft: '-3px' }}>+{p.team.length - 3}</div>}
                      </div>
                    </div>
                  </div>
                  {/* Phase */}
                  <div><span style={{ fontSize: '0.68rem', fontWeight: 700, color: pc(p.phase), background: pc(p.phase) + '15', padding: '3px 8px', borderRadius: '5px', whiteSpace: 'nowrap' }}>{p.phase}</span></div>
                  {/* Budget */}
                  <div>
                    <p style={{ margin: '0 0 3px', fontSize: '0.82rem', fontWeight: 800, fontFamily: 'monospace', color: '#0F172A' }}>${(p.budget / 1000).toFixed(0)}K</p>
                    <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '99px', width: '70px' }}>
                      <div style={{ height: '100%', width: `${budgetPct}%`, background: budgetPct > 90 ? '#FF3B30' : '#018bf1', borderRadius: '99px' }} />
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '0.62rem', color: '#94A3B8', fontFamily: 'monospace' }}>${(p.actual / 1000).toFixed(0)}K used</p>
                  </div>
                  {/* Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{p.completion}%</span>
                      <span style={{ fontSize: '0.62rem', color: '#94A3B8' }}>{p.tasksCompleted}/{p.tasksTotal}</span>
                    </div>
                    <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '99px' }}>
                      <div style={{ height: '100%', width: `${p.completion}%`, background: 'linear-gradient(90deg, #018bf1, #7C3AED)', borderRadius: '99px' }} />
                    </div>
                  </div>
                  {/* SPI */}
                  <div>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: p.spi >= 1 ? '#34C759' : p.spi >= 0.85 ? '#FF9500' : '#FF3B30', fontFamily: 'monospace' }}>{p.spi.toFixed(2)}</p>
                    <p style={{ margin: 0, fontSize: '0.58rem', color: '#94A3B8' }}>schedule</p>
                  </div>
                  {/* CPI */}
                  <div>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: p.cpi >= 1 ? '#34C759' : p.cpi >= 0.85 ? '#FF9500' : '#FF3B30', fontFamily: 'monospace' }}>{p.cpi.toFixed(2)}</p>
                    <p style={{ margin: 0, fontSize: '0.58rem', color: '#94A3B8' }}>cost</p>
                  </div>
                  {/* Risk */}
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: rc(p.riskLevel), background: rc(p.riskLevel) + '15', padding: '3px 9px', borderRadius: '5px', display: 'block', textAlign: 'center' }}>{p.riskLevel}</span>
                    {p.riskCount > 0 && <p style={{ margin: '3px 0 0', fontSize: '0.58rem', color: '#94A3B8', textAlign: 'center' }}>{p.riskCount} open</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Upcoming Milestones */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>Upcoming Milestones</h4>
              <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#94A3B8' }}>Next 5 deliverables across portfolio</p>
            </div>
            <div style={{ padding: '8px' }}>
              {allMilestones.map((m, i) => {
                const days = daysUntil(m.date);
                return (
                  <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px', borderBottom: i < allMilestones.length - 1 ? '1px solid #F8FAFC' : 'none', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: mc(m.status) + '15', color: mc(m.status), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: 900, flexShrink: 0, textAlign: 'center', lineHeight: 1.1 }}>
                      {days <= 0 ? 'DUE' : `${days}d`}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 1px', fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
                      <p style={{ margin: '0 0 2px', fontSize: '0.65rem', color: '#94A3B8' }}>{m.project}</p>
                      <span style={{ fontSize: '0.62rem', fontWeight: 700, color: mc(m.status) }}>{m.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alerts */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>Portfolio Alerts</h4>
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {MOCK_PORTFOLIO.filter(p => p.riskLevel === 'Critical' || p.riskLevel === 'High' || p.spi < 0.85).map(p => (
                <div key={p.id} style={{ padding: '10px 12px', background: '#FFF8F0', border: '1px solid #FFE4B5', borderLeft: `3px solid ${rc(p.riskLevel)}`, borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '0.76rem', fontWeight: 700, color: '#0F172A' }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: '0.67rem', color: '#92400E' }}>
                    {p.riskLevel === 'Critical' ? '🔴 Critical risk level' : p.spi < 0.85 ? `⏱ SPI: ${p.spi} — schedule slipping` : '🔶 High risk — monitor closely'}
                  </p>
                </div>
              ))}
              {criticalCount === 0 && <p style={{ padding: '12px', textAlign: 'center', color: '#94A3B8', fontSize: '0.78rem' }}>✅ No critical alerts</p>}
            </div>
          </div>

          {/* Sector Breakdown */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>Sector Breakdown</h4>
            </div>
            <div style={{ padding: '14px 18px' }}>
              {Array.from(new Set(MOCK_PORTFOLIO.map(p => p.sector))).map(sector => {
                const count = MOCK_PORTFOLIO.filter(p => p.sector === sector).length;
                const pct = Math.round((count / MOCK_PORTFOLIO.length) * 100);
                return (
                  <div key={sector} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>{sector}</span>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{pct}%</span>
                    </div>
                    <div style={{ height: '5px', background: '#F1F5F9', borderRadius: '99px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: sectorColors[sector] || '#018bf1', borderRadius: '99px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
