'use client';
import { usePathname } from 'next/navigation';

export default function TopHeader() {
  const pathname = usePathname();
  
  const getTitle = () => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/tasks': return 'My Tasks';
      case '/reports': return 'Reports';
      case '/calendar': return 'Calendar';
      case '/media': return 'Media Library';
      case '/messages': return 'Messages';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="top-header">
      <h1 className="top-header-title">{getTitle()}</h1>
      <div className="top-header-actions">
        <button className="icon-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <div className="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search here" className="search-input" />
        </div>
      </div>
    </header>
  );
}
