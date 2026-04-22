import "./page.css";

export default function Dashboard() {
  return (
    <div className="dashboard-layout animate-fade-in">
      <div className="dashboard-main-column">
        
        {/* KPI Section */}
        <section className="kpi-outer-wrapper card">
          <div className="kpi-grid">
            
            {/* KPI Card 1 */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon-group">
                  <div className="kpi-icon blue-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                  </div>
                  <span className="kpi-title">Assigned Tasks</span>
                </div>
                <span className="kpi-value">10</span>
              </div>
              <div className="kpi-card-body">
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: '60%' }}></div>
                </div>
                <div className="kpi-footer">
                  <span className="kpi-footer-label">Submitted</span>
                  <span className="kpi-footer-val">6</span>
                </div>
              </div>
            </div>

            {/* KPI Card 2 */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon green-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                </div>
                <div className="kpi-action-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
              <div className="kpi-card-body mt-auto">
                <div className="kpi-footer">
                  <span className="kpi-footer-title">Approved</span>
                  <span className="kpi-value-lg">4</span>
                </div>
              </div>
            </div>

            {/* KPI Card 3 */}
            <div className="kpi-card">
              <div className="kpi-card-header">
                <div className="kpi-icon dark-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                </div>
                <div className="kpi-action-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
              <div className="kpi-card-body mt-auto">
                <div className="kpi-footer">
                  <span className="kpi-footer-title">Under Review</span>
                  <span className="kpi-value-lg">2</span>
                </div>
              </div>
            </div>

          </div>
        </section>
        
        {/* Task Schedule Section */}
        <section className="schedule-card card">
          <div className="schedule-header">
            <div className="schedule-title-group">
              <div className="schedule-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h2 className="schedule-title">Task Schedule</h2>
            </div>
            
            <div className="schedule-toggle">
              <div className="toggle-btn active">Tasks <span className="toggle-badge">10</span></div>
              <div className="toggle-btn">Recent Feedbacks <span className="toggle-badge outline">4</span></div>
            </div>
          </div>
          
          <div className="timeline-container">
            <div className="timeline-header">
              <div className="timeline-date">01 Mar</div>
              <div className="timeline-date">02 Mar</div>
              <div className="timeline-date active">03 Mar</div>
              <div className="timeline-date">04 Mar</div>
              <div className="timeline-date">05 Mar</div>
              <div className="timeline-date">06 Mar</div>
              <div className="timeline-date">07 Mar</div>
            </div>
            
            <div className="timeline-grid">
              {/* Timeline Items */}
              <div className="timeline-row">
                <div className="timeline-item item-red" style={{ left: '0%', width: '38%' }}>
                  <div className="item-content-wrapper">
                    <div className="item-icon-circle"></div>
                    <div className="item-details">
                      <div className="item-title">Social Media Post</div>
                      <div className="item-subtitle">03 Mar</div>
                    </div>
                  </div>
                  <span className="item-badge">Overdue</span>
                </div>
              </div>
              
              <div className="timeline-row">
                <div className="timeline-item item-yellow" style={{ left: '15%', width: '42%' }}>
                  <div className="item-content-wrapper">
                    <div className="item-icon-circle"></div>
                    <div className="item-details">
                      <div className="item-title">Social Media Post</div>
                      <div className="item-subtitle">04 Mar</div>
                    </div>
                  </div>
                  <span className="item-badge outline">In Progress <svg style={{marginLeft: '4px'}} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
                </div>
              </div>

              <div className="timeline-row">
                <div className="timeline-item item-gray" style={{ left: '33%', width: '38%' }}>
                  <div className="item-content-wrapper">
                    <div className="item-icon-circle"></div>
                    <div className="item-details">
                      <div className="item-title">Social Media Post</div>
                      <div className="item-subtitle">05 Mar</div>
                    </div>
                  </div>
                  <span className="item-badge outline">Approved <svg style={{marginLeft: '4px'}} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg></span>
                </div>
              </div>

              <div className="timeline-row">
                <div className="timeline-item item-purple" style={{ left: '55%', width: '35%' }}>
                  <div className="item-content-wrapper">
                    <div className="item-icon-circle"></div>
                    <div className="item-details">
                      <div className="item-title">Social Media Post</div>
                      <div className="item-subtitle">06 Mar</div>
                    </div>
                  </div>
                  <span className="item-badge">waiting</span>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>

      {/* Right Column for future widgets */}
      <div className="dashboard-right-column">
        <div className="side-widget card">
          <div className="side-widget-header">
            <div className="widget-icon">
              {/* Custom pie icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z" fill="currentColor"></path>
              </svg>
            </div>
            <div className="widget-header-text">
              <h3 className="widget-title">Overdue Status</h3>
              <p className="widget-subtitle">02 Task in Overdue</p>
            </div>
          </div>

          <div className="side-widget-cards">
            <div className="side-stat-card">
              <div className="side-stat-top">
                <div className="stat-icon-wrapper text-blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                </div>
                <div className="stat-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
              <div className="side-stat-bottom">
                <div className="side-stat-label">Overdue<br/>Tasks</div>
                <div className="side-stat-value">1</div>
              </div>
            </div>

            <div className="side-stat-card">
              <div className="side-stat-top">
                <div className="stat-icon-wrapper text-yellow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
                </div>
                <div className="stat-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
              <div className="side-stat-bottom">
                <div className="side-stat-label">Tasks Overdue<br/>Today</div>
                <div className="side-stat-value">1</div>
              </div>
            </div>
          </div>

          <div className="side-widget-actions">
            <button className="btn btn-outline">
              View All Tasks 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <button className="btn btn-primary">
              Submit Task 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>

        {/* Upcoming Deadlines Widget */}
        <div className="side-widget card" style={{ marginTop: '12px' }}>
          <div className="side-widget-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="widget-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z" fill="var(--primary-blue)"></path>
                </svg>
              </div>
              <div className="widget-header-text">
                <h3 className="widget-title">Upcoming Deadlines</h3>
                <p className="widget-subtitle" style={{ color: 'var(--text-muted)' }}>Coming in overdues</p>
              </div>
            </div>
            <button className="dropdown-badge">
              Priority 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>

          <div className="deadlines-list">
            <div className="deadline-item active-blue">
              <div className="deadline-left">
                <div className="deadline-time">10:00 <span className="am-pm">AM</span></div>
                <div className="deadline-title">Cabinet Meeting Results</div>
              </div>
              <div className="deadline-right">
                <div className="priority-tag tag-red-solid">
                  <span className="dot"></span> High
                </div>
                <div className="action-circle bg-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </div>

            <div className="deadline-item outline">
              <div className="deadline-left">
                <div className="deadline-time">10:00 <span className="am-pm">AM</span></div>
                <div className="deadline-title">Client presentation</div>
              </div>
              <div className="deadline-right">
                <div className="priority-tag tag-red-text">
                  <span className="dot"></span> High
                </div>
                <div className="action-circle bg-dark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </div>

            <div className="deadline-item outline">
              <div className="deadline-left">
                <div className="deadline-time">11:00 <span className="am-pm">AM</span></div>
                <div className="deadline-title">Police Drunk Animation</div>
              </div>
              <div className="deadline-right">
                <div className="priority-tag tag-blue-text">
                  <span className="dot"></span> Medium
                </div>
                <div className="action-circle bg-dark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </div>

            <div className="deadline-item outline">
              <div className="deadline-left">
                <div className="deadline-time">11:45 <span className="am-pm">AM</span></div>
                <div className="deadline-title">National Communique</div>
              </div>
              <div className="deadline-right">
                <div className="priority-tag tag-blue-text">
                  <span className="dot"></span> Medium
                </div>
                <div className="action-circle bg-dark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </div>
            
            <div className="deadline-item outline">
              <div className="deadline-left">
                <div className="deadline-time">12:00 <span className="am-pm">PM</span></div>
                <div className="deadline-title">Lunch Break</div>
              </div>
              <div className="deadline-right">
                <div className="priority-tag tag-green-text">
                  <span className="dot"></span> Low
                </div>
                <div className="action-circle bg-dark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
