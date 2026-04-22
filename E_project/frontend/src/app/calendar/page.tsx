'use client';

import { useState, useMemo } from 'react';
import './calendar.css';
import RightSidebar from '@/components/RightSidebar';
import { useProject } from '@/context/ProjectContext';

// ── Types ──────────────────────────────────────────────────────────────────
type EventType = 'task' | 'meeting' | 'milestone';

interface CalendarEvent {
  id: string;
  projectId: string;
  title: string;
  type: EventType;
  date: Date;
  startTime?: string;
  endTime?: string;
  priority?: 'High' | 'Medium' | 'Low';
  participants?: string[];
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_EVENTS: CalendarEvent[] = [
  { id: 'e1', projectId: 'p1', title: 'Acme: Requirements Sign-off', type: 'meeting', date: new Date(2026, 3, 20), startTime: '10:00', endTime: '11:30', participants: ['Alice', 'Bob'] },
  { id: 'e2', projectId: 'p1', title: 'Brand Deck Review', type: 'task', date: new Date(2026, 3, 22), priority: 'High' },
  { id: 'e3', projectId: 'p2', title: 'Tech Stack Sync', type: 'meeting', date: new Date(2026, 3, 22), startTime: '14:00', endTime: '15:00', participants: ['Dave'] },
  { id: 'e4', projectId: 'p2', title: 'Engineering Sprint 3 Ends', type: 'milestone', date: new Date(2026, 3, 25) },
  { id: 'e5', projectId: 'p3', title: 'Client Onboarding Call', type: 'meeting', date: new Date(2026, 3, 23), startTime: '09:00', endTime: '10:00' },
  { id: 'e6', projectId: 'p1', title: 'UX Audit Findings', type: 'task', date: new Date(2026, 3, 26), priority: 'Medium' },
  { id: 'e7', projectId: 'p2', title: 'Security Patch Deployment', type: 'task', date: new Date(2026, 3, 27), priority: 'High' },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarPage() {
  const { projects, selectedProject } = useProject();
  const [view, setView] = useState<'month' | 'week'>('month');
  
  // Start with April 2026 for mock consistency
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInCount = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding from prev month
    for (let i = 0; i < firstDay; i++) days.push({ padding: true });
    // Actual days
    for (let i = 1; i <= daysInCount; i++) {
        days.push({ day: i, date: new Date(year, month, i) });
    }
    return days;
  }, [currentDate]);

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(e => !selectedProject || e.projectId === selectedProject.id);
  }, [selectedProject]);

  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter(e => 
        e.date.getDate() === date.getDate() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getFullYear() === date.getFullYear()
    );
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  return (
    <main className="dashboard-layout">
      <div className="dashboard-main-column">
        <div className="calendar-page animate-fade-in">
          
          <header className="calendar-toolbar">
            <div className="calendar-nav-group">
                <h1 className="calendar-title">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</h1>
                <div className="calendar-arrows">
                    <button onClick={prevMonth} className="cal-nav-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <button onClick={goToToday} className="today-btn">Today</button>
                    <button onClick={nextMonth} className="cal-nav-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                </div>
            </div>

            <div className="calendar-actions">
                <div className="view-switcher">
                    <button className={`view-btn ${view === 'month' ? 'active' : ''}`} onClick={() => setView('month')}>Month</button>
                    <button className={`view-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>Week</button>
                </div>
                <div className="toolbar-divider" />
                <button className="toolbar-btn primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    New Event
                </button>
            </div>
          </header>

          <div className="calendar-grid-container">
            <div className="calendar-week-header">
                {WEEKDAYS.map(d => <div key={d} className="week-label">{d}</div>)}
            </div>

            <div className="calendar-month-grid">
                {daysInMonth.map((d, index) => {
                    if (d.padding) return <div key={`p-${index}`} className="calendar-day padding" />;
                    
                    const dayEvents = getEventsForDay(d.date!);
                    const isToday = d.day === 22 && currentDate.getMonth() === 3; // Mocking today as April 22

                    return (
                        <div key={d.day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                            <span className="day-number">{d.day}</span>
                            <div className="day-events">
                                {dayEvents.map(event => {
                                    const project = projects.find(p => p.id === event.projectId);
                                    return (
                                        <div 
                                            key={event.id} 
                                            className={`event-pill ${event.type}`}
                                            style={{ color: project?.color, background: `${project?.color}15`, borderLeft: `2px solid ${project?.color}` }}
                                        >
                                            <span className="event-type-dot" style={{ background: project?.color }} />
                                            <span className="event-label">{event.startTime ? `${event.startTime} ` : ''}{event.title}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-right-column">
        <RightSidebar mode="dashboard" />
      </div>
    </main>
  );
}
