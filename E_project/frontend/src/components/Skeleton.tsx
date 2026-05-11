'use client';

import './Skeleton.css';

interface SkeletonProps {
  variant: 'card' | 'chart' | 'kanban' | 'list' | 'text' | 'title' | 'stat';
  count?: number;
}

export default function Skeleton({ variant, count = 1 }: SkeletonProps) {
  const renderItems = () => {
    switch (variant) {
      case 'card':
        return Array(count).fill(0).map((_, i) => (
          <div key={i} className="skeleton-base skeleton-card" />
        ));
      
      case 'stat':
        return Array(count).fill(0).map((_, i) => (
          <div key={i} className="skeleton-base skeleton-header-stat" />
        ));

      case 'chart':
        return <div className="skeleton-base skeleton-chart" />;

      case 'kanban':
        return (
          <div style={{ display: 'flex', gap: '24px', overflow: 'hidden' }}>
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="skeleton-kanban-col">
                <div className="skeleton-base skeleton-title" style={{ width: '100px' }} />
                {Array(4).fill(0).map((_, j) => (
                  <div key={j} className="skeleton-base skeleton-task-card" />
                ))}
              </div>
            ))}
          </div>
        );

      case 'text':
        return Array(count).fill(0).map((_, i) => (
          <div key={i} className="skeleton-base skeleton-text" />
        ));

      case 'title':
        return <div className="skeleton-base skeleton-title" />;

      default:
        return <div className="skeleton-base skeleton-text" />;
    }
  };

  return <>{renderItems()}</>;
}
