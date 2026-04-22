'use client';

import React from 'react';

// ── Line Chart ─────────────────────────────────────────────────────────────
interface LineChartProps {
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
}

export function LineChart({ data, labels, height = 200, color = '#018bf1' }: LineChartProps) {
  const max = Math.max(...data) || 1;
  const padding = 40;
  const width = 600; // Reference width
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const points = data.map((val, i) => {
    const x = padding + (i * (innerWidth / (data.length - 1)));
    const y = height - padding - (val / max) * innerHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-container">
      {/* Grid Lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p) => {
        const y = height - padding - (p * innerHeight);
        return (
          <line key={p} x1={padding} y1={y} x2={width - padding} y2={y} className="chart-grid-line" />
        );
      })}

      {/* Line */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />

      {/* Points */}
      {data.map((val, i) => {
        const x = padding + (i * (innerWidth / (data.length - 1)));
        const y = height - padding - (val / max) * innerHeight;
        return (
          <circle key={i} cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" />
        );
      })}

      {/* X Axis Labels */}
      {labels.map((label, i) => {
        const x = padding + (i * (innerWidth / (data.length - 1)));
        return (
          <text key={i} x={x} y={height - 10} textAnchor="middle" className="chart-axis-label">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ── Bar Chart ──────────────────────────────────────────────────────────────
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value)) || 1;
  const padding = 40;
  const width = 600;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const barGap = 10;
  const barWidth = (innerWidth / data.length) - barGap;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart-container">
      {data.map((item, i) => {
        const x = padding + i * (barWidth + barGap);
        const bHeight = (item.value / max) * innerHeight;
        const y = height - padding - bHeight;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={bHeight}
              fill={item.color || '#018bf1'}
              rx="4"
            />
            <text x={x + barWidth / 2} y={height - 10} textAnchor="middle" className="chart-axis-label">
              {item.label}
            </text>
            <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" style={{ fontSize: '0.7rem', fill: 'var(--text-main)', fontWeight: 500 }}>
              {item.value}
            </text>
          </g>
        );
      })}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-color)" />
    </svg>
  );
}

// ── Donut Chart ────────────────────────────────────────────────────────────
interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 180 }: DonutChartProps) {
  const total = data.reduce((acc, current) => acc + current.value, 0);
  let currentAngle = -90;
  const radius = size / 2 - 20;
  const center = size / 2;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width={size} height={size}>
        {data.map((item, i) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;
          const rotation = currentAngle;
          currentAngle += (percentage / 100) * 360;

          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              transform={`rotate(${rotation} ${center} ${center})`}
            />
          );
        })}
        <circle cx={center} cy={center} r={radius - strokeWidth / 2 - 5} fill="white" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" style={{ fontSize: '1.2rem', fontWeight: 600, fill: 'var(--text-main)' }}>
          {total}
        </text>
        <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" style={{ fontSize: '0.7rem', fill: 'var(--text-muted)' }}>
          Total Tasks
        </text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.label}:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
